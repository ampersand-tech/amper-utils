/**
* Copyright 2017-present Ampersand Technologies, Inc.
*/
/// <reference types="node" />
import * as stream from 'stream';
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
    getObject(params: S3GetObjectRequest): {
        createReadStream: () => stream.Stream;
    };
    upload(params: S3PutObjectRequest): {
        promise: () => Promise<any>;
    };
}
export declare function streamFromFile(filename: string): stream.Stream;
export declare function streamFromData(data: Buffer | string): stream.Stream;
export declare function streamFromS3(s3: S3, bucketName: string, filePath: string, uncompress?: boolean): stream.Stream;
export declare function streamToFile(readStream: stream.Stream, filePath: string, compress?: boolean): Promise<any>;
export declare function streamToS3(s3: S3, readStream: stream.Stream, bucketName: string, filePath: string, contentType: string, compress?: boolean): Promise<any>;
export declare function cloneStream(readStream: stream.Stream): stream.PassThrough;
export {};
