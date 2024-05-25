const mongoose = require('mongoose')

const AccountDetailsSchema = new mongoose.Schema({
    user:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'UserRecords'
    },
    contact:String,
    address:String,
    email:String,
    password:String,
    userRoles:Number,
    imageUrl:String

})
const AccountDetailsModel = mongoose.model('Accounts',AccountDetailsSchema,'Accounts')
module.exports = AccountDetailsModel;