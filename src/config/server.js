const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookie = require('cookie-parser');
const session = require('express-session');
const path = require('path');
const cors = require('cors');

require('dotenv').config();
const SECRET_KEY = process.env.SECRET_KEY;

const init = () => {
    const app = express();
    app.use(cors());
    app.use(morgan('dev'));
    app.use(express.json());
    app.use(express.static(path.join(__dirname, '../public')));
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(
        session({
            secret: SECRET_KEY,
            resave: false,
            saveUninitialized: true,
            cookie: { secure: false, maxAge: 30000000 },
        }),
    );
    app.use(cookie());

    return app;
};

module.exports = { init };
