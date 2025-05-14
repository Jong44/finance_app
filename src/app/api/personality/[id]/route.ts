// app/api/personality/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Adjust the import based on your project structure

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const personality = await prisma.personality.findUnique({
      where: { id },
    });

    if (!personality) {
      return NextResponse.json({ error: 'Personality not found' }, { status: 404 });
    }

    return NextResponse.json(personality, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching personality' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const { name, age, profession, income, expenses_foods, expenses_transportation, expenses_entertainment, expenses_others, is_saving } = await req.json();

  try {
    const updatedPersonality = await prisma.personality.update({
      where: { id },
      data: {
        name,
        age,
        profession,
        income,
        expenses_foods,
        expenses_transportation,
        expenses_entertainment,
        expenses_others,
        is_saving,
      },
    });
    return NextResponse.json(updatedPersonality, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Error updating personality' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    await prisma.personality.delete({
      where: { id },
    });
    return NextResponse.json({ message: 'Personality deleted' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting personality' }, { status: 500 });
  }
}
