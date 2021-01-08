'use strict';

import { readFileSync, createReadStream } from 'fs';
import { SharedIniFileCredentials, config, S3 } from 'aws-sdk';
import {checkConstraints, checkExists, uploadPhoto, deletePhoto, insertRecord} from 'upload_resources';
const createError = require('http-errors')
const express = require('express');
const bodyParser = require("body-parser");
const pgp = require('pg-promise')(/* options */);

let app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const connectToDB = () => {
  try {
    let rawdata = readFileSync('db_creds.json');
    let dbCreds = JSON.parse(rawdata);
    return pgp(`postgres://${dbCreds.username}:${dbCreds.password}@${dbCreds.host}:${dbCreds.port}/${dbCreds.database}`);
  } catch (error) {
    throw error;
  }
  
}

const db = connectToDB();

app.post('/upload', function (req, res) {
  try {
    let name = req.body('name');
    let description = req.body('description');
    let body = createReadStream(name);
    const bucketName = 'apoorv-aws-project'
    const Key = encodeURIComponent(name)
    checkConstraints(name, body, description);
    checkExists(name);
    uploadPhoto(Key, bucketName);
    let imagesize = body.size/1000;
    if (insertRecord(name, description, imagesize)) {
      res.status = 200;
      res.statusMessage = "Image uploaded successfully.";
      return res;
    }
    else {
      deletePhoto(key, bucketName);
      res.status = 500;
      res.statusMessage = "Failure while inserting image details into RDS.";
      return res;
    }
  }
  catch (error) {
    if (createError.isHttpError(error)) {
      res.status = error.status;
    }
    else{
      res.status = 500;
    }
    res.statusMessage = error.message;
    return res;
  }
})


