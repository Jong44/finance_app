import OpenAI from "openai";
import { env } from "process";

const openai = new OpenAI({
    apiKey: env.NEXT_PUBLIC_OPENAI_API_KEY,
    timeout: 60000, // 60 seconds timeout to prevent hanging requests
});

/**
 * Sends a prompt to OpenAI and returns the response
 * @param prompt The prompt to send to OpenAI
 * @param is_long Whether to allow a longer response (more tokens)
 * @param retries Number of retries if the request fails
 * @returns The response from OpenAI or "unknown" if it fails
 */
export const askGPT = async (prompt: string, is_long: boolean = false, retries: number = 2): Promise<string> => {
    try {
        console.log(`Sending prompt to OpenAI (${prompt.length} chars)`);
        
        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
            temperature: 0,
            max_tokens: is_long ? 2000 : 100, // Increased token limit for invoice parsing
            response_format: { type: "text" },
        });

        const content = response.choices[0].message.content?.trim() || "unknown";
        console.log(`Received response from OpenAI (${content.length} chars)`);
        return content;
    } catch (error) {
        console.error("Error asking GPT:", error);
        
        // Retry logic for transient errors
        if (retries > 0) {
            console.log(`Retrying... (${retries} attempts left)`);
            // Wait 2 seconds before retrying
            await new Promise(resolve => setTimeout(resolve, 2000));
            return askGPT(prompt, is_long, retries - 1);
        }
        
        return "unknown";
    }
};