const { join } = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
const api = require('./routes');

const { 
	secret, 
	es256Private, 
	es256Public, 
	ethAddress, 
	ropstenId, 
	ethBaseGasLimit, 
	ethGasPricePerByte,
	ropstenInfuraApi,
	burnAddress
} = require('./helper/constant')
const EthereumTx = require('ethereumjs-tx')
const Web3 = require('web3');
const PORT = 8080;

app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true })); 
app.use(cors())

app.use(function(req, res, next) {
	if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Beaer') {
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
app.get('/tx', (req, res) => {
	const web3 = new Web3(new Web3.providers.HttpProvider(ropstenInfuraApi));

	const obj = {
		a: "a demo"
	}

	const strObj = JSON.stringify(obj)
	const buffer = Buffer.from(strObj)
	const encoded = '0x' + buffer.toString('hex')
	web3.eth.getTransactionCount(ethAddress)
		.then((count) => {
			return {
				nonce: web3.utils.toHex(count),
				gasPrice: web3.utils.toHex(55e9), 
				gasLimit: web3.utils.toHex(ethBaseGasLimit + ethGasPricePerByte * buffer.length),
				to: burnAddress, 
				value: '0x00', 
				data: encoded,
				chainId: ropstenId
			  }
		})
		.then((txData) => {
			console.log(txData)
			const tx = new EthereumTx(txData)
			tx.sign(Buffer.from('165884bba6f397852ac47428750091baebd33f8195cbb0b22206561228835806', 'hex'))
			return '0x' + tx.serialize().toString('hex')
		})
		.then((signedTx) => web3.eth.sendSignedTransaction(signedTx))
		.then((resTx) => {
			console.log(resTx.transactionHash)
			res.send(resTx)
		})
		.catch((err) => {
			console.log(err)
			res.send("errr")
		})
});
app.get('*', (req, res) => {
	res.sendFile(join(__dirname, '../../public/index.html'));
});

app.listen(PORT, () => console.log('listening on port', PORT));
