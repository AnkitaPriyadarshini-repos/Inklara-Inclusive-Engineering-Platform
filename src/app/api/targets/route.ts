import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { CreateTargetSchema } from "@/lib/validation/schemas";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = CreateTargetSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const target = await db.target.create({
      data: {
        projectId: validated.data.projectId,
        name: validated.data.name,
        url: validated.data.url,
        environment: validated.data.environment,
      },
    });

    return NextResponse.json({ target }, { status: 201 });
  } catch (error: unknown) {
    console.error("POST /api/targets error:", error);
    return NextResponse.json(
      { error: "Failed to create target" },
      { status: 500 }
    );
  }
}
