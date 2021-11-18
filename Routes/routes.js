const express = require('express');
const services = require('../servises/router.services');


const Router = express.Router();

Router.get('/', (req, res)=>{
  res.send("Api")
});
Router.post('/register', services.register);
Router.post('/login', services.login);
Router.post('/forgotPassword', services.forgotpassword);
Router.post('/verification' ,services.checkcode);
Router.post('/Newpassword', services.createnewpassword);
Router.post('/linkvalid' , services.linkvalid)


module.exports = Router;
