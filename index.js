const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

require('./controllers/authcontroller')(app);
require('./controllers/nutricionistacontroller')(app);

app.listen(9000);
