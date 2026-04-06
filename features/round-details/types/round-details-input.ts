import { z } from "zod";

const isNumeric = (val: string) => /^\d+$/.test(val);
const isAlphanumeric = (val: string) => /^[a-zA-Z0-9]+$/.test(val);
const hasNoInternalSpaces = (val: string) => !/\s/.test(val);

export const RoundDetailsInputFormSchema = z.object({
  game_id: z.string().trim().optional(),
  round_id: z.string().trim().optional(),
  user_id: z.string().trim().optional(),
})
.superRefine((data, ctx) => {
  const { game_id, round_id, user_id } = data;

  if (user_id && !game_id && !round_id) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "User ID cannot be searched alone. Provide a Game ID or Round ID.",
      path: ["game_id"]
    });
  }

  // 2. RULE: If game_id is provided, user_id IS mandatory
  if (game_id && !user_id) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "User ID is mandatory when Game ID is provided",
      path: ["user_id"]
    });
  }

  // 3. RoundId Specifics (Numeric + ends with 008)
  if (round_id) {
    if (!isNumeric(round_id)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "RoundId must be numeric", path: ["round_id"] });
    }
    if (!round_id.endsWith("008")) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "RoundId must end with 008", path: ["round_id"] });
    }
  }

  // 4. GameId Specifics (Numeric + Length 10-20)
  if (game_id) {
    if (!isNumeric(game_id)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "GameId must be numeric", path: ["game_id"] });
    }
    if (game_id.length < 10 || game_id.length > 20) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "GameId must be 10-20 characters", path: ["game_id"] });
    }
  }

  // 5. UserId / CasinoId (Fixed 16, Alphanumeric, No internal spaces)
  const validateFixedId = (val: string | undefined, fieldName: string) => {
    if (val) {
      if (val.length !== 16) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: `${fieldName} must be exactly 16 characters`, path: [fieldName] });
      }
      if (!isAlphanumeric(val)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: `${fieldName} must be alphanumeric`, path: [fieldName] });
      }
      if (!hasNoInternalSpaces(val)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: `${fieldName} cannot contain internal spaces`, path: [fieldName] });
      }
    }
  };

  validateFixedId(user_id, "user_id");
});

// Rule for a single Round ID
export const RoundIdSchema = z.string()
  .trim()
  .refine(isNumeric, "Must be numeric")
  .refine((val) => val.endsWith("008"), "Must end with 008");

// Schema for the multi-form
export const MultiRoundDetailsSchema = z.object({
  round_ids: z.array(RoundIdSchema).min(1, "At least one Round ID is required").max(10, "You can enter up to 10 Round IDs"),
});

export type MultiRoundDetailsProps = z.infer<typeof MultiRoundDetailsSchema>;

export type RoundDetailsInputProps = z.infer<typeof RoundDetailsInputFormSchema>;