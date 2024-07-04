import PptxGenJS from "pptxgenjs";
import { GenerationConfig, GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import pptx, { IPresentation } from "./models/pptx";
import unsplashService from "./unsplash-service";
import nlp from "compromise";

dotenv.config();

class PptxService {
  private extractKeywords(userPrompt: string): string {
    const doc = nlp(userPrompt);
    const nouns = doc.nouns().out('array');
    return nouns.length > 0 ? nouns[0] : userPrompt;
}

private async generateJson(userPrompt: string, model: any): Promise<any> {
  const systemPrompt = `
  You are a highly skilled AI specialized in generating presentation content. The user will provide a prompt, and your task is to create a structured JSON object that outlines the content of each slide in the presentation, formatted to be stored in a MongoDB database. Each section in the JSON represents a slide. Please follow the structure and guidelines below:

  1. Each slide should be represented as an object in the "slides" array.
  2. The structure of each slide should be as follows:
  {
      "title": "Title of the section or slide",
      "background": {
          "color": "Hex color code for the slide background"
      },
      "elements": [
          {
              "type": "text" | "image" | "shape",
              "text": "Content of the text element (only for type 'text')",
              "path": "Path to the image file (only for type 'image')",
              "shapeType": "Type of shape (only for type 'shape')",
              "options": {
                  "x": number  (required),
                  "y": number  (required),
                  "w": number  (required),
                  "h": number  (required),
                  "align"?: string,
                  "autoFit"?: boolean,
                  "baseline"?: number,
                  "bold"?: boolean,
                  "breakLine"?: boolean,
                  "bullet"?: boolean | object,
                  "charSpacing"?: number,
                  "color"?: string,
                  "fill"?: string,
                  "fit"?: string,
                  "fontFace"?: string,
                  "fontSize"?: number,
                  "glow"?: object,
                  "highlight"?: string,
                  "hyperlink"?: string,
                  "indentLevel"?: number,
                  "inset"?: number,
                  "isTextBox"?: boolean,
                  "italic"?: boolean,
                  "lang"?: string,
                  "line"?: object,
                  "lineSpacing"?: number,
                  "lineSpacingMultiple"?: number,
                  "margin"?: number,
                  "outline"?: object,
                  "paraSpaceAfter"?: number,
                  "paraSpaceBefore"?: number,
                  "rectRadius"?: number,
                  "rotate"?: number,
                  "rtlMode"?: boolean,
                  "shadow"?: object,
                  "softBreakBefore"?: boolean,
                  "strike"?: string,
                  "subscript"?: boolean,
                  "superscript"?: boolean,
                  "transparency"?: number,
                  "underline"?: object,
                  "valign"?: string,
                  "vert"?: string,
                  "wrap"?: boolean
              }
          }
      ]
  }

  3. Ensure the title of each slide is concise yet descriptive.
  4. Background color should be specified for each slide.
  5. Each element in the slide should be clear and well-structured.
  6. Use appropriate values for position, text properties, and other options to ensure proper formatting and alignment.
  7. Provide a balanced layout for text, images, and shapes.
  8.Each text element should include a "color" property. If the color is not specified, use the default value "#000000".
  
  `;

  try {
      const result = await model.generateContent(systemPrompt + '\n' + userPrompt);
      const text = result.response.text();
      const json = JSON.parse(text);

      json.slides.forEach((slide: any) => {
          slide.elements.forEach((element: any) => {
              if (element.type === 'text') {
                  element.options.color = element.options.color || '#000000';
              }
          });
      });

      return json;
  } catch (error) {
      console.error("Error generating JSON content:", error);
      throw error;
  }
}

  private async savePresentation(userPrompt: string, slides: any): Promise<any> {
    const newPresentation = new pptx({
      title: userPrompt,
      slides: slides,
    });
    return await newPresentation.save();
  }

  private async createPptx(keyword: string, jsonResult: any): Promise<PptxGenJS> {
    const pres = new PptxGenJS();

    // Debug message
    console.log("Starting to create PPTX");

    const titleSlide = pres.addSlide();
    titleSlide.background = { color: "FFFFFF" };
    titleSlide.addText(keyword, {
        x: 1.0, y: 1.0, w: 8.5, h: 2.0,
        fontSize: 36, color: "003366", bold: true, align: "center", valign: "middle",
    });
    titleSlide.addText("Generated by VisionDeck", {
        x: 1.0, y: 3.0, w: 8.5, h: 1.0,
        fontSize: 24, color: "333333", align: "center", valign: "middle",
    });

    const slidePromises = jsonResult.slides.map(async (slideData: any, index: number) => {
        const slide = pres.addSlide();
        slide.background = { color: slideData.background?.color || "FFFFFF" };

        let currentY = 1.0; // Initial Y position

        const elementPromises = slideData.elements.map(async (element: any, elementIndex: number) => {
            const options = element.options || {};

            // Convert coordinates from pixels to inches if needed
            options.x = options.x / 100;
            options.y = options.y / 100;
            options.w = options.w / 100;
            options.h = options.h / 100;

            if (element.type === 'text' || element.type === 'image') {
                options.color = options.color || '#000000';

                if (currentY + options.h > 6.5) { 
                    console.warn("Element exceeds slide height, skipping:", element);
                    return; 
                }
                options.y = currentY;
                currentY += options.h + 0.5; 
            }
            console.log("Adding element", element);
            switch (element.type) {
                case "text":
                    slide.addText(element.text, options);
                    break;
                case "image":
                    try {
                        const sectionImageUrl = await unsplashService.getImageByQuery(keyword, index + 1);
                        element.path=sectionImageUrl;
                        slide.addImage({ path: sectionImageUrl, ...options });

                        currentY += options.h + 0.1;
                    } catch (error) {
                        console.error("Error fetching image", error);
                    }
                    break;
                case "shape":
                    slide.addShape(element.shapeType, options);
                    break;
                default:
                    console.warn("Unknown element type", element.type);
                    break;
            }
        });

        await Promise.all(elementPromises);
    });

    await Promise.all(slidePromises);

    console.log("PPTX creation complete");

    return pres;
}

  public async createPresentation(userPrompt: string): Promise<any> {
    if (!process.env.GOOGLE_AI_API_KEY) {
      throw new Error("GOOGLE_AI_API_KEY is not set in environment variables.");
    }

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        response_mime_type: "application/json"
      } as GenerationConfig
    });

    try {
      console.log("Generating JSON for user prompt:", userPrompt);
      const jsonResult = await this.generateJson(userPrompt, model);
      console.log("JSON result:", jsonResult);

      const keyword = this.extractKeywords(userPrompt);
      const pres = await this.createPptx(keyword, jsonResult);

      const fileName = `${keyword}.pptx`;
      console.log("Writing file:", fileName);
      await pres.writeFile({ fileName });

      return await this.savePresentation(userPrompt, jsonResult.slides);
    } catch (error) {
      console.error("Error creating presentation:", error);
      throw error;
    }
  }

  async getPresentation(presentationId: string): Promise<IPresentation | null> {
    try {
      return await pptx.findById(presentationId);
    } catch (error) {
      console.error("Error in getPresentation:", error);
      throw error;
    }
  }

  async updateSlide(presentationId: string, slideIndex: number, updatedContent: any): Promise<IPresentation | null> {
    try {
      console.log(`Fetching presentation with ID ${presentationId}`);
      const presentation = await pptx.findById(presentationId);

      if (!presentation) {
        console.error(`Presentation with ID ${presentationId} not found.`);
        throw new Error("Presentation not found");
      }

      if (slideIndex < 0 || slideIndex >= presentation.slides.length) {
        console.error(`Invalid slide index: ${slideIndex} for presentation with ID ${presentationId}.`);
        throw new Error("Invalid slide index");
      }

      presentation.slides[slideIndex] = { ...presentation.slides[slideIndex], ...updatedContent };
      console.log(`Updating slide ${slideIndex} for presentation ${presentationId} with content:`, updatedContent);

      return await presentation.save();
    } catch (error) {
      console.error("Error in updateSlide:", error);
      throw error;
    }
  }
}

export default new PptxService();