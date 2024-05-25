const StudentDetailsModel = require('../models/StudentRecord');

const router = require ('express').Router();


router.post('/addStudent',async(req,res)=>{
    try {
        const addStudent = await StudentDetailsModel.create(req.body);
        if(addStudent){
            res.status(201).json({message:"Record Added !"})
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({message:"Internal Server Error"});
    }
})
router.get('/getAllStudent',async(req,res)=>{
    try {
        const allStudent = await StudentDetailsModel.find({});

        if(allStudent){
            res.status(201).json(allStudent);
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({message:"Intenal Server Error ! "})
    }
})
module.exports = router