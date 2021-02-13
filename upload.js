'use strict';

const fs = require('fs');
const createError = require('http-errors');
const express = require('express');
const upload_resources = require('./upload_resources');
let router = require('express').Router();




let hasLoaded = false;
async function loadDB() {
  hasLoaded = await upload_resources.initialize();
}
loadDB();


router.post('/upload', async function (req, res) {
  try {
    //await upload_resources.initialize();
    if (!hasLoaded) {
      setTimeout(function () { }, 1000);
      if (!hasLoaded) {
        throw new Error('DB could not be initialized.');
      }
    }
    console.log(req.body);
    let name = req.body.name;
    console.log(name);
    let description = req.body.description;
    let body = fs.readFileSync(`./public/images/${name}`);
    const bucketName = 'apoorv-aws-project';
    const Key = encodeURIComponent(name);
    upload_resources.checkConstraints(name, body, description);
    await upload_resources.checkExists(name);
    await upload_resources.uploadPhoto(Key, bucketName, body);
    let imagesize = body.size / 1000;
    if (upload_resources.insertRecord(name, description, imagesize)) {
      res.status = 200;
      res.statusMessage = "Image uploaded successfully.";
      return res;
    }
    else {
      upload_resources.deletePhoto(key, bucketName);
      res.status = 500;
      res.statusMessage = "Failure while inserting image details into RDS.";
      return res;
    }
  }
  catch (error) {
    if (error.isHttpError) {
      res.status = error.status;
    }
    else {
      res.status = 500;
    }
    res.statusMessage = error.message;
    return res;
  }
});


module.exports = router;