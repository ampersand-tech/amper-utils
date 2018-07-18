"use strict";
/**
* Copyright 2017-present Ampersand Technologies, Inc.
*/
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const stream = require("stream");
const zlib = require("zlib");
function streamFromFile(filename) {
    let readStream = fs.createReadStream(filename);
    if (filename.slice(-3) === '.gz') {
        readStream = readStream.pipe(zlib.createGunzip());
    }
    return readStream;
}
exports.streamFromFile = streamFromFile;
function streamFromData(data) {
    const outStream = new stream.PassThrough();
    outStream.push(data);
    outStream.push(null);
    return outStream;
}
exports.streamFromData = streamFromData;
function streamFromS3(s3, bucketName, filePath, uncompress) {
    const params = { Bucket: bucketName, Key: filePath };
    let readStream = s3.getObject(params).createReadStream();
    if (uncompress) {
        readStream = readStream.pipe(zlib.createGunzip());
    }
    return readStream;
}
exports.streamFromS3 = streamFromS3;
function streamToFile(readStream, filePath, compress) {
    return new Promise((resolve, reject) => {
        if (compress) {
            readStream = readStream.pipe(zlib.createGzip());
            filePath += '.gz';
        }
        const writeStream = fs.createWriteStream(filePath);
        const writePipe = readStream.pipe(writeStream);
        writePipe.on('finish', () => {
            resolve();
        });
        writePipe.on('error', (err) => {
            reject(err);
        });
    });
}
exports.streamToFile = streamToFile;
function streamToS3(s3, readStream, bucketName, filePath, contentType, compress) {
    if (compress) {
        readStream = readStream.pipe(zlib.createGzip());
    }
    const params = {
        Bucket: bucketName,
        Key: filePath,
        Body: readStream,
        ContentType: contentType,
    };
    return s3.upload(params).promise();
}
exports.streamToS3 = streamToS3;
function cloneStream(readStream) {
    return readStream.pipe(new stream.PassThrough());
}
exports.cloneStream = cloneStream;
