import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";



export async function POST(req: NextRequest) {
  const { savings, needs, wants } = await req.json();

  const needsPercent = needs || 50; // Default to 50% if not provided
  const wantsPercent = wants || 30; // Default to 30% if not provided
  const savingsPercent = savings || 20; // Default to 20% if not provided

  try {
    const budgetOverview = await prisma.budgetOverview.create({
      data: {
        needs,
        wants,
        savings,
      },
    });

    return NextResponse.json(budgetOverview, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Error creating budget overview" }, { status: 500 });
  }
}

// PUT Route for updating an existing budget overview
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const { savings, needs, wants } = await req.json();

    const needsPercent = needs || 50; // Default to 50% if not provided
    const wantsPercent = wants || 30; // Default to 30% if not provided
    const savingsPercent = savings || 20; // Default to 20% if not provided

  try {
    const updatedBudget = await prisma.budgetOverview.update({
      where: { id },
      data: { needs: needsPercent, wants: wantsPercent, savings: savingsPercent },
    });

    return NextResponse.json(updatedBudget, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error updating budget overview" }, { status: 500 });
  }
}
