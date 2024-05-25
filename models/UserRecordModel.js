const mongoose = require('mongoose')


const UserRecordSchema = new mongoose.Schema({
    idNo:String,
    firstName:String,
    lastName:String,
    age:Number,
    userType:String,
})
const UserRecordDetailsModel = mongoose.model('UserRecords',UserRecordSchema,'UserRecords')
module.exports = UserRecordDetailsModel