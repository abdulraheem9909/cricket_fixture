// src/app/api/divisions/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

// POST method handler for creating divisions
export async function POST(req: NextRequest) {
  try {
    const divisions = await req.json(); // Parse the incoming request body
    console.log("divisions", divisions);

    // Validate if divisions array is not empty
    if (!Array.isArray(divisions) || divisions.length === 0) {
      return NextResponse.json(
        { message: "No divisions provided" },
        { status: 400 }
      );
    }

    // Validate the structure of each division object
    const invalidDivisions = divisions.filter(
      (division) => !division.name || !division.numTeams
    );

    if (invalidDivisions.length > 0) {
      return NextResponse.json(
        { message: "Some divisions have missing fields" },
        { status: 400 }
      );
    }

    // Bulk insert divisions using createMany
    const createdDivisions = await prisma.division.createMany({
      data: divisions, // Bulk data
    });

    return NextResponse.json(createdDivisions, { status: 201 });
  } catch (error) {
    console.error("Error creating divisions:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
