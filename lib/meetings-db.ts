import { neon } from "@neondatabase/serverless";

import type {
  Hymn,
  MeetingType,
  SacramentMeeting,
  SpeakerItem,
  WardBusinessItem,
} from "@/lib/types";
import { getMostRecentSundayDate } from "@/lib/dates";

const sql = neon(process.env.DATABASE_URL!);
const ITEMS_PER_PAGE = 5;

function isMeetingType(value: unknown): value is MeetingType {
  return value === "testimony" || value === "regular" || value === "stake" || value === "general";
}

function isHymn(value: unknown): value is Hymn {
  return typeof value === "object"
    && value !== null
    && "number" in value
    && typeof value.number === "number"
    && "title" in value
    && typeof value.title === "string";
}

function isSpeakerItem(value: unknown): value is SpeakerItem {
  return typeof value === "object"
    && value !== null
    && "name" in value
    && typeof value.name === "string"
    && "topic" in value
    && typeof value.topic === "string"
    && "type" in value
    && (value.type === "speaker" || value.type === "musical-number");
}

function isWardBusinessItem(value: unknown): value is WardBusinessItem {
  return typeof value === "object"
    && value !== null
    && "description" in value
    && typeof value.description === "string";
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function readText(value: unknown, field: string): string {
  if (!isString(value)) {
    throw new Error(`Meeting ${field} returned from the database is invalid.`);
  }

  return value;
}

function mapMeetingRows(rows: Record<string, unknown>[]): SacramentMeeting[] {
  return rows.map((row) => {
    const id = Number(row.id);

    if (!Number.isSafeInteger(id)) {
      throw new Error("Meeting ID returned from the database is not a safe integer.");
    }

    if (typeof row.date !== "string") {
      throw new Error("Meeting date returned from the database is invalid.");
    }

    if (!isMeetingType(row.meetingType)) {
      throw new Error("Meeting type returned from the database is invalid.");
    }

    if (!Array.isArray(row.announcements) || !row.announcements.every(isString)) {
      throw new Error("Meeting announcements returned from the database are invalid.");
    }

    if (!isHymn(row.openingHymn) || !isHymn(row.sacramentHymn) || !isHymn(row.closingHymn)) {
      throw new Error("Meeting hymn data returned from the database is invalid.");
    }

    if (!Array.isArray(row.wardBusiness) || !row.wardBusiness.every(isWardBusinessItem)) {
      throw new Error("Meeting ward business returned from the database is invalid.");
    }

    if (!Array.isArray(row.speakers) || !row.speakers.every(isSpeakerItem)) {
      throw new Error("Meeting speakers returned from the database are invalid.");
    }

    if (typeof row.stakeBusiness !== "boolean") {
      throw new Error("Meeting stake business returned from the database is invalid.");
    }

    return {
      id,
      date: row.date,
      meetingType: row.meetingType,
      presiding: readText(row.presiding, "presiding"),
      conducting: readText(row.conducting, "conducting"),
      announcements: row.announcements,
      openingHymn: row.openingHymn,
      openingPrayer: readText(row.openingPrayer, "opening prayer"),
      wardBusiness: row.wardBusiness,
      stakeBusiness: row.stakeBusiness,
      sacramentHymn: row.sacramentHymn,
      speakers: row.speakers,
      closingHymn: row.closingHymn,
      closingPrayer: readText(row.closingPrayer, "closing prayer"),
    };
  });
}

function isDateQuery(query: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(query) || query.startsWith("0000")) return false;

  const date = new Date(`${query}T00:00:00.000Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === query;
}

export async function getMeetings(
  query: string | null = "",
  currentPage = 1,
): Promise<SacramentMeeting[]> {
  if (!Number.isSafeInteger(currentPage) || currentPage < 1) {
    throw new RangeError("Meeting page must be a positive integer.");
  }

  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  if (!Number.isSafeInteger(offset)) {
    throw new RangeError("Meeting page is too large.");
  }

  const searchQuery = query ?? "";
  const searchTerm = `%${searchQuery}%`;
  const rows = isDateQuery(searchQuery)
    ? await sql`
        SELECT
          id,
          to_char(date, 'YYYY-MM-DD') AS "date",
          meeting_type AS "meetingType",
          presiding, conducting, announcements,
          opening_hymn AS "openingHymn",
          opening_prayer AS "openingPrayer",
          ward_business AS "wardBusiness",
          stake_business AS "stakeBusiness",
          sacrament_hymn AS "sacramentHymn",
          speakers,
          closing_hymn AS "closingHymn",
          closing_prayer AS "closingPrayer"
        FROM meetings
        WHERE date = ${searchQuery}
        ORDER BY date DESC
        LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
      `
    : await sql`
        SELECT
          id,
          to_char(date, 'YYYY-MM-DD') AS "date",
          meeting_type AS "meetingType",
          presiding, conducting, announcements,
          opening_hymn AS "openingHymn",
          opening_prayer AS "openingPrayer",
          ward_business AS "wardBusiness",
          stake_business AS "stakeBusiness",
          sacrament_hymn AS "sacramentHymn",
          speakers,
          closing_hymn AS "closingHymn",
          closing_prayer AS "closingPrayer"
        FROM meetings
        WHERE
          presiding ILIKE ${searchTerm}
          OR conducting ILIKE ${searchTerm}
          OR meeting_type ILIKE ${searchTerm}
          OR speakers::text ILIKE ${searchTerm}
        ORDER BY date DESC
        LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
      `;

  return mapMeetingRows(rows);
}

export async function getMeetingsTotalPages(query = ""): Promise<number> {
  const rows = isDateQuery(query)
    ? await sql`
        SELECT COUNT(*) AS count
        FROM meetings
        WHERE date = ${query}
      `
    : await sql`
        SELECT COUNT(*) AS count
        FROM meetings
        WHERE
          presiding ILIKE ${`%${query}%`}
          OR conducting ILIKE ${`%${query}%`}
          OR meeting_type ILIKE ${`%${query}%`}
          OR speakers::text ILIKE ${`%${query}%`}
      `;

  return Math.ceil(Number(rows[0].count) / ITEMS_PER_PAGE);
}

export async function getMeetingById(id: number): Promise<SacramentMeeting | null> {
  const rows = await sql`
    SELECT
      id,
      to_char(date, 'YYYY-MM-DD') AS "date",
      meeting_type AS "meetingType",
      presiding, conducting, announcements,
      opening_hymn AS "openingHymn",
      opening_prayer AS "openingPrayer",
      ward_business AS "wardBusiness",
      stake_business AS "stakeBusiness",
      sacrament_hymn AS "sacramentHymn",
      speakers,
      closing_hymn AS "closingHymn",
      closing_prayer AS "closingPrayer"
    FROM meetings
    WHERE id = ${id}
    LIMIT 1
  `;

  return rows[0] ? mapMeetingRows([rows[0]])[0] : null;
}

export async function getMeetingByDate(date: string): Promise<SacramentMeeting | null> {
  const meetings = await getMeetings(date);
  return meetings[0] ?? null;
}

export async function getCurrentMeeting(): Promise<SacramentMeeting | null> {
  return getMeetingByDate(getMostRecentSundayDate());
}

export async function addMeeting(
  data: Omit<SacramentMeeting, "id">,
): Promise<SacramentMeeting> {
  void data;
  throw new Error("addMeeting: database implementation coming in Week 04");
}

export async function updateMeeting(
  id: number,
  updates: Partial<SacramentMeeting>,
): Promise<SacramentMeeting | null> {
  void id;
  void updates;
  throw new Error("updateMeeting: database implementation coming in Week 04");
}

export async function deleteMeeting(id: number): Promise<boolean> {
  void id;
  throw new Error("deleteMeeting: database implementation coming in Week 04");
}
