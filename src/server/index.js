const { join } = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
const api = require('./routes');

const { SECRET } = require('./helper/constant')

const PORT = 8080;

app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true })); 
app.use(cors())

app.use(function(req, res, next) {
	if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Beaer') {
		jwt.verify(req.headers.authorization.split(' ')[1], SECRET, function(err, decode) {
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

app.get('*', (req, res) => {
	res.sendFile(join(__dirname, '../../public/index.html'));
});

app.listen(PORT, () => console.log('listening on port', PORT));
