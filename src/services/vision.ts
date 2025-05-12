// lib/visionClient.ts
import vision from '@google-cloud/vision';

export const client = new vision.ImageAnnotatorClient({
    credentials: {
        client_email: process.env.GCP_CLIENT_EMAIL,
        private_key: process.env.GCP_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
});

/**
 * Performs OCR on an image buffer with enhanced error handling
 * @param imageBuffer Buffer of the image to be processed
 * @returns Text detection results and raw detection data
 */
export async function detectTextFromImage(imageBuffer: Buffer) {
    try {
        // Try document text detection first (better for structured documents like invoices)
        let [docResult] = await client.documentTextDetection({
            image: { content: imageBuffer },
        });
        
        let docDetections = docResult.textAnnotations || [];
        let docText = docDetections[0]?.description || '';
        
        // If document text detection didn't yield good results, fall back to regular text detection
        if (!docText || docText.trim() === '') {
            console.log('Document text detection returned no results, falling back to text detection');
            const [textResult] = await client.textDetection({
                image: { content: imageBuffer },
            });
            
            const textDetections = textResult.textAnnotations || [];
            console.log(`Text detection found ${textDetections.length} text elements`);
            
            return {
                text: textDetections[0]?.description || '',
                raw: textDetections,
            };
        }
        
        console.log(`Document text detection found ${docDetections.length} text elements`);
        return {
            text: docText,
            raw: docDetections,
        };
    } catch (error: any) {
        console.error('Error in OCR text detection:', error);
        throw new Error(`OCR processing failed: ${error.message || 'Unknown error'}`); 
    }
}