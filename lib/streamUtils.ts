/**
* Copyright 2017-present Ampersand Technologies, Inc.
*/

import * as fs from 'fs';
import * as stream from 'stream';
import * as zlib from 'zlib';

interface S3GetObjectRequest {
  Bucket: string;
  Key: string;
}

interface S3PutObjectRequest {
  Bucket: string;
  Key: string;
  Body: stream.Stream;
  ContentType?: string;
}

interface S3 {
  // from aws-sdk
  getObject(params: S3GetObjectRequest): { createReadStream: () => stream.Stream };
  upload(params: S3PutObjectRequest): { promise: () => Promise<any> };
}

export function streamFromFile(filename: string): stream.Stream {
  let readStream: stream.Stream = fs.createReadStream(filename);
  if (filename.slice(-3) === '.gz') {
    readStream = readStream.pipe(zlib.createGunzip());
  }
  return readStream;
}

export function streamFromData(data: Buffer|string): stream.Stream {
  const outStream = new stream.PassThrough();
  outStream.push(data);
  outStream.push(null);
  return outStream;
}

export function streamFromS3(s3: S3, bucketName: string, filePath: string, uncompress?: boolean) {
  const params = { Bucket: bucketName, Key: filePath };
  let readStream = s3.getObject(params).createReadStream();
  if (uncompress) {
    readStream = readStream.pipe(zlib.createGunzip());
  }
  return readStream;
}

export function streamToFile(
  readStream: stream.Stream,
  filePath: string,
  compress?: boolean,
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
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

export function streamToS3(
  s3: S3,
  readStream: stream.Stream,
  bucketName: string,
  filePath: string,
  contentType: string,
  compress?: boolean,
) {
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

export function cloneStream(readStream: stream.Stream) {
  return readStream.pipe(new stream.PassThrough());
}
