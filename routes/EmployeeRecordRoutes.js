const EmployeeDetailsModel = require('../models/EmployeeRecord');


const router = require ('express').Router();


router.post('/addEmployee',async(req,res)=>{
    try {
        const addEmployee = await EmployeeDetailsModel.create(req.body);
        if(addEmployee){
            res.status(201).json({message:"Record Added !"})
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({message:"Internal Server Error"});
    }
})
router.get('/getAllEmployee',async(req,res)=>{
    try {
        const allEmployee = await EmployeeDetailsModel.find({});

        if(allEmployee){
            res.status(201).json(allEmployee);
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({message:"Intenal Server Error ! "})
    }
})
module.exports = router