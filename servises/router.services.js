const  mongo  = require('../db/mongo');
const {ObjectId} =  require('mongodb')
const bcrypt = require('bcrypt');
const jwt =  require('jsonwebtoken');
const email = require('../Emailer/email');
const schema = require('../Schema/auth.schema');

const services = {

  register: async (req, res) => {
    try{
        const {error, value}= await schema.registerSchema.validate(req.body);
        if(error) return res.status(400).send(error.details[0].message);

        value.email = value.email.toLowerCase();

        // checking weather user already registered or not
        const user = await mongo.db.collection('userdetails').findOne({email:value.email});
        if(user) return res.status(403).send({message:"Email already registered!"})

        //encrypting password
        const salt = await bcrypt.genSalt();
        value.password = await bcrypt.hash(value.password , salt);

        // adding user to database
        await mongo.db.collection('userdetails').insertOne(value);
        res.status(201).send("registered Succesfully");
    }
    catch(error){
        res.status(400).send(error);
    }
  },

  login: async(req, res) => {
     try{
        const {error, value}= await schema.loginSchema.validate(req.body);
        if(error) return res.status(403).send(error.details[0].message);

        value.email = value.email.toLowerCase();
        // checking weather user exists
        const user = await mongo.db.collection('userdetails').findOne({email:value.email});
        if(!user) return res.status(403).send({message:"Email not registered"})

        //checking weather the entered password is correct or not
        const data = await bcrypt.compare(value.password, user.password);
        if(data){
            const token = await jwt.sign({UserId: user._id }, process.env.pass);
            return res.send({token});
        }
        else
        req.status(403).send({message:"email or passwod invalid"})
     }
     catch(error){
        res.status(400).send({message:"email or passwod invalid"});
     }
  },

  forgotpassword: async(req, res) => {
    try{
      const{error , value} = await schema.forgetPasswordSchema.validate(req.body);
      if(error) return res.status(403).send(error.details[0].message)

      value.email = value.email.toLowerCase();

      // checking weather user exists
      const user = await mongo.db.collection('userdetails').findOne({email:value.email});
      if(!user) return res.status(403).send({message:"Email not registered"})
      const code = Math.random().toString(36).slice(-6);
      await email(value.email , `http://localhost:3000/forgotpassword/${user._id}/verification + ${code}`);
      await mongo.db.collection('userdetails').updateOne({email:value.email} , {$set:{code: code ,resetpassord: false }})
      res.send({message:"email send successfully"})
      console.log("success")
    }
    catch(error){
        res.status(400).send(error);
    }
    },

    checkcode: async(req, res) =>{
      try{
        const{error , value} = await schema.checkcode.validate(req.body);
        if(error) return res.status(403).send(error.details[0].message)
        const user = await mongo.db.collection('userdetails').findOne({_id: ObjectId(value.id)});
        // if(user.code.split(' ').length === 2) user.code = user.code.split(' ')[1];
        if(user.code === value["code"]){
            await mongo.db.collection('userdetails').updateOne({_id: ObjectId(value.id)}, {$set:{resetpassord: true}})
            return res.send("done")
        }
        res.status(403).send("failed")
      }
      catch (error){
        res.status(403).send("failed")
      }
    },

    createnewpassword: async(req, res) =>{
        const{error , value} = await schema.createnewpassword.validate(req.body);
        if(error) return res.status(403).send(error.details[0].message)
        const user = await mongo.db.collection('userdetails').findOne({_id: ObjectId(value.id)});

        if(user.resetpassord === true){
        const salt = await bcrypt.genSalt();
        value.password = await bcrypt.hash(value.password , salt);
        await mongo.db.collection('userdetails').updateOne({_id: ObjectId(value.id)} , {$set:{password: value.password}, $unset:{code: "" ,resetpassord:""}})
        return res.send({message: "password changed"})
        }
        else{
            res.send({message:"click the link on the email to reset"})
        }

    }
};

module.exports = services;
