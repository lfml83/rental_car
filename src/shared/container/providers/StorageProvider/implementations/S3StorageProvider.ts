import { S3 } from "aws-sdk";
import fs from "fs";
import mime from "mime"; // para colocar no content type
import { resolve } from "path";

import upload from "@config/upload";

import { IStorageProvider } from "../IStorageProvider";

class S3StorageProvider implements IStorageProvider {
    private client: S3;

    constructor() {
        this.client = new S3({
            region: process.env.AWS_BUCKET_REGION,
        });
    }
    async save(file: string, folder: string): Promise<string> {
        const originalName = resolve(upload.tmpFolder, file); // aqui tem a representaçao do nome---path
        const fileContent = await fs.promises.readFile(originalName);

        const ContentType = mime.getType(originalName);

        await this.client
            .putObject({
                Bucket: `${process.env.AWS_BUCKET}/${folder}`,
                Key: file, // nome do nosso arquivo
                ACL: "public-read", // acesso das pesoas
                Body: fileContent,
                ContentType, // coloco isso para a pessoa que clicar no site nao fazer o download do mesmo
            })
            .promise(); // inserindo o tmp dento do S3

        await fs.promises.unlink(originalName); // tirando do tmp

        return file;
    }
    async delete(file: string, folder: string): Promise<void> {
        await this.client
            .deleteObject({
                Bucket: `${process.env.AWS_BUCKET}/${folder}`,
                Key: file, // nome do nosso arquivo
            })
            .promise();
    }
}

export { S3StorageProvider };
