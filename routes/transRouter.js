const express = require('express');
const logger = require('../logger/logger');
const router = express.Router();
const {createTransaction, getTransaction} = require('../models/transaction');
const { getWallet } = require('../models/wallet');


router.get('/', async (req, res) => {
  try{
    let id = req.user, limit = 100;
    if(!req.browser){
      if(!req.query.walletId) {
        return res.publish({ 'message': 'walletId is required' }, 'error', 400);
      }
      if(req.query.skip < 0){
        return res.status(400).json({
          'message' :'Skip cannot be a negative number'
        });
      } 
      id = req.query.walletId;
      limit = req.query.limit;
    } 
    const record = await getTransaction(id, req.query.skip, req.query.limit);
    return res.publish({data: record}, 'transaction');
  }
  catch(e){
    return res.status(500).json({ message: 'Server encountered an error', description: e.toString() });
  }
});

router.get('/download', async (req, res) => {
    try {
      if(!req.user && !req.query.walletId) {
        return res.publish({ message: 'wallet id required'}, 'error', 400);
      }
      const id = req.user || req.query.walletId;
      const record = await getTransaction(id, req.query.skip, req.query.limit);
      let csvData = "Sl.no,Id,Amount,Balance,Description,Type,Date\n";
      for(let i=0; i<record.length; i++) {
        csvData += `${i+1},${record[i].id},${record[i].amount},${record[i].balance},${record[i].description},${record[i].type},${new Date(record[i].date).toISOString()}\n`;
      }
      res.setHeader('Content-Type', 'text/csv');
      return res.status(200).send(csvData);
    } catch (e) {
      return res.status(500).json({ message: 'Server encountered an error', description: e.toString() });
    }
});

router.post('/:id', async (req, res) => {
  try{
    if(!req.body.amount || !req.body.description){
      return res.status(400).json({
        message: "Amount and Description are required fields"
      })
    }
    console.log('Transaction: ', req.body, req.params.id)
    const record = await createTransaction(req.params.id, req.body.amount, req.body.description)
    res.status(200).json(record)
  }
  catch(e){
    return res.status(500).json({ message: 'Server encountered an error', description: e.toString() });
  }
})

router.post('/', async(req, res) => {
  try{
    if(!req.user) {
      return res.redirect('/register');
    }
    const type = req.body.type;
    if(type && type.toLowerCase() === 'debit'){
      req.body.amount *= -1 
    } 
    await createTransaction(req.user, req.body.amount, req.body.description)
    const record = await getWallet(req.user);
    return res.render('home', record);
  }
  catch(e){
    return res.status(500).json({ message: 'Server encountered an error', description: e.toString() });
  }
})


module.exports = router;
