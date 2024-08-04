import PptxGenJS from "pptxgenjs";
import dotenv from "dotenv";
import OpenAI from "openai";
import pptx, { IPresentation } from "./models/pptx";
import unsplashService from "./unsplash-service";
import nlp from "compromise";
import axios from 'axios';
import { S3 } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const s3 = new S3({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
  }
});

class PptxService {
  private extractKeywords(userPrompt: string): string {
    const doc = nlp(userPrompt);
    const nouns = doc.nouns().out('array');
    console.log("Extracted keywords:", nouns);
    return nouns.length > 0 ? nouns[0] : userPrompt;
  }

  private async generateImage(keyword: string): Promise<string> {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: keyword,
      n: 1,
      size: "1024x1024",
    });
    const imageUrl = response.data[0].url;

    if (imageUrl) {
      const imagePath = await this.downloadAndUploadImage(imageUrl, keyword);
      return imagePath;
    }

    throw new Error("Image generation failed");
  }

  private async downloadAndUploadImage(url: string, keyword: string): Promise<string> {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data, 'binary');
    const imageName = `${keyword}-${Date.now()}.png`;

    const uploadResult = await new Upload({
      client: s3,
      params: {
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: imageName,
        Body: buffer,
        ACL: 'public-read'
      }
    }).done();

    return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${imageName}`;
  }

  private async generateJson(userPrompt: string): Promise<any> {
    const systemPrompt = `
  You are an exceptionally advanced AI specialized in generating high-quality presentation content. The user will provide a prompt, and your task is to create a comprehensive and well-structured JSON object that outlines the content of each slide in the presentation. This JSON object should be formatted for storage in a MongoDB database. Each section in the JSON represents a slide. Adhere to the following structure and guidelines to ensure the highest quality and relevance.
  
  Output only the JSON object, enclosed between the delimiters ###BEGIN_JSON### and ###END_JSON###.
  
  1. **Presentation Structure:**
     - The presentation must consist of a minimum of 8 slides.
     - At least 3 slides should contain images; the remaining slides should primarily focus on textual content.
     - Each slide must contain either text or images, not both.
     - Ensure that slides with images are placed after meaningful text slides and are not at the beginning or the end of the presentation.
  
  2. **Slide Representation:**
     - Each slide should be represented as an object within the "slides" array.
     - The structure of each slide object should be as follows:
     {
         "title": "Title of the section or slide",
         "background": {
             "transition": "default | fade | zoom | concave | linear | none",
             "theme": "sky | beige | moon | night | serif | simple | solarized"
         },
         "elements": [
             {
                 "type": "text" | "image",
                 "text": "Content of the text element (only for type 'text')",
                 "path": "Keyword for the image content (only for type 'image')"
             }
         ]
     }
  
  3. **Content Guidelines:**
     - **Title:** Ensure the title of each slide is concise yet descriptive.
     - **Elements:** Each element in the slide should be clear, well-structured, and contribute to the overall message of the slide.
     - **Text Content:** Each text element should include a "color" property. If the color is not specified, use the default value "#000000".
     - **Image Content:** Use a keyword in English that describes the content of the image instead of a random link. This keyword will be used to search for relevant images using the Unsplash API.
  
  4. **Quality and Consistency:**
     - Generate the content in the same language as the user prompt to maintain coherence and relevance.
     - Utilize a consistent and professional tone across all slides.
  
  5. **Overall Objective:** Create a professional and visually appealing presentation based on the user prompt.
  
  ###BEGIN_JSON###
  <Output your JSON object here>
  ###END_JSON###
  `;
  
    try {
      const completion = await openai.chat.completions.create({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        model: "gpt-4o",
      });
  
      let presentationData = completion.choices[0].message.content;
  
      if (!presentationData) {
        throw new Error("Presentation data is null");
      }
  
      console.log("Raw presentation data:", presentationData);
  
      const jsonMatch = presentationData.match(/###BEGIN_JSON###([\s\S]*?)###END_JSON###/);
  
      if (!jsonMatch) {
        throw new Error("Failed to extract JSON from the generated content");
      }
  
      presentationData = jsonMatch[1];
  
      try {
        const parsedData = JSON.parse(presentationData);
  
        parsedData.presentationTitle = parsedData.presentationTitle || userPrompt;
  
        await Promise.all(parsedData.slides.map(async (slide: any) => {
          await Promise.all(slide.elements.map(async (element: any) => {
            if (element.type === 'image' && element.path) {
              let imageUrl = await unsplashService.getImageByQuery(element.path, 0);
              if (!imageUrl) {
                imageUrl = await this.generateImage(element.path);
              }
              element.path = imageUrl;
            }
            if (element.type === 'text') {
              element.color = element.color || '#000000';
            }
          }));
        }));
  
        return parsedData;
      } catch (parseError) {
        console.error("Failed to parse JSON. Raw data:", presentationData);
        throw parseError;
      }
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

  private async createPptxBuffer(keyword: string, jsonResult: any): Promise<Buffer> {
    const pres = new PptxGenJS();
  
    // Define the mapping of Reveal.js themes to colors and text styles
    const themeMapping = {
      'moon': { bgColor: '#002b36', textColor: '#ffffff', font: 'Arial', textWidth: 8.0 },
      'night': { bgColor: '#111111', textColor: '#ffffff', font: 'Arial', textWidth: 8.0 },
      'sky': { bgColor: '#87CEEB', textColor: '#000000', font: 'Comic Sans MS', textWidth: 8.0 },
      'solarized': { bgColor: '#fdf6e3', textColor: '#657b83', font: 'Courier New', textWidth: 8.0 },
      'serif': { bgColor: '#f0f1eb', textColor: '#000000', font: 'Times New Roman', textWidth: 8.0 },
      'simple': { bgColor: '#ffffff', textColor: '#000000', font: 'Helvetica', textWidth: 8.0 },
      'beige': { bgColor: '#f7f3de', textColor: '#000000', font: 'Georgia', textWidth: 8.0 }
    };
  
    // Define the mapping of Reveal.js transitions
    const transitionMapping = {
      'default': 'none',
      'fade': 'fade',
      'zoom': 'zoom',
      'concave': 'circle',
      'linear': 'push',
      'none': 'none'
    };
  
    // Add the title slide
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
  
    const slidePromises = jsonResult.slides.map(async (slideData: any) => {
      const slide = pres.addSlide();
  
      // Apply theme color to the slide
      const theme = themeMapping[slideData.background.theme] || { bgColor: "FFFFFF", textColor: "#000000", font: 'Arial', textWidth: 8.0 };
      slide.background = { color: theme.bgColor };
  
      // Apply transition
      const transition = transitionMapping[slideData.background.transition] || 'none';
      // slide.transition = transition;
  
      slide.addText(slideData.title, {
        x: 0.5, y: 2.0, w: 9.0, h: 1.0,
        fontSize: 24, color: theme.textColor, fontFace: theme.font, bold: true, align: "center", valign: "top",
      });
  
      const elementPromises = slideData.elements.map(async (element: any) => {
        if (element.type === 'text') {
          slide.addText(element.text, {
            x: 0.5, y: 0.3, w: 9.0, h: 5.5,
            fontSize: 18, color: theme.textColor, fontFace: theme.font, align: "center", valign: "middle",
          });
        } else if (element.type === 'image') {
          slide.addImage({
            path: element.path,
            x: 0.0, y: 0.0, w: 9.0, h: 5.5,
          });
        } else if (element.type === 'shape') {
          slide.addShape(element.shapeType, {
            x: 0.5, y: 1.5, w: 9.0, h: 5.5,
          });
        } else {
          console.warn("Unknown element type", element.type);
        }
      });
  
      await Promise.all(elementPromises);
    });
  
    await Promise.all(slidePromises);
  
    const buffer = await pres.stream() as Buffer;
    return buffer;
  }

  public async createPresentation(userPrompt: string): Promise<any> {
    try {
      console.log("Generating JSON for user prompt:", userPrompt);
      const jsonResult = await this.generateJson(userPrompt);
      console.log("JSON result:", jsonResult);

      return await this.savePresentation(userPrompt, jsonResult.slides);
    } catch (error) {
      console.error("Error creating presentation:", error);
      throw error;
    }
  }

  public async getPresentation(presentationId: string): Promise<IPresentation | null> {
    try {
      return await pptx.findById(presentationId);
    } catch (error) {
      console.error("Error in getPresentation:", error);
      throw error;
    }
  }

  public async updateSlide(presentationId: string, slideIndex: number, updatedContent: any): Promise<IPresentation | null> {
    try {
      const presentation = await pptx.findById(presentationId);

      if (!presentation) {
        throw new Error("Presentation not found");
      }

      if (slideIndex < 0 || slideIndex >= presentation.slides.length) {
        throw new Error("Invalid slide index");
      }

      presentation.slides[slideIndex] = { ...presentation.slides[slideIndex], ...updatedContent };

      return await presentation.save();
    } catch (error) {
      console.error("Error in updateSlide:", error);
      throw error;
    }
  }

  public async updatePresentation(presentationId: string, updatedContent: any): Promise<IPresentation | null> {
    try {
      const presentation = await pptx.findById(presentationId);

      if (!presentation) {
        throw new Error("Presentation not found");
      }

      if (updatedContent.transition) {
        presentation.slides.forEach(slide => {
          slide.background.transition = updatedContent.transition;
        });
      }
      if (updatedContent.theme) {
        presentation.slides.forEach(slide => {
          slide.background.theme = updatedContent.theme;
        });
      }

      return await presentation.save();
    } catch (error) {
      console.error("Error in updatePresentation:", error);
      throw error;
    }
  }

  public async generatePptxBuffer(presentationId: string): Promise<Buffer> {
    try {
      const presentation = await this.getPresentation(presentationId);

      if (!presentation) {
        throw new Error("Presentation not found");
      }

      const keyword = presentation.title;
      return await this.createPptxBuffer(keyword, presentation);
    } catch (error) {
      console.error("Error generating PPTX:", error);
      throw error;
    }
  }
}

export default new PptxService();