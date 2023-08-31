const Admin = require('../../model/admin')
const home = async(req,res)=>{
    res.render('Admin/home/home',{tittle:'Home'})
}

const loginform = (req,res)=>{
   res.render('Admin/auth/login',{tittle:'Login'})
}
const login = async (req,res,next)=>{
        const admin = await Admin.findbyCredentials(req.body.email,req.body.password)
        const token = await admin.genauthtoken()
        res.cookie('Authorization', token)
        req.flash('success','Welcome Back!')
        res.redirect('/admin/home')
}
const logout = async(req,res)=>{ 
   req.admin.tokens = req.admin.tokens.filter((token)=>token.token!==req.token)
   await req.admin.save()
   req.flash('success','Log Out successfully!')
   res.redirect('/admin/login')
  
}

module.exports = {
    loginform,
    login,
    logout,
    home
   
}
