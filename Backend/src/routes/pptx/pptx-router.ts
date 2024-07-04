import { Router } from "express";
import pptxController from "./pptx-controller";

const pptxRouter = Router();

pptxRouter.post("/", pptxController.createPresentation);
pptxRouter.get("/:id", pptxController.getPresentation);
pptxRouter.put("/:id/slide/:slideIndex", pptxController.updateSlide);

export default pptxRouter;
