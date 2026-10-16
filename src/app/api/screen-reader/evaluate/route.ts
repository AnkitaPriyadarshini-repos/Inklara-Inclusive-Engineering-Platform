import { NextResponse } from "next/server";
import { z } from "zod";
import { evaluateScreenReaderScenario } from "@/lib/screenreader/evaluator";

const EvaluateScenarioSchema = z.object({
  targetUrl: z.string().trim().url("Valid HTTP or HTTPS URL required"),
  scenarioId: z.string().min(1, "Scenario ID is required"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = EvaluateScenarioSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const { targetUrl, scenarioId } = validated.data;

    const result = await evaluateScreenReaderScenario(targetUrl, scenarioId, {
      allowLocalScanning: process.env.ALLOW_LOCAL_SCANNING === "true",
    });

    return NextResponse.json({ result });
  } catch (error: unknown) {
    console.error("POST /api/screen-reader/evaluate error:", error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: "Scenario evaluation failed", message },
      { status: 500 }
    );
  }
}
