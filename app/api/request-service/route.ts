import { NextResponse } from "next/server";
import { createLeadAndAssign } from "@/lib/allocation";

export async function POST(req: Request) {

  try {

    const body = await req.json();

    const lead = await createLeadAndAssign({
      name: body.name,
      phone: body.phone,
      city: body.city,
      description: body.description,
      serviceId: Number(body.serviceId),
    });

    return NextResponse.json({
      success: true,
      lead,
    });

  } catch (error: any) {

    console.error(error);

    // Duplicate lead error
    if (error.code === "P2002") {

      return NextResponse.json(
        {
          success: false,
          message:
            "This phone number already submitted this service request.",
        },
        {
          status: 409,
        }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Something went wrong",
      },
      {
        status: 500,
      }
    );
  }
}