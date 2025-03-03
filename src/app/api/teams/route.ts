// pages/api/teams.ts
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { name, homeGround, divisionId } = req.body;

    const team = await prisma.team.create({
      data: {
        name,
        homeGround,
        divisionId,
      },
    });

    res.status(201).json(team);
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
