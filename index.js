const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');

const app = express();
const PORT = process.env.PORT || 8000;
const { mongoURI } = require('./config/keys');
const { appModules } = require('./config/appConfig');

mongoose.connect(mongoURI)
    .then(() => console.log('DB CONNECTED!'))
    .catch(err => console.log('ERR::', err));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

require('./config/passport')(passport);

app.get('/', (req, res) => {
    return res.send('HELLO WORLD!');
});

appModules.forEach(module => {
    const routerPath = `./modules/${module}/${module}.router`;
    const router = require(routerPath);

    app.use(`/api/${module}`, router);
});

app.listen(PORT, () => {
    console.log('listening to port', PORT);
});
