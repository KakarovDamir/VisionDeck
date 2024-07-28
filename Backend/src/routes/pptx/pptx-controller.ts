import { Request, Response } from "express";
import PptxService from "./pptx-service";
import puppeteer from 'puppeteer';

class PptxController {
  public async createPresentation(req: Request, res: Response): Promise<void> {
    try {
      const { userPrompt } = req.body;
      const presentation = await PptxService.createPresentation(userPrompt);
      res.status(201).json(presentation);
    } catch (error) {
      res.status(500).json({ message: "Error generating presentation", error });
    }
  }

  public async getPresentation(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const presentation = await PptxService.getPresentation(id);
      if (presentation) {
        res.status(200).json(presentation);
      } else {
        res.status(404).json({ message: "Presentation not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Error fetching presentation", error });
    }
  }

  public async updateSlide(req: Request, res: Response): Promise<void> {
    try {
      const { id, slideIndex } = req.params;
      const updatedContent = req.body;
      const presentation = await PptxService.updateSlide(id, parseInt(slideIndex), updatedContent);
      if (presentation) {
        res.status(200).json(presentation);
      } else {
        res.status(404).json({ message: "Presentation not found or invalid slide index" });
      }
    } catch (error) {
      res.status(500).json({ message: "Error updating slide", error });
    }
  }

  public async updatePresentation(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updatedContent = req.body;
      const presentation = await PptxService.updatePresentation(id, updatedContent);
      if (presentation) {
        res.status(200).json(presentation);
      } else {
        res.status(404).json({ message: "Presentation not found" });
      }
    } catch (error) {
      res.status (500).json({ message: "Error updating presentation", error });
    }
  }

  public async generatePptx(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const pptxBuffer = await PptxService.generatePptxBuffer(id);
      res.setHeader('Content-Disposition', `attachment; filename=${id}.pptx`);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.presentationml.presentation');
      res.send(pptxBuffer);
    } catch (error) {
      res.status(500).json({ message: "Error generating PPTX", error });
    }
  }

  public async generatePdf(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(`https://day-y.vercel.app/ru/pptx/${id}?print-pdf`, {
        waitUntil: 'networkidle0',
      });

      // Wait for all images to load
      await page.waitForFunction(() => {
        const images = Array.from(document.images);
        return images.every((img) => img.complete && img.naturalHeight !== 0);
      });

      const pdf = await page.pdf({ format: 'A4', printBackground: true });
      await browser.close();

      res.contentType('application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=${id}.pdf`);
      res.send(pdf);
    } catch (error) {
      console.error('Error generating PDF:', error);
      res.status(500).json({ message: 'Error generating PDF', error });
    }
  }
}

export default new PptxController();
