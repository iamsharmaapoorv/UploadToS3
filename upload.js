const fs = require('fs');
const AWS = require('aws-sdk');
const imagesize = require('image-size');
const pgp = require('pg-promise')(/* options */);

let connectToDB = () => {
  let rawdata = fs.readFileSync('db_creds.json');
  let dbCreds = JSON.parse(rawdata);
  return db = pgp(`postgres://${dbCreds.username}:${dbCreds.password}@${dbCreds.host}:${dbCreds.port}/${dbCreds.database}`)
}
/*
const s3 = new AWS.S3({
    accessKeyId: x, //arrange somehting while a cred file
    secretAccessKey: y
});

const filename = z

0123456789
9876543210
1234567890

var AWS = require('aws-sdk');
var uuid = require('uuid');
AWS.config.update({region: 'ap-south-1'});

// Create unique bucket name
//var bucketName = 'node-sdk-sample-' + uuid.v4();
// Create name for uploaded object key
//var keyName = 'hello_world.txt';

// Create a promise on S3 service object
var bucketPromise = new AWS.S3({apiVersion: '2006-03-01'}).createBucket({Bucket: bucketName}).promise();

// Handle promise fulfilled/rejected states
bucketPromise.then(
  function(data) {
    // Create params for putObject call
    var objectParams = {Bucket: bucketName, Key: keyName, Body: 'Hello World!'};
    // Create object upload promise
    var uploadPromise = new AWS.S3({apiVersion: '2006-03-01'}).putObject(objectParams).promise();
    uploadPromise.then(
      function(data) {
        console.log("Successfully uploaded data to " + bucketName + "/" + keyName);
      });
}).catch(
  function(err) {
    console.error(err, err.stack);
});
*/

/*
db.one('SELECT $1 AS value', 123)
  .then(function (data) {
    console.log('DATA:', data.value)
  })
  .catch(function (error) {
    console.log('ERROR:', error)
  })
*/


let checkType = (name) => {
  if (!name.match(/.(jpg|jpeg|png)$/i))
    //raise error
}

let checkExists = (name) =>{
  client
  .query(`select name from images where name = ${name}`)
  .then(res => {
    if (res.length === 0)
    //raise error
    // { name: 'brianc', email: 'brian.m.carlson@gmail.com' }
  })
  .catch(e => console.error(e.stack)//raise error)
}

let credentials = new AWS.SharedIniFileCredentials({profile: 'default'});
AWS.config.credentials = credentials;
bucketName = 'apoorv-aws-project'
let uploadPhoto = (name) => {
  //let files = document.getElementById("photoupload").files;
  let Key = encodeURIComponent(name)
  let body = fs.createReadStream(name)
  // Use S3 ManagedUpload class as it supports multipart uploads
  let upload = new AWS.S3.ManagedUpload({
    params: {
      Bucket: bucketName,
      Key: Key,
      Body: body,
      //ACL: "public-read"
    }
  });

  let promise = upload.promise();

  promise.then(
    function(data) {
      alert("Successfully uploaded photo.");
      viewAlbum(albumName);
    },
    function(err) {
      return alert("There was an error uploading your photo: ", err.message);
    }
  );
}
  

let deletePhoto = (Key) => {
  s3.deleteObject({ Bucket: bucketName, Key: Key }, function(err, data) {
    if (err) {
      return alert("There was an error deleting your photo: ", err.message);
    }
  });
}

let insertRecord = (name, description) => {
  let filetype =  name.split('.').pop();
  let dimensions = imagesize(name);
  let height = dimensions.height;
  let width = dimensions.weight;
  db.query(`insert into images (name, description, filetype, height, weight)
  values (${name}, ${description}, ${filetype}, ${height}, ${width})`,
  (err, result) => {
    if(err)
    //delete s3 and return 500
  })
}
