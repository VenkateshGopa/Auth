const express = require('express');
const mongo = require('../db/mongo');
const router= express.Router();
const{ObjectId} = require('mongodb')
router.get('/data', async (req, res)=>{
    const data =await mongo.db.collection('userdetails').findOne({_id:ObjectId(req.user)})
    res.send(data);
})

module.exports=router;