import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const resolved = searchParams.get("resolved");

  const incidents = await prisma.incident.findMany({
    where: resolved !== null ? { resolved: resolved === "true" } : {},
    orderBy: { tsStart: "desc" },
    include: {
      camera: {
        select: {
          name: true,
          location: true,
        },
      },
    },
  });

  return NextResponse.json(incidents);
}
