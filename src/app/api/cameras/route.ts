import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const camerasWithUnresolvedIncidents = await prisma.camera.findMany({
      include: {
        incidents: {
          where: {
            resolved: false,
          },
          select: {
            id: true,
            tsStart: true,
            tsEnd: true,
            type: true,
          },
        },
      },
    });

    const filteredCameras = camerasWithUnresolvedIncidents
      .filter((camera) => camera.incidents.length > 0)
      .map((camera) => ({
        cameraId: camera.id,
        cameraName: camera.name,
        location: camera.location,
        incidents: camera.incidents,
      }));

    return NextResponse.json(filteredCameras);
  } catch (error) {
    console.error("Failed to fetch unresolved incidents:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}
