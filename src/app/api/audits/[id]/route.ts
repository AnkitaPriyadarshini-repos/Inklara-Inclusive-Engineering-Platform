import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const auditRun = await db.auditRun.findUnique({
      where: { id },
      include: {
        project: {
          select: { id: true, name: true, repositoryUrl: true },
        },
        target: true,
        scannedPages: true,
        findings: {
          orderBy: [
            { impact: "asc" }, // In UI, we can sort or group
            { createdAt: "asc" },
          ],
        },
        manualChecklist: {
          orderBy: { category: "asc" },
        },
        comparisonsAsNew: {
          include: {
            baselineRun: {
              select: { id: true, name: true, completedAt: true },
            },
          },
        },
      },
    });

    if (!auditRun) {
      return NextResponse.json(
        { error: "Audit run not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ auditRun });
  } catch (error: unknown) {
    console.error("GET /api/audits/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch audit run" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await db.auditRun.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("DELETE /api/audits/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete audit run" },
      { status: 500 }
    );
  }
}
