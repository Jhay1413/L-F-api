const tf = require('@tensorflow/tfjs-node');
const axios = require('axios');
const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: 'dzry3teae', 
    api_key: '331924875182981', 
    api_secret: 'h3XBeI36w5wppWYLvynGouYUnh8' 
})
let model;
(async function loadModel() {
  model = await tf.loadLayersModel('https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json');
  console.log("Model loaded");
})();


const handleUpload = async (file) =>{
  const res = await cloudinary.uploader.upload(file,{
      resource_type:"auto",
      folder:"lostImage"
  });
  return res;
}


const extractImageFeatures = async (imagePath) => {
    const imageBuffer = await tf.node.fs.readFile(imagePath);
    return await extractImageFeaturesFromBuffer(imageBuffer);
};

const extractImageFeaturesFromBuffer = async (imageBuffer) => {
    const tensor = tf.node.decodeImage(imageBuffer).toFloat().div(tf.scalar(255)).resizeBilinear([224, 224]).expandDims();
    const adjustedTensor = tensor.slice([0, 0, 0, 0], [-1, 224, 224, 3]); // Adjust tensor shape
const features = model.predict(adjustedTensor);
    return features;
};

const downloadImage = async (url) => {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    return Buffer.from(response.data);
};

const computeCosineSimilarity = (vectorA, vectorB) => {
    const flatA = vectorA.flatten();
    const flatB = vectorB.flatten();

    const dotProduct = flatA.dot(flatB);
    const normA = flatA.norm();
    const normB = flatB.norm();

    return dotProduct.div(normA.mul(normB)).dataSync()[0];
};
const getImagesFromFolder = async (folderName) => {
    try {
      const result = await cloudinary.api.resources({ 
        type: 'upload', 
        prefix: folderName + '/',
        max_results: 500 // This is the maximum number of results per request. If you have more images, you'd have to handle pagination.
      });
  
      // This will return an array of URLs from the folder
      return result.resources.map(resource => resource.secure_url);
    } catch (error) {
      console.error("Error fetching images:", error);
      return [];
    }
  }

module.exports = {
    extractImageFeatures,
    extractImageFeaturesFromBuffer,
    downloadImage,
    computeCosineSimilarity,
    getImagesFromFolder,
    handleUpload
};