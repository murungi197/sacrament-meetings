import type { SacramentMeeting } from "@/lib/types";
import { getMostRecentSundayDate, toDateKey } from "@/lib/dates";

function makeMeetings(): SacramentMeeting[] {
  const mostRecentSunday = new Date(`${getMostRecentSundayDate()}T12:00:00`);
  const dates = [-2, -1, 0, 1, 2].map((weekOffset) => {
    const date = new Date(mostRecentSunday);
    date.setDate(date.getDate() + weekOffset * 7);
    return toDateKey(date);
  });

  return [
    {
      id: 1,
      date: dates[0],
      meetingType: "regular",
      presiding: "Bishop Daniel Carter",
      conducting: "Brother Samuel Wright",
      announcements: ["Ward temple night is coming up. See the weekly bulletin for details."],
      openingHymn: { number: 2, title: "The Spirit of God" },
      openingPrayer: "Sister Naomi Brooks",
      wardBusiness: [{ description: "Sustainings and ward announcements" }],
      stakeBusiness: false,
      sacramentHymn: { number: 169, title: "As Now We Take the Sacrament" },
      speakers: [
        { name: "Sister Olivia Chen", topic: "A covenant of belonging", type: "speaker" },
        { name: "Brother Marcus Lee", topic: "Finding peace in Jesus Christ", type: "speaker" },
      ],
      closingHymn: { number: 301, title: "I Am a Child of God" },
      closingPrayer: "Brother David Kim",
    },
    {
      id: 2,
      date: dates[1],
      meetingType: "testimony",
      presiding: "Bishop Daniel Carter",
      conducting: "Sister Hannah Reed",
      announcements: ["Please join us for the ward service project this Saturday."],
      openingHymn: { number: 26, title: "Joseph Smith's First Prayer" },
      openingPrayer: "Brother Peter Morgan",
      wardBusiness: [],
      stakeBusiness: false,
      sacramentHymn: { number: 175, title: "O God, the Eternal Father" },
      speakers: [
        { name: "Ward members", topic: "Testimonies of Jesus Christ", type: "speaker" },
        { name: "Primary children", topic: "I Will Follow God's Plan", type: "musical-number" },
      ],
      closingHymn: { number: 19, title: "We Thank Thee, O God, for a Prophet" },
      closingPrayer: "Sister Grace Allen",
    },
    {
      id: 3,
      date: dates[2],
      meetingType: "regular",
      presiding: "Bishop Daniel Carter",
      conducting: "Brother Samuel Wright",
      announcements: ["Visitors and friends are always welcome."],
      openingHymn: { number: 134, title: "I Believe in Christ" },
      openingPrayer: "Sister Naomi Brooks",
      wardBusiness: [{ description: "Ward council and activity reminders" }],
      stakeBusiness: false,
      sacramentHymn: { number: 181, title: "Jesus of Nazareth, Savior and King" },
      speakers: [
        { name: "Sister Olivia Chen", topic: "A covenant of belonging", type: "speaker" },
        { name: "Brother Marcus Lee", topic: "Finding peace in Jesus Christ", type: "speaker" },
      ],
      closingHymn: { number: 301, title: "I Am a Child of God" },
      closingPrayer: "Brother David Kim",
    },
    {
      id: 4,
      date: dates[3],
      meetingType: "stake",
      presiding: "Stake President James Bennett",
      conducting: "Brother Samuel Wright",
      announcements: [],
      openingHymn: { number: 2, title: "The Spirit of God" },
      openingPrayer: "Brother Peter Morgan",
      wardBusiness: [],
      stakeBusiness: true,
      sacramentHymn: { number: 193, title: "I Stand All Amazed" },
      speakers: [
        { name: "Stake presidency", topic: "Discipleship in daily life", type: "speaker" },
        { name: "Cedar Grove Ward choir", topic: "Come, Follow Me", type: "musical-number" },
      ],
      closingHymn: { number: 134, title: "I Believe in Christ" },
      closingPrayer: "Sister Grace Allen",
    },
    {
      id: 5,
      date: dates[4],
      meetingType: "general",
      presiding: "Bishop Daniel Carter",
      conducting: "Sister Hannah Reed",
      announcements: ["The ward family history center is open after meetings."],
      openingHymn: { number: 220, title: "Lord, I Would Follow Thee" },
      openingPrayer: "Sister Naomi Brooks",
      wardBusiness: [{ description: "Ward conference and ministering updates" }],
      stakeBusiness: false,
      sacramentHymn: { number: 185, title: "Reverently and Meekly Now" },
      speakers: [
        { name: "Brother Samuel Wright", topic: "Serving one another", type: "speaker" },
        { name: "Sister Hannah Reed", topic: "Hope through covenants", type: "speaker" },
      ],
      closingHymn: { number: 220, title: "Lord, I Would Follow Thee" },
      closingPrayer: "Brother David Kim",
    },
  ];
}

export function getMeetings(date?: string | null): SacramentMeeting[] {
  const meetings = makeMeetings();
  return date ? meetings.filter((meeting) => meeting.date === date) : meetings;
}

export function getMeetingById(id: number): SacramentMeeting | null {
  return makeMeetings().find((meeting) => meeting.id === id) ?? null;
}

export function getMeetingByDate(date: string): SacramentMeeting | null {
  return makeMeetings().find((meeting) => meeting.date === date) ?? null;
}

export function getCurrentMeeting(): SacramentMeeting | null {
  return getMeetingByDate(getMostRecentSundayDate());
}
