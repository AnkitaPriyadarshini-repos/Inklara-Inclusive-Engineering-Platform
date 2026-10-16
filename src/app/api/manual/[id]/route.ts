import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { UpdateManualItemSchema } from "@/lib/validation/schemas";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validated = UpdateManualItemSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const { status, naReason, notes, evidence } = validated.data;

    const updated = await db.manualChecklistItem.update({
      where: { id },
      data: {
        status,
        naReason: status === "NOT_APPLICABLE" ? naReason : null,
        notes: notes || null,
        evidence: evidence || null,
        evaluatedAt: status !== "NOT_TESTED" ? new Date() : null,
      },
    });

    return NextResponse.json({ item: updated });
  } catch (error: unknown) {
    console.error("PATCH /api/manual/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update manual checklist item" },
      { status: 500 }
    );
  }
}
