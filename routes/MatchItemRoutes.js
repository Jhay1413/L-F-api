const router = require ('express').Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({storage: storage})
const {
    extractImageFeaturesFromBuffer,
    downloadImage,
    computeCosineSimilarity,
    handleUpload
} = require('../helpers/helpers');
const MatchItemModel = require('../models/MatchItemModel');
const FoundItemModel = require('../models/foundItemModel');
const twilio = require('twilio');
require('dotenv').config()

const client = new twilio(process.env.TWILIO_ACOCUNT_SID, process.env.TWILIO_ACCOUNT_AUTHTOKEN);


//ADMIN CONFIRMING MATCH ITEMS WITH SMS
router.put('/updateStatus',async(req,res)=>{
    const status = req.body.status
    const {_id} = req.body.data
    const matchId = req.body.data.matchWith._id
    const userContact = req.body.data.userId.contact;
    const body = "There is a match found with youor lost item,please visit EVSU SASO !"
    try {
        //UPDATING ITEM STATUS FROM USER LOST ITEM
        const matchItem = await MatchItemModel.findByIdAndUpdate(_id,{Status:status})

        
            if(matchItem){
                if(status == "Found"){
                    const matchWith = await FoundItemModel.findByIdAndUpdate(matchId,{Status:status})
            
                    if(matchWith){
                        //SMS FOR NOTIFICATION ON USERS
                        client.messages.create({
                            body: body,
                            to: userContact,
                            from: process.env.TWILIO_ACCOUNT_NUMBER
                        })
                        .then((message) => {
                            res.send(message.sid);
                            console.log(message.sid);
                        })
                        .catch((error) => {
                            res.send(error);
                            console.log(error);
                        });
                    }

                }
                else{
                    const matchWith = await FoundItemModel.findByIdAndUpdate(matchId,{Status:status})
                    matchWith ? res.json("Success") : res.json("Not found")
                }
                //UPDATING ITEM STATUS FROM ADMIN FOUND ITE
            }
            else{
                res.json("Not found");
            }

            
        
    } catch (error) {
        console.log(error)
    }
})
  
//ADMIN GETTING ALL THE PENDING REQUEST
router.get('/GetAllRequest',async(req,res)=>{
    try {
        //GETTING ALL ITEM THAT HAS PENDING STATUS POPULATED BY FOUND ITEM AND USER DATA
        const data = await MatchItemModel.find({}).populate('matchWith').populate('userId') .populate({
            path: 'userId',
            populate: {
              path: 'user',
            },
          });
        res.json(data);
    } catch (error) {
        console.log("Server Error",error)
    }

})

//USER INSERTING AND MATCHING LOST ITEMS
router.post('/InsertLostItem',upload.single("image"),async(req,res)=>{
    try {
        const status = "Pending"
        if(req.file.buffer){
            //EXTRACTING FEATURES ON IMAGE CAME FROM USER
            const userImageFeatures = await extractImageFeaturesFromBuffer(req.file.buffer);
            let highestSimilarity = -Infinity;
            let mostSimilarImageUrl = null;
            let matchId = null;

            //GETTING ALL THE FOUND ITEM
            const storedItemData = await FoundItemModel.find({Status:"Not Found"});
           
            //CHECKING IF STOREDITEM DATA HAS A VALUE
            if(Object.keys(storedItemData).length != 0){

                //LOOP THROUGH THE ITEM STORED IN STOREDITEMDATA OBJECT
                for (const item of storedItemData) {
                    //DOWNLOAD THE IMAGE FROM CLOUDINARY
                    const storedImageBuffer = await downloadImage(item.ImageUrl);
                    //GETTING THE FEAUTURE FROM THE IMAGE FROM THE DOWNLOADED IMAGE FROM CLOUDINARY
                    const storedImageFeatures = await extractImageFeaturesFromBuffer(storedImageBuffer);
                    //COMPARING THE TWO IMAGE FROM USER IMAGE AND FOUND IMAGE 
                    const similarityScore = computeCosineSimilarity(userImageFeatures, storedImageFeatures);
            
                    if (similarityScore > highestSimilarity) {
                        highestSimilarity = similarityScore;
                        mostSimilarImageUrl = item.ImageUrl;
                        matchId = item._id
                    }
                }
                if(highestSimilarity >= 0.05){
                    //SAVING THE LOST ITEM DATA FOR CONFIRMATION OF ADMIN
                    const b64 = Buffer.from(req.file.buffer).toString("base64");
                    const dataURI = `data:${req.file.mimetype};base64,${b64}`;
                    const cldres = await handleUpload(dataURI)
                    const newItem = new MatchItemModel({
                        ImageUrl : cldres.secure_url,
                        ItemCategory: req.body.ItemCategory,
                        ItemTypes: req.body.ItemTypes,
                        ItemBrand : req.body.ItemBrand,
                        ItemColor : req.body.ItemColor,
                        OtherDetails : req.body.OtherDetails,
                        Status : status,
                        matchWith : matchId,
                        userId : req.body.userId
                    })
                    newItem.save()
                    .then((data)=>{
                        res.status(201).json(data);
                    })
                    .catch((err) => {
                       console.log(err);
                    });
                }
                else{
                    res.status(200).json({message:'Item not found , Retry again after 24 hours'})
                }
            }
            else{
                res.status(200).json({message:'Item not found , Retry again after 24 hours'})
            }  
        }
    } catch (error) {
        console.log(error);
    }
})

//GET ALL USER REQUEST

router.get('/getAllUserRequest/:id' , async(req,res)=>{
    const id = req.params.id
 
    try {
        const requestData = await MatchItemModel.find({userId: id}).sort({ Date: -1 })
            res.json(requestData);
         
      
    } catch (error) {
        
    }
  

})
module.exports = router