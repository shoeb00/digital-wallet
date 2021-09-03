const app = require('express')()
const cookieParser = require('cookie-parser');
const logger = require('../logger/logger');
const { WalletDb } = require('../utils/mongodb');

app.use(cookieParser())

async function createWallet(name) {
    try{
        const newWallet = new WalletDb({
            name,
            balance: 0,
        })
        const record = await newWallet.save();
        return record;
    }
    catch(e){
        logger.error('Failed to create new wallet :', e)
        return Promise.reject(new Error(`DB Error: ${e.toString()}`));
    }
}

async function getWallet(id){
    try{
        const record = await WalletDb.findById(id);
        if(record) {
            record.id = record._id;
            delete record._id;
        }
        return record;
    }
    catch(e){
        logger.error('Failed to create new wallet :', e)
        return Promise.reject(new Error(`DB Error: ${e.toString()}`));
    }
}


module.exports = {
    createWallet,
    getWallet,
}
