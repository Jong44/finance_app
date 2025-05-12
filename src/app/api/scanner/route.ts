import { askGPT } from "@/services/askGPT";
import { detectTextFromImage } from "@/services/vision";
import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

export const config = {
    api: {
        bodyParser: false,
    },
};

const cleaningData = (data: string) => {
    const text = data.replace(/\r?\n|\r/g, '\n').replace(/\s\s+/g, ' ').trim();
    return text;
};

export async function POST(req: NextRequest, { params }: { params: any }) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as Blob | null;

        if (!file) {
            return NextResponse.json({
                success: false,
                reason: "No file uploaded"
            });
        }

        // Process the image
        const buffer = Buffer.from(await file.arrayBuffer());
        console.log("File received, size:", buffer.length, "bytes");

        // Improve image preprocessing for better OCR results
        const preprocessedImage = await sharp(buffer)
            .resize({ width: 1200 })
            .sharpen()
            .normalize()
            .grayscale()
            .toBuffer();

        console.log("Image preprocessed successfully");

        // Extract text from image
        const { text, raw } = await detectTextFromImage(preprocessedImage);
        
        if (!text || text.trim() === '') {
            console.error("No text detected in the image");
            return NextResponse.json({
                success: false,
                reason: "No text could be detected in the image. Please upload a clearer image."
            });
        }

        console.log("Text detected from image:", text.substring(0, 100) + "...");
        const cleanedData = cleaningData(text);

        // Improved prompt for better parsing
        const gptParsed = await askGPT(`
            You are an expert invoice parser. Parse the following invoice text into a structured JSON object.
            
            ---
            ${cleanedData}
            ---

            Extract the following information:
            1. Supplier name (name_supplier)
            2. Receipt code/number (code_receipt)
            3. Date (in YYYY-MM-DD format)
            4. Total price (as a number)
            5. Tax amount (as a number)
            6. For each item/product in the invoice:
               - Product name (name_product)
               - Quantity (as a number)
               - Unit (e.g., pcs, kg, etc.)
               - Price per unit (as a number)
               - Total price for the item (as a number)
               - Category (best guess from: Office Supplies, Food & Beverage, Transportation, Accommodation, Other)

            If the content is not an invoice or cannot be parsed, return exactly the string "unknown".

            Return the data in this exact JSON format:
            {
              "expanse": {
                "name_supplier": "[Supplier Name]",
                "code_receipt": "[Receipt Number]",
                "date": "[YYYY-MM-DD]",
                "total_price": [Total Amount],
                "tax_price": [Tax Amount]
              },
              "expanse_detail": [
                {
                  "name_product": "[Product Name]",
                  "quantity": [Quantity],
                  "unit": "[Unit]",
                  "price_per_unit": [Unit Price],
                  "total_price": [Item Total Price],
                  "category": "[Category: Office Supplies, Equipment, Food & Beverages, Utilities,Travel, Services, Other]"
                },
                ...
              ]
            }
          `, true);

        console.log("GPT response received:", gptParsed.substring(0, 100) + "...");

        if (gptParsed.toLowerCase() === 'unknown') {
            return NextResponse.json({
                success: false,
                reason: 'The uploaded file is not recognized as an invoice.'
            });
        }

        // Clean up the GPT response
        let output = gptParsed
            .replace(/```json/i, '') // Remove opening ```json
            .replace(/```/g, '')     // Remove closing ```
            .trim();

        // Try to parse the JSON
        try {
            const parsedData = JSON.parse(output);
            
            // Validate the parsed data structure
            if (!parsedData.expanse || !parsedData.expanse_detail || !Array.isArray(parsedData.expanse_detail)) {
                throw new Error("Invalid data structure");
            }
            
            console.log("Successfully parsed invoice data");
            
            return NextResponse.json({
                success: true,
                data: parsedData,
            });
        } catch (jsonError) {
            console.error("JSON parsing error:", jsonError, "\nRaw output:", output);
            return NextResponse.json({
                success: false,
                reason: 'Failed to parse the extracted data. The invoice format may not be supported.'
            });
        }
    } catch (error: any) {
        console.error("Internal server error:", error);
        return NextResponse.json({
            success: false,
            reason: 'Internal server error',
        });
    }
}
