const express = require('express');
const router = express.Router();
const logger = require('../logger/logger')
const { createWallet, getWallet } = require('../models/wallet');
const { createTransaction } = require('../models/transaction');

router.get('/', (req, res) => {
  return res.redirect('/home');
})


router.get('/home', async (req, res) => {
    try {
      const wallet = await getWallet(req.user);
      if(!wallet) {
        res.cookie('XW_ID', "");
        return res.publish({ message: 'No wallet found with id ' + req.user }, '', 400);
      }
      return res.publish(wallet, 'home');
    } catch (e) {
      return res.status(500).json({ message: 'Server encountered an error', description: e.toString() });
    }
});

router.get('/wallet/:id', async (req, res) => {
  try{
    const record = await getWallet(req.params.id)
    res.status(200).json(record)
  }catch(e){
    return res.status(500).json({ message: 'Server encountered an error', description: e.toString() });
  }
});

router.post('/setup', async (req, res)=> {
  try {
    if(!req.body.name) {
      return res.status(400).json({
        'message' :'name is a required field'
      });
    }
    const balance = Number(req.body.balance);
    if(!balance || balance < 0){
      return res.status(400).json({
        'message' : 'Initial balance cannot be empty or negative'
      });
    }

    const wallet = await createWallet(req.body.name);
    const trans = await createTransaction(wallet.id, balance, 'wallet initial balance');
    res.cookie('XW_ID', wallet._doc._id.toString());
    res.publish({'id': wallet.id, 'name' : wallet.name, 'balance' : trans.balance}, 'home')
  } 
  catch(e) {
    return res.status(500).json({ message: 'Server encountered an error', description: e.toString() });
  }
})

module.exports = router;
