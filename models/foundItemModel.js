const mongoose = require('mongoose');
const { getPhilippineTime } = require('../shared/getPhilTime');



const FoundItemSchema = new mongoose.Schema({
    ImageUrl : String,
    ItemCategory: String,
    ItemTypes: String,
    ItemBrand : String,
    ItemColor :String,
    Status: String,
    DateFound:String,
    ReturnedBy:String,
    Date:{
        type:Date,
        default:getPhilippineTime
    }
})
const FoundItemModel = mongoose.model('FoundItem',FoundItemSchema,'FoundItem');
module.exports = FoundItemModel;