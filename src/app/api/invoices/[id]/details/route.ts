import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const url = new URL(request.url);
        const id = url.pathname.split("/").slice(-2)[0]; // Ambil [id] dari path

        if (!id) {
            return NextResponse.json({ error: "Missing invoice ID" }, { status: 400 });
        }

        // Ambil semua detail pengeluaran berdasarkan expenseId
        const { data, error } = await supabase
            .from("ExpenseDetail")
            .select("*")
            .eq("expenseId", id);

        if (error) {
            console.error("Error fetching expense details:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        if (!data || data.length === 0) {
            return NextResponse.json({ details: [] }, { status: 200 });
        }

        return NextResponse.json({ details: data }, { status: 200 });
    } catch (error) {
        console.error("Unexpected error:", error);
        return NextResponse.json({ error: "Failed to fetch expense details" }, { status: 500 });
    }
}