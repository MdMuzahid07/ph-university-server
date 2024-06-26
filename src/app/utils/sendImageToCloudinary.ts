import { v2 as cloudinary } from 'cloudinary';
import config from '../config';
import multer from 'multer';
import fs from "fs";




// Configuration
cloudinary.config({
    cloud_name: config.cloudinary_cloud_name,
    api_key: config.cloudinary_api_key,
    api_secret: config.cloudinary_api_secret // Click 'View Credentials' below to copy your API secret
});

export const sendImageToCloudinary = async (imageName: string, path: string) => {


    // Upload an image
    const uploadImage = await cloudinary.uploader
        .upload(
            path, {
            public_id: imageName,
        }
        )
        .catch((error) => {
            console.log(error);
        });

    // delete img file asynchronously

    fs.unlink(path, (error) => {
        if (error) {
            console.log(error);
        } else {
            console.log("file is deleted");
        }
    });


    return uploadImage;
};


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, process.cwd() + "/uploads")
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
})

export const upload = multer({ storage: storage })