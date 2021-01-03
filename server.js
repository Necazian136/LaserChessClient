const express = require('express');

const app = express();

app.use(express.static('./dist/LaserChess'));

app.get('/*', (req, res) =>
  res.sendFile('index.html', {root: 'dist/LaserChess/'}),
);

app.listen(process.env.PORT || 8080);
