const express = require('express');
const logger = require('../logger/logger');
const router = express.Router();
const {createTransaction, getTransaction} = require('../models/transaction')


router.get('/', async (req, res) => {
  try{
    let id;
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
    }
    id = req.user
    const record = await getTransaction(id, req.query.skip=0, req.query.limit = 10);
    return res.publish(record, 'transaction');
  }
  catch(e){
    return res.status(500).json({ message: 'Server encountered an error', description: e.toString() });
  }
})

router.post('/:id', async (req, res) => {
  try{
    if(!req.body.amount || !req.body.description){
      return res.status(400).json({
        message: "Amount and Description are required fields"
      })
    }
    const record = await createTransaction(req.params.id, req.body.amount, req.body.description)
    res.status(200).json(record)
  }
  catch(e){
    return res.status(500).json({ message: 'Server encountered an error', description: e.toString() });
  }
})


module.exports = router;
