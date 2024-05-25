const router = require('express').Router();
const bcrypt = require('bcryptjs')
const AccountDetailsModel = require('../models/Account');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const { handleUpload } = require('../helpers/helpers');
const storage = multer.memoryStorage();
const upload = multer({storage: storage})

router.post('/insertAccount',upload.single("image"),async(req,res)=>{
    const {user,contact,address,email,password} = req.body
    try {
        const userExist = await AccountDetailsModel.findOne({email});
        const idExist = await AccountDetailsModel.findOne({idNo:user})
        if(!userExist || !idExist){
            const b64 = Buffer.from(req.file.buffer).toString("base64");
            const dataURI = `data:${req.file.mimetype};base64,${b64}`;
            const cldres = await handleUpload(dataURI);

            if(cldres.secure_url){
                const salt = await bcrypt.genSalt(10);
                const hashPassword = await bcrypt.hash(password,salt)
                const userRoles = 1
               const newuser = await AccountDetailsModel.create({
                   user:user,
                   contact:contact,
                   address:address,
                   email:email,
                   password:hashPassword,
                   userRoles:userRoles,
                   imageUrl:cldres.secure_url
               })
               if(newuser){
                   res.status(201).json('New Account Added ! - server')
               }
               else{
                   res.status(500).json('Invalid Data')
               }
            }
           
        }
        else{
            res.status(400).json('User Already Exist');
        }
         
    } catch (error) {
        console.log(error);
        res.status(500).json('Failed to add Account ! - server')
    }
})
router.post('/loginAuth',async(req,res)=>{
    const {email,password} = req.body

    const user = await AccountDetailsModel.findOne({email}).populate('user')
    try {
        if(user && (await bcrypt.compare(password,user.password))){
            const token = generateToken(user._id)
            res.status(200).json({
                _id: user._id,
                firstName: user.user.firstName,
                email:user.email,
                contact:user.contact,
                userRoles:user.userRoles,
                token: token  
            })
        }
        else{
            res.status(201).json("Username or Password Incorrect");
        }
    } catch (error) {
        res.status(400).json(error)
    }
   
})

//generate token
const generateToken = (id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn:'30d',

    })
}
module.exports = router