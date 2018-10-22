const { join } = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const api = require('./routes');


const PORT = 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(cors())


app.use(express.static(join(__dirname, 'dist')));


app.get('*', (req, res) => {
	res.sendFile(join(__dirname, '../../public/index.html'));
});

app.use('/api', api);

app.listen(PORT, () => console.log('listening on port', PORT));
