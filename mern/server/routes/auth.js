const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt=require("jsonwebtoken")
const {JWT_SECRET} =require("../key")
const requireLogin = require("../middleware/requireLogin")
const User = mongoose.model("User");

router.post("/signup", (req, res) => {
  const { name, email, password,pic } = req.body;
  if (!name || !password || !email) {
    return res.status(422).json({ error: "please add all the field" });
  }
  User.findOne({ email: email })
    .then((savedUser) => {
      if (savedUser) {
        return res
          .status(422)
          .json({ error: "user already exist with that email" });
      }
      bcrypt.hash(password, 12).then((hashedpassword) => {
        const user = new User({
          email,
          password:hashedpassword,
          name,
          pic:pic
        });

        user
          .save()
          .then((user) => {
            res.json({ message: "saved-- successfully" });
          })
          .catch((err) => {
            console.log("error", err);
          });
      });
    })
    .catch((err) => {
      console.log("the error ", err);
    });
});
router.post("/signin",(req,res)=>{
const {email ,password} = req.body;
if(!email||!password){
   return res.status(422).json({error:"please provide email and password"})
}
User.findOne({email:email})
.then(savedUser=>{
    if(!savedUser){
      return  res.status(422).json({error:"Invalid email or password"})
    }
    bcrypt.compare(password,savedUser.password)
    .then(doMatch=>{
        if(doMatch){
            const token = jwt.sign({
              _id:  savedUser._id
            },JWT_SECRET)
            const {_id,name,email,following,followers,pic} =savedUser
            res.json({token,user:{_id,name,email,followers,following,pic}})
        //    return res.json({message:"successfully signIn"})
        }
        else{
            return  res.status(422).json({error:"Invalid email or password"})
        }
    })
    .catch(err=>{
        console.log("error",err)
    })
})
})
module.exports = router;
