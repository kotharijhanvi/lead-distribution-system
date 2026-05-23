import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {

  try {

    const providers =
      await prisma.provider.findMany({

        include: {
          assignments: {

            include: {
              lead: true,
            },

            orderBy: {
              assignedAt: "desc",
            },
          },
        },

        orderBy: {
          id: "asc",
        },
      });

    const formatted = providers.map(
      (provider) => ({

        id: provider.id,

        name: provider.name,

        usedQuota: provider.usedQuota,

        monthlyQuota:
          provider.monthlyQuota,

        remainingQuota:
          provider.monthlyQuota -
          provider.usedQuota,

        leads:
          provider.assignments,
      })
    );

    return NextResponse.json({
      success: true,
      providers: formatted,
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to fetch dashboard data",
      },
      {
        status: 500,
      }
    );
  }
}