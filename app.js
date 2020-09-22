require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();
const PORT = process.env.PORT || 6000

app.use(bodyParser.json());
app.use(cookieParser());

const { verify } = require('./middleware');
const { login, refresh } = require('./authentication');

app.post('/login', login);
app.post('/refresh', refresh);

app.get('/test', verify, (req, res) => {
    return res.json({
        a: 'authentication success'
    });
})



app.listen(PORT, () => {
    console.log('port ' + PORT);
})

