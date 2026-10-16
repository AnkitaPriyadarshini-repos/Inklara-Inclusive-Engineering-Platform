import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { UpdateFindingStatusSchema } from "@/lib/validation/schemas";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const finding = await db.finding.findUnique({
      where: { id },
      include: {
        auditRun: {
          select: { id: true, name: true, targetUrl: true, projectId: true },
        },
        scannedPage: true,
      },
    });

    if (!finding) {
      return NextResponse.json(
        { error: "Finding not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ finding });
  } catch (error: unknown) {
    console.error("GET /api/findings/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch finding" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validated = UpdateFindingStatusSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const { status, naReason, remediationNotes, remediationCode } = validated.data;

    const dataToUpdate: Record<string, unknown> = {
      status,
      naReason: status === "NOT_APPLICABLE" ? naReason : null,
      remediationNotes: remediationNotes || null,
      remediationCode: remediationCode || null,
    };

    if (status === "FIXED_PENDING_VERIFICATION" || status === "VERIFIED_FIXED") {
      dataToUpdate.remediatedAt = new Date();
    }
    if (status === "VERIFIED_FIXED") {
      dataToUpdate.verifiedAt = new Date();
    }

    const updated = await db.finding.update({
      where: { id },
      data: dataToUpdate,
    });

    return NextResponse.json({ finding: updated });
  } catch (error: unknown) {
    console.error("PATCH /api/findings/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update finding status" },
      { status: 500 }
    );
  }
}
