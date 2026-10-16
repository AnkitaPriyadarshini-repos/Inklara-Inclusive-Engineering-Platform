import { z } from "zod";

export const CreateProjectSchema = z.object({
  name: z.string().trim().min(1, "Project name is required").max(100),
  description: z.string().trim().max(500).optional(),
  repositoryUrl: z.string().trim().url("Invalid repository URL").optional().or(z.literal("")),
});

export const UpdateProjectSchema = CreateProjectSchema.partial().extend({
  isArchived: z.boolean().optional(),
});

export const CreateTargetSchema = z.object({
  projectId: z.string().min(1, "Project ID is required"),
  name: z.string().trim().min(1, "Target name is required").max(100),
  url: z.string().trim().url("Valid HTTP or HTTPS URL required"),
  environment: z
    .enum(["development", "staging", "production", "test"])
    .default("development"),
});

export const CreateAuditRunSchema = z.object({
  projectId: z.string().min(1, "Project ID is required"),
  targetId: z.string().optional(),
  name: z.string().trim().min(1, "Audit name is required").max(100),
  targetUrl: z.string().trim().url("Valid URL is required"),
  scopeType: z
    .enum(["single-page", "multi-page", "wcag-em-sample"])
    .default("single-page"),
  wcagLevel: z.enum(["WCAG_2_0_AA", "WCAG_2_1_AA", "WCAG_2_2_AA"]).default("WCAG_2_2_AA"),
  isBaseline: z.boolean().default(false),
  evaluationScope: z.string().max(1000).optional(),
});

export const UpdateFindingStatusSchema = z
  .object({
    status: z.enum([
      "OPEN",
      "IN_PROGRESS",
      "FIXED_PENDING_VERIFICATION",
      "VERIFIED_FIXED",
      "NEEDS_FURTHER_REVIEW",
      "NOT_APPLICABLE",
    ]),
    naReason: z.string().trim().optional(),
    remediationNotes: z.string().trim().optional(),
    remediationCode: z.string().trim().optional(),
  })
  .refine(
    (data) => {
      if (data.status === "NOT_APPLICABLE" && (!data.naReason || data.naReason.length < 5)) {
        return false;
      }
      return true;
    },
    {
      message: "A meaningful reason (minimum 5 characters) is required when marking a finding as Not Applicable.",
      path: ["naReason"],
    }
  );

export const UpdateManualItemSchema = z
  .object({
    status: z.enum(["NOT_TESTED", "PASS", "FAIL", "NOT_APPLICABLE"]),
    naReason: z.string().trim().optional(),
    notes: z.string().trim().optional(),
    evidence: z.string().trim().optional(),
  })
  .refine(
    (data) => {
      if (data.status === "NOT_APPLICABLE" && (!data.naReason || data.naReason.length < 5)) {
        return false;
      }
      return true;
    },
    {
      message: "A justification (minimum 5 characters) is required when marking a manual check as Not Applicable.",
      path: ["naReason"],
    }
  );

export const CompareAuditSchema = z.object({
  auditRunId: z.string().min(1),
  baselineRunId: z.string().min(1),
});
