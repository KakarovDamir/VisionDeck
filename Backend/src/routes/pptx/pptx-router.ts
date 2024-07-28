import { Router } from "express";
import PptxController from "./pptx-controller";

const pptxRouter = Router();

pptxRouter.post("/", PptxController.createPresentation.bind(PptxController));
pptxRouter.get("/:id", PptxController.getPresentation.bind(PptxController));
pptxRouter.put("/:id/slide/:slideIndex", PptxController.updateSlide.bind(PptxController));
pptxRouter.put("/:id", PptxController.updatePresentation.bind(PptxController));
pptxRouter.get("/:id/generate", PptxController.generatePptx.bind(PptxController));
pptxRouter.get('/:id/pdf', PptxController.generatePdf.bind(PptxController));


export default pptxRouter;
