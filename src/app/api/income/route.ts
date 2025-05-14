import { NextRequest, NextResponse } from "next/server";

import { prisma } from '@/lib/prisma';


export async function GET(request: NextRequest) {
    try {
        const incomes = await prisma.income.findMany({
            orderBy: { created_at: "desc" },
            take: 1,
        });

        const totalIncome = incomes[0]?.amount || 0;
        const savings = totalIncome * 0.2;
        const needs = totalIncome * 0.5;
        const wants = totalIncome * 0.3;

        return NextResponse.json({ totalIncome, savings, needs, wants });
    } catch (error) {
        console.error("Error fetching income:", error);
        return NextResponse.json({ error: "Failed to fetch income" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const { amount } = await request.json();

        if (!amount) {
            return NextResponse.json({ error: "Amount is required" }, { status: 400 });
        }

        const income = await prisma.income.create({
            data: { amount },
        });

        return NextResponse.json(income);
    } catch (error) {
        console.error("Error creating income:", error);
        return NextResponse.json({ error: "Failed to create income" }, { status: 500 });
    }
}
