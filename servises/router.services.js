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
        if(error) return res.status(400).send({error:error.details[0].message});

        value.email = value.email.toLowerCase();

        // checking weather user already registered or not
        const user = await mongo.db.collection('userdetails').findOne({email:value.email});
        if(user) return res.status(403).send({error:"Email already registered!"})

        //encrypting password
        const salt = await bcrypt.genSalt();
        value.password = await bcrypt.hash(value.password , salt);

        // adding user to database
        await mongo.db.collection('userdetails').insertOne(value);
        await mongo.db.collection('notes').insertOne({email:value.email, note:""})
        res.status(201).send({message:"registered Succesfully"});
    }
    catch(error){
        res.status(400).send({error});
    }
  },

  login: async(req, res) => {
     try{
        const {error, value}= await schema.loginSchema.validate(req.body);
        if(error) return res.status(403).send({error:error.details[0].message});

        value.email = value.email.toLowerCase();
        // checking weather user exists
        const user = await mongo.db.collection('userdetails').findOne({email:value.email});
        if(!user) return res.status(403).send({error:"Email not registered"})

        //checking weather the entered password is correct or not
        const data = await bcrypt.compare(value.password, user.password);
        if(data){
            const token = await jwt.sign({UserId: user._id }, process.env.pass);
            return res.send({token});
        }
        else
        req.status(403).send({error:"email or passwod invalid"})
     }
     catch(error){
        res.status(400).send(error);
     }
  },

  forgotpassword: async(req, res) => {
    try{
      const{error , value} = await schema.forgetPasswordSchema.validate(req.body);
      if(error) return res.status(403).send(error.details[0].message)

      value.email = value.email.toLowerCase();

      // checking weather user exists
      const user = await mongo.db.collection('userdetails').findOne({email:value.email});
      if(!user) return res.status(403).send({error:"Email not registered"})
      const code = Math.random().toString(36).slice(-6);
      
      await email(value.email , `<h1>Reset Password</h1> <p>Your Otp Is:</p><br/><h3>${code}</h3><br/><p>The below Link is valid only for 30 mins. change your Password with in 30 mins</p> <br/> <p>https://flamboyant-mcnulty-6a1292.netlify.app/forgotpassword/${user._id}/verification</p>`);
      await mongo.db.collection('userdetails').updateOne({email:value.email} , {$set:{code: code ,resetpassord: false , time:(value.time +1800000)} })
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
        if(user.code === value["code"]){
            await mongo.db.collection('userdetails').updateOne({_id: ObjectId(value.id)}, {$set:{resetpassord: true}})
            return res.send({message:" Otp verified"})
        }
        res.status(403).send({error:"Please enter valid Otp"})
      }
      catch (error){
        res.status(403).send({error:"Please enter valid Otp"})
      }
    },

    createnewpassword: async(req, res) =>{
        const{error , value} = await schema.createnewpassword.validate(req.body);
        if(error) return res.status(403).send(error.details[0].message)
        const user = await mongo.db.collection('userdetails').findOne({_id: ObjectId(value.id)});

        if(user.resetpassord === true){
        const salt = await bcrypt.genSalt();
        value.password = await bcrypt.hash(value.password , salt);
        await mongo.db.collection('userdetails').updateOne({_id: ObjectId(value.id)} , {$set:{password: value.password}, $unset:{code: "" ,resetpassord:"" , time:""}})
        return res.send({message: "password changed"})
        }
        else{
            res.send({message:"click the link on the email to reset Password"})
        }
    },

    linkvalid: async(req, res) =>{
      const{error , value} = await schema.linkvalid.validate(req.body);
      if(error) return res.status(403).send(error.details[0].message)
      const user = await mongo.db.collection('userdetails').findOne({_id: ObjectId(value.id)});
      if(user.time > value.time){
      return res.send({message:"true"})
      }
      else{
          res.status(400).send({message:"link expired"})
      }
  }

};

module.exports = services;
