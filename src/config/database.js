const mongoose = require('mongoose');
require('dotenv').config();
const DB_URL = process.env.DB_URL;

async function connect() {
    try {
        await mongoose.connect(DB_URL);
        console.log('Database Connected');
    } catch (error) {
        console.log(error);
        throw error;
    }
}

module.exports = { connect };
