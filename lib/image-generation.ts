
const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

// Using 'imagen-3.0-generate-001' as the standard endpoint for Gemini Image Generation.
// "NanoBanana" likely refers to 'gemini-2.5-flash-image' or a specific configuration.
// If 'gemini-2.5-flash-image' is available, replace the model name below.
const GOOGLE_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:predict';

// Fallback to specific NanoBanana logic if needed
const NANOBANANA_MODEL = 'gemini-2.5-flash-image'; 

export async function generatePixelArtIcon(description: string): Promise<string | null> {
  if (!API_KEY) {
    console.error('Gemini API key not found');
    return null;
  }

  const prompt = `16-bit pixel art icon of ${description}. Retro game style, clean simplified look, solid background, vibrant colors, centered, high contrast. As a game icon sprite.`;

  try {
    // Attempting to use the Imagen model (standard Gemini Image Gen)
    const response = await fetch(`${GOOGLE_API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        instances: [
          {
            prompt: prompt,
          }
        ],
        parameters: {
          sampleCount: 1,
          aspectRatio: "1:1",
          // personGeneration: "allow_adult", // Optional params if needed
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.warn(`Gemini API (Imagen) error: ${response.status} ${errorText}. Trying fallback/NanoBanana...`);
       // If standard Imagen fails, logic to try 'gemini-2.5-flash-image' could go here if we knew the exact endpoint format. 
       // For now, we will return null or try to process the error.
       throw new Error(`Gemini API Error: ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    
    if (data.predictions && data.predictions.length > 0) {
      const base64Image = data.predictions[0].bytesBase64Encoded;
      return `data:image/png;base64,${base64Image}`;
    }

    return null;
  } catch (error) {
    console.error('Error generating icon with Gemini:', error);
    return null;
  }
}
