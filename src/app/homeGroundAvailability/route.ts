// pages/api/homeGroundAvailability.ts
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { teamId, week } = req.body;

    const availability = await prisma.homeGroundAvailability.create({
      data: {
        teamId,
        week,
      },
    });

    res.status(201).json(availability);
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
