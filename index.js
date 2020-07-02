const express = require('express');
const bodyParser = require('body-parser');

const cors = require('cors');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(cors());

require('./controllers/authcontroller')(app);
require('./controllers/nutricionistacontroller')(app);

app.listen(9000, err => {
    if (err) 
        return console.error(err);
 
    return console.log(`server is listening on 9000`);
 });