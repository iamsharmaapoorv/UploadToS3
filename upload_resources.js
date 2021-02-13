const aws = require('aws-sdk');
const createError = require('http-errors');
const fs = require('fs');
const mysql = require('mysql2/promise');

const connectToDB = async () => {
    try {
        let rawdata = fs.readFileSync('./db_creds.json');
        let dbCreds = JSON.parse(rawdata);
        return await mysql.createConnection({
            host: dbCreds.host,
            user: dbCreds.username,
            password: dbCreds.password,
            database: dbCreds.database,
            port: dbCreds.port
        });
    } catch (error) {
        throw Error(error);
    }
};

let db = null;
exports.initialize = async () => {
    try{
        db = await connectToDB();
        return true;
    }
    catch{
        return false;
    }
};

exports.checkConstraints = (name, body, description) => {
    if (!name.match(/.(jpg|jpeg|png)$/i))
        throw createError(400, 'Incompatible filetype.');
    if (!description)
        throw createError(400, 'No description provided.');
    if (body.size == 0)
        throw createError(404, 'Empty file.');
    if (body.size > 500000)
        throw createError(404, 'File size bigger than 500 KB.');
};

exports.checkExists = async (name) => {
    try {
        result = await db.execute(`select name from images where name = '${name}'`);
        console.log(`done checkexists query`);
        console.log(result)
        if (result[0].length > 0) {
            throw createError(400, 'File already exists.');
        }
    }
    catch (error) {
        throw new Error(error);
    }
};

exports.uploadPhoto = async (Key, bucketName, body) => {
    aws.config.loadFromPath('./.aws/credentials.json');

    let upload = new aws.S3.ManagedUpload({
        params: {
            Bucket: bucketName,
            Key: Key,
            Body: body,
            //ACL: "public-read"
        }
    });
    data = await upload.promise();
    console.log('uploaded', data);
    // promise
    //     .then(
    //         function (data) {
    //             console.log('uploaded', data)
    //             return data;
    //         },
    //         function (err) {
    //             throw createError(500, err)
    //         });

};

exports.deletePhoto = async (Key) => {
    try {
        return await s3.deleteObject({ Bucket: bucketName, Key: Key });
    }
    catch (error) {
        throw new Error(error);
    }
};

exports.insertRecord = async (name, description, size) => {
    try {
        let filetype = name.split('.').pop();
        return await db.execute(`insert into images (name, description, filetype, size)
    values ('${name}', '${description}', '${filetype}', '${size}')`);
    }
    catch (error) {
        throw new Error(error);
    }
};
