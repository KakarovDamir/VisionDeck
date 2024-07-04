import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

class UnsplashService {
  async getRandomImage(): Promise<string> {
    try {
      console.log("Fetching random image from Unsplash API");
      const response = await axios.get('https://api.unsplash.com/photos/random?client_id=e2wj390EsFZa9M7Ktv8NznND8thaEAXB8J4m6j4tHEY');
      return response.data.urls.full;
    } catch (error) {
      console.error("Error fetching random image:", error);
      throw error;
    }
  }

  async getImageByQuery(query: string, index: number): Promise<string> {
    try {
      console.log("Fetching image by query from Unsplash API:", query);
      const response = await axios.get(`https://api.unsplash.com/search/photos?client_id=e2wj390EsFZa9M7Ktv8NznND8thaEAXB8J4m6j4tHEY&query=${query}&per_page=10`);
      const results = response.data.results;
      if (results.length === 0) {
        throw new Error("No images found");
      }
      return results[index % results.length].urls.full;
    } catch (error) {
      console.error("Error fetching image by query:", error);
      throw error;
    }
  }
}

export default new UnsplashService();
