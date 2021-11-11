const express = require("express");
const authrouter = require("./Routes/routes");
const jwt= require('jsonwebtoken');
const dotenv = require("dotenv");
const mongo = require("./db/mongo");
const testrouter = require("./Routes/test");
const cors = require('cors');

dotenv.config();
const app = express();

(async () => {
  try {
    // db connection
    await mongo.connect();

    //middlewares
    app.use(express.json());
    app.use(cors());

    //routes
    app.use(authrouter);
    
    //checking for token
    app.use((req , res , next)=>{
        try{
            let  token = req.headers['authorization'].split(' ')[1];
            const user = jwt.verify(token, process.env.pass)
            req.user = user.UserId
            next();
        }
        catch(error){
            res.sendStatus(403);
        }
    })
    
    app.use(testrouter)

    app.listen(process.env.port, () => {
      console.log("server is up at port " + process.env.port);
    });

  } catch (error) {
    console.log("Error while starting app");
  }
})();
