import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const tournament = await prisma.tournament.findUnique({
      where: { id: Number(params?.id) },
      include: {
        divisions: {
          include: {
            teams: {
              include: {
                homeGroundAvailabilities: true, // Fetch home ground availability
                offRequests: true, // Fetch off requests
              },
            },
          },
        },
      },
    });

    if (!tournament) {
      return NextResponse.json(
        { message: 'Tournament not found' },
        { status: 404 }
      );
    }

    // Extract availability and offRequests from the tournament data
    const availability = tournament.divisions.flatMap((division) =>
      division.teams.flatMap((team) =>
        team.homeGroundAvailabilities.map((availability) => ({
          ...availability,
          teamId: team.id,
        }))
      )
    );

    const offRequests = tournament.divisions.flatMap((division) =>
      division.teams.flatMap((team) =>
        team.offRequests.map((offRequest) => ({
          ...offRequest,
          teamId: team.id,
        }))
      )
    );

    // Return tournament, availability, and offRequests as separate objects
    return NextResponse.json({
      tournament,
      availability,
      offRequests,
    });
  } catch (error) {
    console.error('Error fetching tournament data:', error);
    return NextResponse.json(
      { message: 'Error fetching tournament data' },
      { status: 500 }
    );
  }
}