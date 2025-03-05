// src/app/api/divisions/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const divisions = await req.json();

    if (!Array.isArray(divisions)) {
      return NextResponse.json(
        { message: "Invalid request format - expected array of divisions" },
        { status: 400 }
      );
    }

    if (divisions.length === 0) {
      return NextResponse.json(
        { message: "No divisions provided" },
        { status: 400 }
      );
    }

    // Validate all divisions before insertion
    const invalidDivisions = divisions.filter(
      (division) =>
        !division.name || !division.numTeams || !division.tournamentId
    );

    if (invalidDivisions.length > 0) {
      return NextResponse.json(
        {
          message: "Some divisions have missing fields",
          invalidCount: invalidDivisions.length,
        },
        { status: 400 }
      );
    }

    // Create divisions and return full objects with IDs
    const createdDivisions = await prisma.$transaction(
      divisions.map((division) =>
        prisma.division.create({
          data: {
            name: division.name,
            numTeams: division.numTeams,
            tournamentId: division.tournamentId,
          },
        })
      )
    );

    return NextResponse.json(
      {
        success: true,
        count: createdDivisions.length,
        divisions: createdDivisions,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating divisions:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
