import express, { NextFunction, Request, Response } from "express";
import swaggerUi from "swagger-ui-express";

import upload from "@config/upload";
import "express-async-errors";
import "reflect-metadata";
import "dotenv/config";
import { AppError } from "@shared/errors/AppError";
import createConnection from "@shared/infra/typeorm";

import "@shared/container";

import swaggerFile from "../../../swagger.json";
import { router } from "./routes";

createConnection();
const app = express();

app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use("/avatar", express.static(`${upload.tmpFolder}/avatar`));
app.use("/car", express.static(`${upload.tmpFolder}/car`));

app.use(router);

app.use(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (err: Error, reques: Request, response: Response, next: NextFunction) => {
        if (err instanceof AppError) {
            return response.status(err.statusCode).json({
                message: err.message,
            });
        }
        return response.status(500).json({
            status: "error",
            message: `Internal server error - ${err.message}`,
        });
    }
);
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
export { app };
