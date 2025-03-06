import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const tournament = await prisma.tournament.findUnique({
      where: { id: Number(params.id) },
      include: {
        divisions: {
          include: {
            teams: {
              include: {
                homeGroundAvailabilities: true, // Fetch availability
              },
            },
          },
        },
      },
    });

    return NextResponse.json(tournament);
  } catch (error) {
    return NextResponse.json(
      { message: 'Error fetching tournament data' },
      { status: 500 }
    );
  }
}