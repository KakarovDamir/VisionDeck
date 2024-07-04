import { Request, Response } from "express";
import pptxService from "./pptx-service";

class PptxController {
  async createPresentation(req: Request, res: Response) {
    try {
      console.log("Received request to create presentation with body:", req.body);
      const { userPrompt } = req.body;
      const presentation = await pptxService.createPresentation(userPrompt);
      res.status(201).json(presentation);
    } catch (error) {
      console.error("Error in createPresentation controller:", error);
      res.status(500).json({ message: "Error creating presentation", error });
    }
  }

  async getPresentation(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const presentation = await pptxService.getPresentation(id);
      if (!presentation) {
        return res.status(404).json({ message: "Presentation not found" });
      }
      res.status(200).json(presentation);
    } catch (error) {
      console.error("Error in getPresentation controller:", error);
      res.status(500).json({ message: "Error retrieving presentation", error });
    }
  }

  async updateSlide(req: Request, res: Response) {
    try {
      const { id, slideIndex } = req.params;
      const updatedContent = req.body;
  
      console.log(`Received request to update slide ${slideIndex} for presentation ${id} with content:`, updatedContent);
  
      const presentation = await pptxService.updateSlide(id, parseInt(slideIndex), updatedContent);
      if (!presentation) {
        console.error(`Presentation with ID ${id} not found.`);
        return res.status(404).json({ message: "Presentation not found" });
      }
      
      if (!presentation.slides[parseInt(slideIndex)]) {
        console.error(`Slide with index ${slideIndex} not found in presentation ${id}.`);
        return res.status(404).json({ message: "Slide not found" });
      }
  
      res.status(200).json(presentation);
    } catch (error) {
      console.error("Error in updateSlide controller:", error);
      res.status(500).json({ message: "Error updating slide", error });
    }
  }
  
}

export default new PptxController();
