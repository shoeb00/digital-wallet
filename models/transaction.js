const logger = require("../logger/logger")
const { TransactionDb, WalletDb } = require("../utils/mongodb")


async function createTransaction(id, amount, description){
    try{
        amount = Number(amount);
        let walletRecord = await WalletDb.findById(id)
        logger.info('walletRecord: ', walletRecord)
        if(walletRecord.balance + amount < 0){
            return Promise.reject(new Error("Not enough balance to complete this transaction"))
        }
        const balance = (walletRecord.balance + amount).toPrecision(4);

        const newTransaction = new TransactionDb({
            walletId: id,
            amount: amount,
            balance: balance,
            description : description,
            type : (amount > 0) ? 'CREDIT' : 'DEBIT' 
        });
        walletRecord.balance = balance;
        await walletRecord.save();
        const record = await newTransaction.save()
        const res = {
            walletId: walletRecord._id,
            id: record._id,
            amount: record.amount,
            balance: walletRecord.balance,
            description: record.description,
            type: record.type,
        }
        return res;
    }
    catch(e){
        logger.error("Transaction failed : ", e.toString())
        return Promise.reject(new Error("DBError: " + e.toString()));
    }

}

async function getTransaction(walletId, skip = 0, limit = 10){
    try{
        const record = await TransactionDb.find({ walletId: walletId }).skip(Number(skip)).limit(limit);
        if(record && record.length > 0) {
            for(let i=0; i< record.length; i++) {
                record[i].id = record[i]._id;
                delete record[i]._id;
            }
        }
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