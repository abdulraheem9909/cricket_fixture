// app/api/teams/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { teams } = await request.json();

    // Validate request body
    if (!Array.isArray(teams) || teams.length === 0) {
      return NextResponse.json(
        { success: false, message: "Expected array of teams" },
        { status: 400 }
      );
    }

    // Validate individual team data
    const invalidTeams = teams.filter(
      (team) =>
        !team.name?.trim() || !team.homeGround?.trim() || !team.divisionId
    );

    if (invalidTeams.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: `Invalid data for ${invalidTeams.length} team(s)`,
          invalidCount: invalidTeams.length,
        },
        { status: 400 }
      );
    }

    // Create teams in bulk
    const createdTeams = await prisma.$transaction(
      teams.map((team) =>
        prisma.team.create({
          data: {
            name: team.name,
            homeGround: team.homeGround,
            divisionId: team.divisionId,
          },
        })
      )
    );

    return NextResponse.json(
      { success: true, count: createdTeams.length, teams: createdTeams },
      { status: 201 }
    );
  } catch (error:any) {
    console.error("Error creating teams:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
        error: error.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { success: false, message: "Method Not Allowed" },
    { status: 405 }
  );
}
