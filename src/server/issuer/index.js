/*
 * File: index.js
 * Project: simple-react-full-stack
 * File Created: Monday, 22nd October 2018 11:05:51 am
 * Author: huynguyen (qhquanghuy96@gmail.com)
 * -----
 * Last Modified: Monday, 3rd December 2018 9:11:45 am
 * Modified By: huynguyen (qhquanghuy96@gmail.com)
 * -----
 */





const express = require('express');
const router = express.Router();
const { sha256 } = require('./../helper/functions')
const jwt = require('jsonwebtoken');
const { getUserProfileById } = require('./../user/user-dao')
const { createIssuerMember, createCert, updateSuccessCert } = require('./issuer-dao')
const MerkleTree = require('merkletreejs')
const stringify = require('json-stable-stringify')
const fetch = require('node-fetch');
const Bluebird = require('bluebird');
 
fetch.Promise = Bluebird;

const { 
	secret, 
	es256Private, 
	es256Public, 
	ropstenId, 
	ethBaseGasLimit, 
	ethGasPricePerByte,
	ropstenInfuraApi,
    burnAddress,
    userRole
} = require('./../helper/constant')

const Web3 = require('web3');

router.post("/verifymember", (req, res) => {
    const encodedData = req.body.encoded
    try {
        const decodedData = jwt.decode(encodedData)
        const requestData = jwt.verify(decodedData.token, secret)
        getUserProfileById(requestData.issuerId)
            .then(([rows]) => {
                if (rows[0]) {
                    const publicKey = rows[0].ecPublicKey
                    jwt.verify(encodedData, publicKey, {algorithms: "ES256"}, (err, data) => {
                        if (err) {
                            console.log(err)
                            res.sendStatus(401)
                        } else {
                            console.log(data)
                            createIssuerMember(requestData.issuerId, requestData.userId, data.id)
                                .then((id) => {
                                    console.log(id)
                                    res.send({redirectUrl: "some url"})
                                })
                        }
                    })
                } else {
                    res.sendStatus(404)
                }
            })

    } catch (error) {
        res.sendStatus(401)
    }
    

})


router.post("/cert/issue", (req, res) => {
    if (req.user && req.user.role === userRole.issuer) {
        const cert = {
            issuerId: req.user.id,
            title: req.body.title,
            description: req.body.description,
            badgeIcon: req.body.badgeIcon
        }
        createCert(cert)
            .then(() => {
                res.sendStatus(200)
            })
            .catch(err => console.log(err))
    } else {
        res.sendStatus(401)
    }
})
/**
 * {
        issuedOn: ....
        cert: {
            id: ...
            title:...
            description:...
            icon:...
            createdAt:...
        },
        issuer: {
            id:...
            email:....
            name:...
            webPage:....
            address:...
            revocationList:...
        },
        recipientProfile: {
            id:...
            email:...
            name:...
        },
        signature: {
            txHash:...
            targetHash:...
            merkleRoot:...
            proofs: [
                {

                }
            ]
        }

    }
*/
function createRawTx(web3, data, nonce) {
    return {
        nonce: web3.utils.toHex(nonce),
        gasPrice: web3.utils.toHex(55e9),
        gasLimit: web3.utils.toHex(ethBaseGasLimit + ethGasPricePerByte * data.length),
        to: burnAddress,
        value: '0x00',
        data: '0x' + data.toString('hex'),
        chainId: ropstenId
    }
}

router.post("/cert/publish", (req, res) => {
    if (req.user && req.user.role === userRole.issuer) {
        const leaves = req.body.certs.map(cert => sha256(stringify(cert)))
        const tree = new MerkleTree(leaves, sha256)
        const buffer = tree.getRoot();
        const web3 = new Web3(new Web3.providers.HttpProvider(ropstenInfuraApi));
        web3.eth.getTransactionCount(req.body.certs[0].issuer.address)
            .then((count) => {
                return createRawTx(web3, buffer, count)
            })
            .then((txData) => {
                console.log(txData)
                const body = jwt.sign(txData, es256Private, {algorithm: "ES256"})
                return fetch(req.body.certs[0].issuer.webPage + "/eth/sign", {
                    method: 'post',
                    body: JSON.stringify({token: body}),
                    headers: { 'Content-Type': 'application/json' },
                })
            })
            .then(res => res.json())
            .then(data => '0x' + data.signed)
            .then((signedTx) => web3.eth.sendSignedTransaction(signedTx))
            .then((resTx) => {
                return req.body.certs.map((cert, idx) => {
                    const leaf = leaves[idx]
                    return {
                        ...cert,
                        signature: {
                            txHash: resTx.transactionHash,
                            targetHash: leaf.toString('hex'),
                            merkleRoot: buffer.toString('hex'),
                            proofs: tree.getProof(leaf).map(proof => {
                                return {
                                    ...proof,
                                    data: proof.data.toString('hex')
                                }
                            })
                        }
                    }
                })
            })
            .then(publisedCert => {
                return updateSuccessCert(publisedCert)
            })
            .then((some) => {
                console.log(some)
                res.sendStatus(200)
            })
            .catch((err) => {
                console.log(err)
                res.sendStatus(500)
            })
    } else {
        res.sendStatus(401)
    }
})


module.exports = router;
