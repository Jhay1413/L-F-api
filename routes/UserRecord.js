const UserRecordDetailsModel = require('../models/UserRecordModel');


const router = require ('express').Router();


router.post('/addUserRecord',async(req,res)=>{
    try {
        const addUser = await UserRecordDetailsModel.create(req.body);
        if(addUser){
            res.status(201).json({message:"Record Added !"})
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({message:"Internal Server Error"});
    }
})
router.get('/getAllUserRecord',async(req,res)=>{
    try {
        const allUser = await UserRecordDetailsModel.find({});

        if(allUser){
            res.status(201).json(allUser);
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({message:"Intenal Server Error ! "})
    }
})
module.exports = router