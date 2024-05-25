const mongoose = require('mongoose')


const StudentRecordSchema = new mongoose.Schema({
    studentNo:String,
    firstName:String,
    lastName:String,
    age:Number
})
const StudentDetailsModel = mongoose.model('Students',StudentRecordSchema,'Students')
module.exports = StudentDetailsModel