const mongoose = require('mongoose');
const { getPhilippineTime } = require('../shared/getPhilTime');

const MatchItemSchema = new mongoose.Schema({
    ImageUrl : String,
    ItemCategory: String,
    ItemTypes: String,
    ItemBrand : String,
    ItemColor :String,
    OtherDetails :String,
    Status: String,
    matchWith:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'FoundItem'
    },

    Date:{
        type:Date,
        default:getPhilippineTime
    },
    userId: {
        type:mongoose.SchemaTypes.ObjectId,
        ref:'Accounts'
    }
})
const MatchItemModel = mongoose.model('LostandFoundItems',MatchItemSchema,'LostandFoundItems');
module.exports = MatchItemModel;