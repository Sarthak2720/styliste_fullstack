import axios from 'axios';
import axiosInstance from './axios';

const BASE_URL = "https://api.lightxeditor.com/external/api/v2";

export const getApiKey = async (): Promise<string> => {
  try {
    const response = await axiosInstance.get<{ key: string; value: string | null }>(
      "/settings/lightx_api_key"
    );
    const value = response.data.value;
    if (!value || !value.trim()) {
      throw new Error("API Key not configured. Please open Settings from the profile dropdown to add your LightX API Key.");
    }
    return value.trim();
  } catch (error: any) {
    console.error("Error fetching LightX API key from backend:", error);
    throw new Error(error.message || "Failed to retrieve API configuration from the server.");
  }
};

export const uploadImageToLightX = async (file: File) => {
  try {
    const apiKey = await getApiKey();
    
    // 1. Get signed upload URL
    const uploadUrlResponse = await axios.post(
      `${BASE_URL}/uploadImageUrl`,
      {
        uploadType: "imageUrl",
        size: file.size,
        contentType: file.type || "image/jpeg"
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey
        }
      }
    );

    const { uploadImage, imageUrl } = uploadUrlResponse.data.body;

    // 2. Upload actual file to S3
    await axios.put(uploadImage, file, {
      headers: {
        "Content-Type": file.type || "image/jpeg"
      }
    });

    return imageUrl;
  } catch (error: any) {
    console.error("Error uploading image:", error);
    throw new Error(error.message?.includes("API Key") ? error.message : "Failed to upload image. Please try again.");
  }
};

// Helper function to download an image from local/external URL and upload to LightX
export const uploadUrlToLightX = async (imageUrl: string) => {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const filename = imageUrl.substring(imageUrl.lastIndexOf('/') + 1) || 'image.jpg';
    const file = new File([blob], filename, { type: blob.type || 'image/jpeg' });
    return await uploadImageToLightX(file);
  } catch (error: any) {
    console.error("Error uploading product image to LightX:", error);
    throw new Error("Failed to process product image. Make sure the server is running and accessible.");
  }
};

export const generateTryOn = async (personImageUrl: string, garmentImageUrl: string) => {
  try {
    const apiKey = await getApiKey();
    
    const response = await axios.post(
      `${BASE_URL}/aivirtualtryon`,
      {
        imageUrl: personImageUrl,
        styleImageUrl: garmentImageUrl
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey
        }
      }
    );
    
    const orderId = response.data?.body?.orderId;
    
    if (!orderId) {
      throw new Error("Failed to initialize generation (no orderId returned).");
    }

    // Polling for the result
    return new Promise<string>((resolve, reject) => {
      let attempts = 0;
      const maxAttempts = 30; // Max 90 seconds
      
      const poll = setInterval(async () => {
        try {
          attempts++;
          const statusResp = await axios.post(
            `${BASE_URL}/order-status`,
            { orderId },
            {
              headers: {
                "Content-Type": "application/json",
                "x-api-key": apiKey
              }
            }
          );
          
          const statusData = statusResp.data;
          
          if (statusData.status === "FAIL" || statusData.statusCode !== 2000) {
             clearInterval(poll);
             reject(new Error(statusData.message || statusData.description || "Generation failed on the server."));
             return;
          }

          const body = statusData.body;
          
          if (body && (body.status === "active" || body.status === "done" || body.status === "completed" || body.output)) {
             clearInterval(poll);
             resolve(body.output || body.imageUrl || body.result);
          } else if (attempts >= maxAttempts) {
             clearInterval(poll);
             reject(new Error("Generation timed out. Please try again later."));
          }
        } catch (pollError) {
          clearInterval(poll);
          reject(new Error("Error checking generation status."));
        }
      }, 3000); 
    });
  } catch (error: any) {
    console.error("Error generating try-on:", error);
    throw new Error(error.message?.includes("API Key") ? error.message : (error.response?.data?.message || "Failed to generate try-on. Please try again."));
  }
};
