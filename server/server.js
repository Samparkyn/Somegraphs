const express    = require('express');
const bodyParser = require('body-parser');
const cors       = require('cors')
const app        = express();
const port       = 8000;

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

const data = require('../data.json')

app.listen(port, () => {
  console.log("Ready on port:", port);
});

app.get('/data', function (req, res) {
  res.header("Content-Type",'application/json');
  res.send(JSON.stringify(data));
})
