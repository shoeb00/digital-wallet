const mongoose = require('mongoose');
const logger = require('../logger/logger');
const config = require('../config.json');
const { Schema } = mongoose;

const db_uri = process.env.DB_URI || config.db_uri;

(async()=>{
    try{
        await mongoose.connect(db_uri, {useNewUrlParser: true});
        logger.info('connected to mongodb on: ' + db_uri);
    }catch(e){
        logger.error('unable to connect to DB: ', e)
    }
})()

const walletSchema = new Schema({
    balance : Number,
    name : String,
    date : { type: Date, default: Date.now() },
})

const transacSchema = new Schema({
    walletId : String,
    amount : Number,
    balance : Number,
    description : String,
    type : String,
    date : { type: Date, default: Date.now() }
})

const WalletDb = mongoose.model('Wallets', walletSchema);
const TransactionDb = mongoose.model('Transactions', transacSchema);

module.exports = {
    WalletDb,
    TransactionDb
}