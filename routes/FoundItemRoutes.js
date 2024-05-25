const router = require('express').Router();
const multer = require('multer');
const ItemDetailsModel = require('../models/foundItemModel');
const { handleUpload } = require('../helpers/helpers');

const storage = multer.memoryStorage();
const upload = multer({storage: storage})
router.get('/getAllItems', async (req,res)=>{
    ItemDetailsModel.find()
        .sort({ Date: -1 })
        .then(items =>res.json(items))
        .catch(err=>res.status(400).json('error:' + err));
})
router.post('/insertItems',upload.single("image"), async (req,res)=>{

   
    try {
                const b64 = Buffer.from(req.file.buffer).toString("base64");
                const dataURI = `data:${req.file.mimetype};base64,${b64}`;
                const cldres = await handleUpload(dataURI);
                const status = "Not Found"
                if(cldres.secure_url){
                    const newItem = new ItemDetailsModel({
                        ImageUrl : cldres.secure_url,
                        ItemCategory: req.body.ItemCategory,
                        ItemTypes: req.body.ItemTypes,
                        ItemBrand : req.body.ItemBrand,
                        ItemColor : req.body.ItemColor,
                        DateFound:req.body.dateFound,
                        ReturnedBy:req.body.returnedBy,
                        Status : status
                    });
                    newItem.save()
                    .then(()=>{
                        res.json('New Item Added ! ');
                    })
                    .catch((err)=>res.status(400).json('err' + err))
                }
                else{
                    res.json("image not uploaded to database");
                }
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error ! ');
    }
})

router.put('/updateItem/:id',upload.single("image"), async (req,res)=>{
    const {id} = req.params;
    const itemData = req.body;
    const status = "Not Found"
    try {
        const item = await ItemDetailsModel.findById(id);

        item.ItemCategory = itemData.ItemCategory;
        item.ItemTypes = itemData.ItemTypes;
        item.ItemBrand = itemData.ItemBrand;
        item.ItemColor = itemData.ItemColor;
        item.ItemStatus = status;

        if(!item){
            return res.status(404).json({message:"Item not found ! "})
        }
       
        if(req.file){
            const b64 = Buffer.from(req.file.buffer).toString("base64");
            const dataURI = `data:${req.file.mimetype};base64,${b64}`;
            const cldres = await handleUpload(dataURI);

            if(cldres.secure_url){
                item.ImageUrl = cldres.secure_url;
            }
        }
        else{
            item.ImageUrl = itemData.ItemImageUrl;
        }

        await item.save();
        res.status(200).json({message:"Item Updated Successfully"});

    }catch (error) {
        console.error(error); 
        res.status(500).json({ message: 'Error updating document' });
    }
})
router.delete('/deleteItem/:id',async (req,res)=>{
    try {
        const Item = await ItemDetailsModel.findOneAndDelete({_id: req.params.id});
        if(!Item){
            return res.status(400).send('Item not Found ! ')
        }
        return res.status(200).send('Deleted Successfully ! ')
    } catch (error) {
        console.error(error); 
        res.status(500).json({ message: 'Error Deleting document' });
    }
})

module.exports = router