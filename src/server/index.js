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

const {getCerts, getCertsOfUser} = require('./issuer/issuer-dao')
const {getJobsOf, getJobs, getAppliedJobsOf } = require('./job/job-dao')
const {getUserProfileById, getUsersLike} = require('./user/user-dao')
const { ServerError } = require('./helper/server-error')
const { prop } = require('ramda')
const { clean } = require('./helper/functions')
fetch.Promise = Bluebird;

const { 
	secret, 
	ropstenInfuraApi,
	userRole,
	appliedJobStatus,
	requestedCertStatus
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

	if (cert.signature.proofs.length === 0) {
		return cert.signature.merkleRoot === cert.signature.targetHash
	} else {
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


app.get("/api/jobs", (req, res) => {
    getJobs()
        .then(([rows]) => {
            res.send({jobs: rows})
        })
        .catch(err => { console.log(err); res.status(500).send({ message: "Server error" })})
})

app.get("/api/users/:id/certs", (req, res) => {
	getCertsOfUser(req.params.id)
		.then(([rows]) => {
			rows.forEach(row => {
				row.blockCert = JSON.parse(row.cert_json)
				delete row.cert_json
				row.status = row.status === requestedCertStatus.pending ? "pending" : requestedCertStatus.approved ? "approved" : "rejected"
			})
			res.send({certs: rows})
		})
		.catch(err => { console.log(err); res.status(500).send({ message: "Server error" })})
}) 

app.get("/api/users/:id/jobs", (req, res) => {
	getAppliedJobsOf(req.params.id)
		.then(([rows]) => {
			rows.forEach(row => {
				delete row.id
				row.status = row.status === appliedJobStatus.pending ? "pending" : appliedJobStatus.approved ? "approved" : "rejected"
			})
			res.send({jobs: rows})
		})
		.catch(err => { console.log(err); res.status(500).send({ message: "Server error" })})
}) 

app.get("/api/users/:id", (req, res) => {
    getUserProfileById(req.params.id)
        .then(([rows]) => {
            if (rows[0]) {
                delete rows[0].password_hash
                
                let userProfile = rows[0]
                if(rows[0].skill_name) {
                    userProfile.skills = rows.map(prop('skill_name'))
                    
                }

                clean(userProfile)
                delete rows[0].skill_name
                res.send(userProfile)
            } else {
                throw new ServerError("User is not exist!", 403)
            }
            
        })
        .catch(err => { console.log(err); res.status(500).send({ message: "Server error" })})
})

app.get("/api/employers/:id/jobs", (req, res) => {
    getJobsOf(req.params.id)
        .then(([rows]) => {
            res.send({jobs: rows})
        })
        .catch(err => { console.log(err); res.status(500).send({ message: "Server error" })})
})

app.get("/api/issuers/:id/certs", (req, res) => {
    getCerts(req.params.id)
		.then(([rows]) => {
			rows.forEach(row => {
				delete row.password_hash
				row.status = row.status === requestedCertStatus.pending ? "pending" : requestedCertStatus.approved ? "approved" : "rejected"
			});
			res.send({certs: rows})
		})
		.catch(err => { console.log(err); res.status(500).send({ message: "Server error" })})
})

app.get("/api/users/search/:text", (req, res) => {
    getUsersLike(req.params.text)
		.then(([rows]) => {
			rows.forEach(row => {
				delete row.password_hash
			});
			res.send({users: rows})
		})
		.catch(err => { console.log(err); res.status(500).send({ message: "Server error" })})
})


app.get('*', (req, res) => {
	res.sendFile(join(__dirname, '../../public/index.html'));
});

app.listen(PORT, () => console.log('listening on port', PORT));
