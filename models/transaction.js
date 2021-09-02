const logger = require("../logger/logger")
const { TransactionDb, WalletDb } = require("../utils/mongodb")


async function createTransaction(id, amount, description){
    logger.debug(id)
    try{
        let walletRecord = await WalletDb.findById(id)
        walletRecord = walletRecord._doc
        if(walletRecord.balance - amount < 0){
            return Promise.reject(new Error("Not enough balance to complete this transaction"))
        }
        const newTransaction = new TransactionDb({
            walletId: id,
            amount: amount,
            balance: (walletRecord.balance + amount).toPrecision(4),
            description : description,
            type : (amount > 0) ? 'CREDIT' : 'DEBIT' 
        })
        const record = await newTransaction.save()
        return record
    }
    catch(e){
        logger.error("Transaction failed : ", e.toString())
        return null
    }

}

async function getTransaction(walletId, skip, limit){
    try{
        const record = await TransactionDb.find({ walletId: walletId }).skip(Number(skip)).limit(limit);
        logger.debug('record found : ', record)
        return record;
    }
    catch(e){
        logger.error('Failed to get Transactions :', e)
        return Promise.reject(new Error(`DB Error: ${e.toString()}`));
    }
}

module.exports = {
    getTransaction,
    createTransaction,
}