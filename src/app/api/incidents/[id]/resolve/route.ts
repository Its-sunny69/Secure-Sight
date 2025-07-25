import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function PATCH(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const incidentId = parseInt(id);

  const incident = await prisma.incident.findUnique({
    where: { id: incidentId },
  });

  if (!incident) {
    return NextResponse.json({ error: "Incident not found" }, { status: 404 });
  }

  const updatedIncident = await prisma.incident.update({
    where: { id: incidentId },
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