import { SharedIniFileCredentials, config, S3 } from 'aws-sdk';
const createError = require('http-errors')

export const checkConstraints = (name, body, description) => {
    if (!name.match(/.(jpg|jpeg|png)$/i))
        throw createError(400, 'Incompatible filetype.');
    if (!description)
        throw createError(400, 'No description provided.');
    if (body.size == 0)
        throw createError(404, 'Empty file.');
    if (body.size > 500000)
        throw createError(404, 'File size bigger than 500 KB.');
}

export const checkExists = (name) => {
    db
        .query(`select name from images where name = ${name}`)
        .then(res => {
            if (res.length !== 0) {
                throw createError(400, 'File already exists.');
            }
        })
        .catch(err => { throw createError(500, err); })
}

export const uploadPhoto = (Key, body) => {
    const credentials = new SharedIniFileCredentials({ profile: 'default' });
    config.credentials = credentials;

    let upload = new S3.ManagedUpload({
        params: {
            Bucket: bucketName,
            Key: Key,
            Body: body,
            //ACL: "public-read"
        }
    })
    let promise = upload.promise();
    promise
        .then(
            function (data) {
                return data;
            })
        .catch(
            function (err) {
                throw createError(500, err);
            });
}

export const deletePhoto = (Key) => {
    s3.deleteObject({ Bucket: bucketName, Key: Key }, function (err, data) {
        if (err) {
            throw createError(400, err);
        }
        return data;
    });
}

export const insertRecord = (name, description, size) => {
    let filetype = name.split('.').pop();
    db
        .query(`insert into images (name, description, filetype, size)
values (${name}, ${description}, ${filetype}, ${size})`)
        .then(response => { return response; })
        .catch(error => { throw createError(500, error); });
}
