const fs = require('fs');
const AWS = require('aws-sdk');

const s3 = new AWS.S3({
    accessKeyId: x, //arrange somehting while a cred file
    secretAccessKey: y
});

const filename = z

const uploadImage = () => {
    fs.readfile(filename, (error, data) => {
        if (error) throw error;
        const params = {
            Bucket: 'Bucket', 
            Key: //filename.extension
            Body: //whatever for image
        };
        s3.upload(params, (s3Err, data) => {
            if (s3Err) throw error; //handle custom errors
            //file uploaded at data.Location, check data variable for more info
        });
    });
};
