import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../lib/prisma";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import isoWeek from "dayjs/plugin/isoWeek";

dayjs.extend(utc); // Ensure consistent time zone handling
dayjs.extend(isoWeek); // Use ISO week (Monday as the first day)

export async function POST(req: NextRequest) {
  try {
    const { name, startDate, weeks } = await req.json();

    if (!name || !startDate || !weeks) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Ensure start date is treated as UTC and move it to the Monday of that week
    const firstWeekStart = dayjs.utc(startDate).startOf("isoWeek"); // Monday Start (ISO Week)

    // Calculate the last week's start date
    const lastWeekStart = firstWeekStart.add(weeks - 1, "week");

    // Get the last Sunday of the last week
    const endDate = lastWeekStart.endOf("isoWeek").toDate(); // Sunday End (ISO Week)

    // Save to the database
    const tournament = await prisma.tournament.create({
      data: {
        name,
        startDate: firstWeekStart.toDate(), // Ensures start date is always Monday
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
