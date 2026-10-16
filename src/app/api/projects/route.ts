import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { CreateProjectSchema } from "@/lib/validation/schemas";

export async function GET() {
  try {
    const projects = await db.project.findMany({
      orderBy: { updatedAt: "desc" },
      include: {
        targets: {
          select: { id: true, name: true, url: true, environment: true },
        },
        auditRuns: {
          orderBy: { startedAt: "desc" },
          take: 5,
          select: {
            id: true,
            name: true,
            status: true,
            violationsCount: true,
            criticalCount: true,
            seriousCount: true,
            startedAt: true,
            completedAt: true,
            isBaseline: true,
          },
        },
      },
    });

    return NextResponse.json({ projects });
  } catch (error: unknown) {
    console.error("GET /api/projects error:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = CreateProjectSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const project = await db.project.create({
      data: {
        name: validated.data.name,
        description: validated.data.description,
        repositoryUrl: validated.data.repositoryUrl || null,
      },
    });

    return NextResponse.json({ project }, { status: 201 });
  } catch (error: unknown) {
    console.error("POST /api/projects error:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}
