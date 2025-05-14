import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    timeout: 60000, // 60 seconds timeout to prevent hanging requests
});

export async function POST(request: NextRequest) {
  try {
    const { description, price } = await request.json();

    if (!description || !price) {
      return NextResponse.json(
        { error: "Both 'description' and 'price' are required" },
        { status: 400 }
      );
    }

    const prompt = `Kategori pengeluaran untuk deskripsi "${description}" dengan harga Rp ${price} termasuk dalam salah satu dari kategori berikut: "needs", "wants", atau "savings". Pilih kategori yang paling sesuai.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2, // Making responses more predictable
    });

    const category = response.choices[0]?.message?.content?.trim().toLowerCase();

    if (!category || !["needs", "wants", "savings"].includes(category)) {
      return NextResponse.json(
        { error: "Invalid response from OpenAI" },
        { status: 500 }
      );
    }

    return NextResponse.json({ category });
  } catch (error) {
    console.error("Error categorizing expense:", error);
    return NextResponse.json({ error: "Failed to categorize expense" }, { status: 500 });
  }
}
