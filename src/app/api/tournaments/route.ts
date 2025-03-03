// src/app/api/tournaments/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { name, startDate, weeks } = await req.json();

    if (!name || !startDate || !weeks) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + weeks * 7);

    const tournament = await prisma.tournament.create({
      data: {
        name,
        startDate: new Date(startDate),
        endDate,
        weeks: +weeks,
      },
    });

    return NextResponse.json(tournament, { status: 201 });
  } catch (error) {
    console.error("Error creating tournament:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
