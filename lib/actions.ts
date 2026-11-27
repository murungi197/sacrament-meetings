"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import type { ZodError } from "zod";

import { auth, signIn, signOut } from "@/auth";
import {
  addMeeting,
  deleteMeeting as removeMeeting,
  updateMeeting as saveMeeting,
} from "@/lib/meetings-db";
import {
  MeetingFormSchema,
  type MeetingFormErrors,
  type MeetingFormState,
  type MeetingFormValues,
} from "@/lib/meeting-form-schema";
import type { SacramentMeeting } from "@/lib/types";

async function requireAuthentication(): Promise<void> {
  const session = await auth();
  if (!session?.user) redirect("/login");
}

export async function login(
  _prevState: { error?: string },
  formData: FormData,
): Promise<{ error?: string }> {
  const email = formData.get("email");
  const password = formData.get("password");
  if (typeof email !== "string" || typeof password !== "string" || !email || !password) {
    return { error: "Enter a valid email address and password." };
  }

  const callbackUrl = formData.get("callbackUrl");
  let redirectTo = "/meetings/new";
  if (typeof callbackUrl === "string" && callbackUrl.startsWith("/") && !callbackUrl.startsWith("//")) {
    const destination = new URL(callbackUrl, "http://localhost");
    if (destination.origin === "http://localhost") {
      redirectTo = `${destination.pathname}${destination.search}${destination.hash}`;
    }
  }

  try {
    await signIn("credentials", { email, password, redirectTo });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "The email or password is incorrect." };
    }
    throw error;
  }

  return {};
}

export async function logout(): Promise<void> {
  await signOut({ redirectTo: "/" });
}

function readFormValues(formData: FormData) {
  return {
    date: formData.get("date"),
    meetingType: formData.get("meetingType"),
    presiding: formData.get("presiding"),
    conducting: formData.get("conducting"),
    announcements: formData.get("announcements"),
    openingHymnNumber: formData.get("openingHymnNumber"),
    openingHymnTitle: formData.get("openingHymnTitle"),
    openingPrayer: formData.get("openingPrayer"),
    wardBusiness: formData.get("wardBusiness"),
    stakeBusiness: formData.get("stakeBusiness") === "true",
    sacramentHymnNumber: formData.get("sacramentHymnNumber"),
    sacramentHymnTitle: formData.get("sacramentHymnTitle"),
    speakers: formData.get("speakers"),
    closingHymnNumber: formData.get("closingHymnNumber"),
    closingHymnTitle: formData.get("closingHymnTitle"),
    closingPrayer: formData.get("closingPrayer"),
  };
}

function toMeeting(values: MeetingFormValues): Omit<SacramentMeeting, "id"> {
  return {
    date: values.date,
    meetingType: values.meetingType,
    presiding: values.presiding,
    conducting: values.conducting,
    announcements: values.announcements,
    openingHymn: {
      number: values.openingHymnNumber,
      title: values.openingHymnTitle,
    },
    openingPrayer: values.openingPrayer,
    wardBusiness: values.wardBusiness,
    stakeBusiness: values.stakeBusiness,
    sacramentHymn: {
      number: values.sacramentHymnNumber,
      title: values.sacramentHymnTitle,
    },
    speakers: values.speakers,
    closingHymn: {
      number: values.closingHymnNumber,
      title: values.closingHymnTitle,
    },
    closingPrayer: values.closingPrayer,
  };
}

function validationState(error: ZodError): MeetingFormState {
  return {
    message: "Please correct the highlighted fields.",
    errors: error.flatten().fieldErrors as MeetingFormErrors,
  };
}

export async function createMeeting(
  _prevState: MeetingFormState,
  formData: FormData,
): Promise<MeetingFormState> {
  await requireAuthentication();
  const parsed = MeetingFormSchema.safeParse(readFormValues(formData));
  if (!parsed.success) return validationState(parsed.error);

  try {
    await addMeeting(toMeeting(parsed.data));
  } catch (error) {
    console.error("Failed to create meeting:", error);
    throw new Error("Unable to create the meeting. Please try again.");
  }

  revalidatePath("/meetings");
  redirect("/meetings");
}

export async function updateMeeting(
  meetingId: string,
  _prevState: MeetingFormState,
  formData: FormData,
): Promise<MeetingFormState> {
  await requireAuthentication();
  const parsed = MeetingFormSchema.safeParse(readFormValues(formData));
  if (!parsed.success) return validationState(parsed.error);

  const id = Number(meetingId);
  if (!Number.isSafeInteger(id) || id < 1) {
    return { message: "This meeting ID is invalid." };
  }

  try {
    const meeting = await saveMeeting(id, toMeeting(parsed.data));
    if (!meeting) return { message: "This meeting could not be found." };
  } catch (error) {
    console.error("Failed to update meeting:", error);
    throw new Error("Unable to update the meeting. Please try again.");
  }

  revalidatePath("/meetings");
  revalidatePath(`/meetings/${id}`);
  redirect("/meetings");
}

export async function deleteMeeting(formData: FormData): Promise<void> {
  await requireAuthentication();
  const id = Number(formData.get("id"));
  if (!Number.isSafeInteger(id) || id < 1) {
    throw new Error("Unable to delete the meeting because its ID is invalid.");
  }

  try {
    await removeMeeting(id);
  } catch (error) {
    console.error("Failed to delete meeting:", error);
    throw new Error("Unable to delete the meeting. Please try again.");
  }

  revalidatePath("/meetings");
  redirect("/meetings");
}
