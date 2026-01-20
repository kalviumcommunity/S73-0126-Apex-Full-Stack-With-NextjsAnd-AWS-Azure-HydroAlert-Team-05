import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { haversineDistance } from "@/lib/geo";
import { getCurrentUser } from "@/lib/getCurrentUser";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { latitude, longitude } = await req.json();

    if (typeof latitude !== "number" || typeof longitude !== "number") {
      return NextResponse.json(
        { error: "Latitude and longitude required" },
        { status: 400 }
      );
    }

    const districts = await prisma.district.findMany();

    let nearest = districts[0];
    let minDistance = Infinity;

    for (const d of districts) {
      const dist = haversineDistance(
        latitude,
        longitude,
        d.latitude,
        d.longitude
      );

      if (dist < minDistance) {
        minDistance = dist;
        nearest = d;
      }
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        lastLatitude: latitude,
        lastLongitude: longitude,
        lastDistrictId: nearest.id,
      },
    });

    return NextResponse.json({
      success: true,
      district: nearest.name,
      distanceKm: Number(minDistance.toFixed(2)),
    });
  } catch (err) {
    console.error("LOCATION UPDATE ERROR:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
