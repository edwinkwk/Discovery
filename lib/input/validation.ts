import { z } from "zod";

export const birthInputSchema = z.object({
  year: z.number().int().min(1, "Year must be a valid Gregorian year").max(2100),
  month: z.number().int().min(1).max(12),
  day: z.number().int().min(1).max(31),
  hour: z.number().int().min(0).max(23),
  minute: z.number().int().min(0).max(59),
  gender: z.enum(["male", "female"]),
  place: z.string().min(1, "Birth place is required"),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  fullName: z.string().trim().min(1).optional(),
});

export type BirthInputParsed = z.infer<typeof birthInputSchema>;

export function parseBirthInput(input: unknown): BirthInputParsed {
  const parsed = birthInputSchema.parse(input);
  const daysInMonth = new Date(parsed.year, parsed.month, 0).getDate();
  if (parsed.day > daysInMonth) {
    throw new Error(`${parsed.year}-${parsed.month} does not have ${parsed.day} days`);
  }
  return parsed;
}
