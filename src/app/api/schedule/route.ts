import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const {
    availability,
    offRequests,
    id: tournamentId,
    tournamentOffWeek,
    isCompleted = true,
  } = await request.json();
  console.log("tournamentId", tournamentId);

  if (
    !Array.isArray(availability) ||
    !Array.isArray(offRequests) ||
    !tournamentId ||
    tournamentOffWeek === undefined
  ) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    // **Step 1:** Fetch all teams in the tournament
    const teamsInTournament = await prisma.team.findMany({
      where: {
        division: {
          tournamentId: tournamentId, // Find teams under this tournament
        },
      },
      select: { id: true },
    });

    const teamIdsInTournament = teamsInTournament.map((team) => team.id);

    // **Step 2:** Delete old availability records (✅ Already Working)
    await prisma.homeGroundAvailability.deleteMany({
      where: {
        teamId: { in: teamIdsInTournament },
        NOT: {
          OR: availability.map((av) => ({
            teamId: av.teamId,
            weekNumber: av.weekNumber,
          })),
        },
      },
    });

    // **Step 3:** Delete old offRequests properly (✅ Fixed)
    await prisma.offRequest.deleteMany({
      where: {
        teamId: { in: teamIdsInTournament },
        NOT: {
          OR: offRequests.length > 0 ? offRequests.map((or) => ({
            teamId: or.teamId,
            weekNumber: or.weekNumber,
          })) : [],  // Prevents `NOT: { OR: [] }` which is an invalid query
        },
      },
    });

    // **Step 4:** Perform bulk upserts inside a transaction
    const results = await prisma.$transaction([
      prisma.tournament.update({
        where: { id: tournamentId },
        data: {
          tournamentOffWeek: tournamentOffWeek,
          isCompleted: isCompleted,
        },
      }),

      ...availability.map((av) =>
        prisma.homeGroundAvailability.upsert({
          where: {
            teamId_weekNumber: {
              teamId: av.teamId,
              weekNumber: av.weekNumber,
            },
          },
          update: {
            startDate: new Date(av.startDate),
            endDate: new Date(av.endDate),
          },
          create: {
            teamId: av.teamId,
            weekNumber: av.weekNumber,
            startDate: new Date(av.startDate),
            endDate: new Date(av.endDate),
          },
        })
      ),

      ...offRequests.map((or) =>
        prisma.offRequest.upsert({
          where: {
            teamId_weekNumber: {
              teamId: or.teamId,
              weekNumber: or.weekNumber,
            },
          },
          update: {
            startDate: new Date(or.startDate),
            endDate: new Date(or.endDate),
          },
          create: {
            teamId: or.teamId,
            weekNumber: or.weekNumber,
            startDate: new Date(or.startDate),
            endDate: new Date(or.endDate),
          },
        })
      ),
    ]);

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error("Error performing bulk upsert:", error);
    return NextResponse.json(
      { error: "Failed to perform bulk upsert" },
      { status: 500 }
    );
  }
}
