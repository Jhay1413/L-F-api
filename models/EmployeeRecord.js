const mongoose = require('mongoose')


const EmployeeRecordSchema = new mongoose.Schema({
    employeeNo:String,
    firstName:String,
    lastName:String,
    age:Number
})
const EmployeeDetailsModel = mongoose.model('Employees',EmployeeRecordSchema,'Employees')
module.exports = EmployeeDetailsModel