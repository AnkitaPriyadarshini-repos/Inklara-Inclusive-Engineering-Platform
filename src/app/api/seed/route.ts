import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST() {
  try {
    // Check if demo project already exists
    const existing = await db.project.findFirst({
      where: {
        name: {
          in: ["Enterprise Design System Benchmark", "Apple Web Experience Benchmark"],
        },
      },
    });

    if (existing) {
      return NextResponse.json({
        message: "Seed data already initialized",
        project: existing,
      });
    }

    const project = await db.project.create({
      data: {
        name: "Enterprise Design System Benchmark",
        description:
          "Benchmark audit suite evaluating core e-commerce, portal, and checkout user journeys against WCAG 2.2 AA standards.",
        repositoryUrl: "https://github.com/enterprise/design-system-benchmarks",
        targets: {
          create: [
            {
              name: "Local Inaccessible Target Fixture",
              url: "http://localhost:3000/demo/inaccessible",
              environment: "development",
            },
            {
              name: "Local Remediated Accessible Fixture",
              url: "http://localhost:3000/demo/accessible",
              environment: "staging",
            },
          ],
        },
      },
      include: { targets: true },
    });

    return NextResponse.json({ message: "Seeded successfully", project });
  } catch (error: unknown) {
    console.error("POST /api/seed error:", error);
    return NextResponse.json(
      { error: "Failed to seed demo data" },
      { status: 500 }
    );
  }
}
