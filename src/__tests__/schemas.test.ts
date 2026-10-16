import { describe, it, expect } from "vitest";
import {
  CreateProjectSchema,
  CreateAuditRunSchema,
  UpdateFindingStatusSchema,
  UpdateManualItemSchema,
} from "@/lib/validation/schemas";

describe("Zod Validation Schemas Suite", () => {
  it("rejects project creation with empty name", () => {
    const res = CreateProjectSchema.safeParse({ name: "" });
    expect(res.success).toBe(false);
  });

  it("accepts valid project creation payload", () => {
    const res = CreateProjectSchema.safeParse({
      name: "Enterprise Commerce Platform",
      description: "E-commerce platform",
    });
    expect(res.success).toBe(true);
  });

  it("rejects audit run creation with malformed URL", () => {
    const res = CreateAuditRunSchema.safeParse({
      projectId: "proj-1",
      name: "Sprint Scan",
      targetUrl: "not-a-valid-url",
    });
    expect(res.success).toBe(false);
  });

  it("strictly requires naReason when finding is marked NOT_APPLICABLE", () => {
    const withoutReason = UpdateFindingStatusSchema.safeParse({
      status: "NOT_APPLICABLE",
      naReason: "",
    });
    expect(withoutReason.success).toBe(false);

    const withReason = UpdateFindingStatusSchema.safeParse({
      status: "NOT_APPLICABLE",
      naReason: "Component only renders on mobile native app.",
    });
    expect(withReason.success).toBe(true);
  });

  it("strictly requires justification when manual check is marked NOT_APPLICABLE", () => {
    const withoutReason = UpdateManualItemSchema.safeParse({
      status: "NOT_APPLICABLE",
      naReason: "abc",
    });
    expect(withoutReason.success).toBe(false);

    const withReason = UpdateManualItemSchema.safeParse({
      status: "NOT_APPLICABLE",
      naReason: "No audio or video media present in this user journey.",
    });
    expect(withReason.success).toBe(true);
  });
});
