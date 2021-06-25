import { Router } from "express";
import multer from "multer";

import upoloadConfig from "@config/upload";
import { CreateCarController } from "@modules/cars/useCases/createCar/CreateCarUserController";
import { CreateCarSpecificationController } from "@modules/cars/useCases/createCarSpecification/CreateCarSpecificationController";
import { ListAvailableCarsController } from "@modules/cars/useCases/listAvailableCars/ListAvailableCarsController";
import { UploadCarImagesController } from "@modules/cars/useCases/uploadCarImages/UploadCarImagesController";

import { ensureAdmin } from "../middlewares/ensureAdmin";
import { ensureAutheticated } from "../middlewares/ensureAuthenticated";

const carsRoutes = Router();

const createCarController = new CreateCarController();
const listAvailableCarsController = new ListAvailableCarsController();
const createCarSpecificationController = new CreateCarSpecificationController();
const uploadCarImagesController = new UploadCarImagesController();

const upload = multer(upoloadConfig);

carsRoutes.post(
  "/",
  ensureAutheticated,
  ensureAdmin,
  createCarController.handle
);

carsRoutes.get("/available", listAvailableCarsController.handle);

carsRoutes.post(
  "/specifications/:id",
  ensureAutheticated,
  ensureAdmin,
  upload.array("images"), // nome retirado de UploadCarImagesController
  createCarSpecificationController.handle
);

carsRoutes.post(
  "/images/:id",
  ensureAutheticated,
  ensureAdmin,
  upload.array("images"),
  uploadCarImagesController.handle
);

export { carsRoutes };
