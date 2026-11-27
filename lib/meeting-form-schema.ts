import { z } from "zod";

function isValidDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

const hymnNumberSchema = z.string()
  .trim()
  .regex(/^\d+$/, "Enter a valid hymn number.")
  .transform(Number)
  .pipe(z.number().int().positive("Hymn number must be positive."));

const speakersSchema = z.string().superRefine((value, context) => {
  const lines = value.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);

  lines.forEach((line, index) => {
    const [type, name, ...topicParts] = line.split("|").map((part) => part.trim());
    const topic = topicParts.join("|").trim();

    if (
      (type !== "speaker" && type !== "musical-number")
      || !name
      || (type === "speaker" && !topic)
    ) {
      context.addIssue({
        code: "custom",
        message: `Line ${index + 1}: use "speaker | Name | Topic" or "musical-number | Name".`,
      });
    }
  });
}).transform((value) => value.split(/\r?\n/)
  .map((line) => line.trim())
  .filter(Boolean)
  .map((line) => {
    const [type, name = "", ...topicParts] = line.split("|").map((part) => part.trim());
    const topic = topicParts.join("|").trim();

    return type === "speaker"
      ? { type: "speaker" as const, name, topic }
      : { type: "musical-number" as const, name, topic };
  }));

export const MeetingFormSchema = z.object({
  date: z.string().refine(isValidDate, "Enter a valid meeting date."),
  meetingType: z.enum(["testimony", "regular", "stake", "general"], {
    error: "Select a meeting type.",
  }),
  presiding: z.string().trim().min(1, "Enter who is presiding."),
  conducting: z.string().trim().min(1, "Enter who is conducting."),
  announcements: z.string().transform((value) => value.split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)),
  openingHymnNumber: hymnNumberSchema,
  openingHymnTitle: z.string().trim().min(1, "Enter the opening hymn title."),
  openingPrayer: z.string().trim().min(1, "Enter who is offering the opening prayer."),
  wardBusiness: z.string().transform((value) => value.split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((description) => ({ description }))),
  stakeBusiness: z.boolean(),
  sacramentHymnNumber: hymnNumberSchema,
  sacramentHymnTitle: z.string().trim().min(1, "Enter the sacrament hymn title."),
  speakers: speakersSchema,
  closingHymnNumber: hymnNumberSchema,
  closingHymnTitle: z.string().trim().min(1, "Enter the closing hymn title."),
  closingPrayer: z.string().trim().min(1, "Enter who is offering the closing prayer."),
});

export type MeetingFormValues = z.infer<typeof MeetingFormSchema>;
export type MeetingFormErrors = Partial<Record<keyof MeetingFormValues, string[]>>;

export interface MeetingFormState {
  message: string;
  errors?: MeetingFormErrors;
}
