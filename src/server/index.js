const { join } = require('path');
const express = require('express');
const app = express();
const PORT = 8080;

app.use(express.static(join(__dirname, 'dist')));

app.get('*', (req, res) => {
	res.sendFile(join(__dirname, 'public/index.html'));
});

app.listen(PORT, () => console.log('listening on port', PORT));
