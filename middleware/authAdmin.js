const jwt = require('jsonwebtoken')
const Admin= require('../model/admin')

const auth = async(req,res,next)=>{
    try{
       
        
    const token =req.cookies.Authorization
    // const token = req.header('Authorization').replace('Bearer ', '');

  
    const decoded = jwt.verify(token,process.env.SECRET)

    const admin = await Admin.findOne({_id:decoded._id,'tokens.token':token})
    if(!admin){
        throw new Error()
    }
    req.token = token
    req.admin = admin
    next()
    }catch(e){
        res.redirect('/user/login')
    }


}
module.exports = auth