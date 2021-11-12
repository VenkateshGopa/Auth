const express = require('express');
const mongo = require('../db/mongo');
const router= express.Router();
const{ObjectId} = require('mongodb')
router.get('/note', async (req, res)=>{
    const data =await mongo.db.collection('userdetails').findOne({_id:ObjectId(req.user)})
    const data1 =await mongo.db.collection('notes').findOne({email:data.email})
    res.send({firstname:data.firstname, lastname:data.lastname, note:data1.note, email:data.email });
})

router.post('/note' ,async (req, res)=>{
    try{
    await mongo.db.collection('notes').updateOne({email:req.body.email},{$set:{note: req.body.note}})
    res.status(200).send("saved");
    }
    catch{
        res.status(400).send({error:"failed to save data"})
    }
})
module.exports=router;
