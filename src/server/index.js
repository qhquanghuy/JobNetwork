const { join } = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');


const app = express();
const api = require('./routes');

const { sha256 } = require('./helper/functions')
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
} = require('./helper/constant')

const Web3 = require('web3');
const PORT = 8080;

app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true })); 
app.use(cors())

app.use(function(req, res, next) {
	if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
		jwt.verify(req.headers.authorization.split(' ')[1], secret, function(err, decode) {
			if (err) req.user = undefined;
			req.user = decode;
			next();
	  });
	} else {
	  req.user = undefined;
	  next();
	}
});

app.use(express.static(join(__dirname, 'dist')));



app.use('/api', api);

function getHash(cert) {
	return sha256(stringify({
		issuedOn: cert.issuedOn,
		cert: cert.cert,
		issuer: cert.issuer,
		recipientProfile: cert.recipientProfile
	}))
}

function checkTargetHash(cert) {
	const targetHash = cert.signature.targetHash

	const hash = getHash(cert).toString('hex')
	return targetHash === hash
}

function checkProof(cert) {
	const merkleRoot = Buffer.from(cert.signature.merkleRoot, 'hex')
	const targetHash = getHash(cert)

	const proofs = cert.signature.proofs.map((proof) => {
		return {
			...proof,
			data: Buffer.from(proof.data, 'hex')
		}
	})

	const tree = new MerkleTree([], sha256)


	return tree.verify(proofs, targetHash, merkleRoot)
}

function checkIssuerAddress(cert, tx) {
	return tx.from === cert.issuer.address
}

function checkMerkleRoot(cert, tx) {
	return tx.input === '0x' + cert.signature.merkleRoot
}

// function check

app.post('/api/cert/verify', (req, res) => {
	const cert = req.body.cert
	const web3 = new Web3(new Web3.providers.HttpProvider(ropstenInfuraApi));
	web3.eth.getTransaction(cert.signature.txHash)
		.then(tx => {
			return checkTargetHash(cert) 
			&& checkProof(cert)
			&& checkIssuerAddress(cert, tx)
			&& checkMerkleRoot(cert, tx)
		})
		.then(isValid => {
			res.send({isValid: isValid})
		})
		.catch(err => res.sendStatus(500))
})

app.get('*', (req, res) => {
	res.sendFile(join(__dirname, '../../public/index.html'));
});

app.listen(PORT, () => console.log('listening on port', PORT));
