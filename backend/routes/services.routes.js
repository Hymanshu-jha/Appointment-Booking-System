import express from "express";
import authorize from "../middlewares/authorize.middlewares.js";
import { upload } from "../utils/multer/multer.utils.js";
import {
  createService,
  listServices,
  getService,
  replaceService,
  updateService,
  deleteService,
  listAll,
  getServiceDetails
} from "../controllers/services.controllers.js";

const serviceRouter = express.Router();

serviceRouter.get('/getServiceDetails/:id', authorize, getServiceDetails);

serviceRouter.get("/getServiceById/:id", authorize, getService);

serviceRouter.post(
  "/create",
  authorize,
  upload.single("uploadedFile"),
  createService
);

serviceRouter.get("/myservices", authorize, listServices);
serviceRouter.get("/listAll", listAll);




serviceRouter.put(
  "/replace/:id",
  authorize,
  upload.single("uploadedFile"),
  replaceService
);

serviceRouter.patch(
  "/update/:id",
  authorize,
  upload.single("uploadedFile"),
  updateService
);

serviceRouter.delete("/delete/:id", authorize, deleteService);

export default serviceRouter;
