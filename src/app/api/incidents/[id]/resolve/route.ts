import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { parse } from "path";

const prisma = new PrismaClient();

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);

  const incident = await prisma.incident.findUnique({
    where: { id },
  });

  if (!incident) {
    return NextResponse.json({ error: "Incident not found" }, { status: 404 });
  }

  const updatedIncident = await prisma.incident.update({
    where: { id },
    data: { resolved: !incident?.resolved },
    include: {
    camera: {
      select: {
        name: true,
        location: true,
      },
    },
  },
  });

  return NextResponse.json(updatedIncident);
}
