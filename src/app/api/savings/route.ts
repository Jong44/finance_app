import { NextRequest, NextResponse } from "next/server";
import { prisma } from '@/lib/prisma';


export async function GET(request: NextRequest) {
    try {
        const goals = await prisma.savingsGoal.findMany({
            orderBy: { created_at: "asc" },
        });
        return NextResponse.json(goals);
    } catch (error) {
        console.error("Error fetching savings goals:", error);
        return NextResponse.json({ error: "Failed to fetch savings goals" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const { name, target_amount } = await request.json();

        if (!name || !target_amount) {
            return NextResponse.json({ error: "Name and target amount are required" }, { status: 400 });
        }

        const goal = await prisma.savingsGoal.create({
            data: {
                name,
                target_amount,
                current_amount: 0,
            },
        });

        return NextResponse.json(goal);
    } catch (error) {
        console.error("Error creating savings goal:", error);
        return NextResponse.json({ error: "Failed to create savings goal" }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const { id, name, target_amount, current_amount } = await request.json();

        if (!id) {
            return NextResponse.json({ error: "ID is required" }, { status: 400 });
        }

        const goal = await prisma.savingsGoal.update({
            where: { id },
            data: { name, target_amount, current_amount },
        });

        return NextResponse.json(goal);
    } catch (error) {
        console.error("Error updating savings goal:", error);
        return NextResponse.json({ error: "Failed to update savings goal" }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { id } = await request.json();

        if (!id) {
            return NextResponse.json({ error: "ID is required" }, { status: 400 });
        }

        await prisma.savingsGoal.delete({
            where: { id },
        });

        return NextResponse.json({ message: "Savings goal deleted successfully" });
    } catch (error) {
        console.error("Error deleting savings goal:", error);
        return NextResponse.json({ error: "Failed to delete savings goal" }, { status: 500 });
    }
}
