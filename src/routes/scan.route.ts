// import { router } from "../server";
import { Router } from "express";
import { predict } from "../controller/scan.controller";
import uploads from "../utils/storage";
const scanRouter = Router();

scanRouter.post("/predict", uploads.single("file"), predict);

export default scanRouter;
