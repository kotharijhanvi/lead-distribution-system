import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {

  try {

    const body = await req.json();

    const existing =
      await prisma.webhookEvent.findUnique({
        where: {
          eventId: body.eventId,
        },
      });

    // idempotency check
    if (existing) {

      return NextResponse.json({
        success: true,
        message:
          "Webhook already processed",
      });
    }

    // reset quotas
    await prisma.provider.updateMany({
      data: {
        usedQuota: 0,
      },
    });

    // store webhook event
    await prisma.webhookEvent.create({
      data: {
        eventId: body.eventId,
      },
    });

    return NextResponse.json({
      success: true,
      message:
        "Quotas reset successfully",
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Webhook failed",
      },
      {
        status: 500,
      }
    );
  }
}