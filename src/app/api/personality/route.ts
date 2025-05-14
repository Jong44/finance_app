// app/api/personality/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Adjust the import based on your project structure

export async function GET() {
  try {
    const personalities = await prisma.personality.findMany();
    return NextResponse.json(personalities, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching personalities' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { name, age, profession, income, expenses_foods, expenses_transportation, expenses_entertainment, expenses_others, is_saving } = await req.json();
  
  try {
    const newPersonality = await prisma.personality.create({
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
    return NextResponse.json(newPersonality, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error creating personality' }, { status: 500 });
  }
}
