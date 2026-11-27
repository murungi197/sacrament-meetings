"use client";

import { useActionState } from "react";

import type {
  MeetingFormErrors,
  MeetingFormState,
} from "@/lib/meeting-form-schema";
import type { SacramentMeeting } from "@/lib/types";

const initialState: MeetingFormState = { message: "", errors: {} };

type MeetingFormAction = (
  prevState: MeetingFormState,
  formData: FormData,
) => Promise<MeetingFormState>;

interface MeetingFormProps {
  action: MeetingFormAction;
  meeting?: SacramentMeeting;
  submitLabel: string;
}

type FieldName = keyof MeetingFormErrors;

function fieldError(errors: MeetingFormErrors | undefined, field: FieldName): string {
  return errors?.[field]?.join(" ") ?? "";
}

function errorProps(errors: MeetingFormErrors | undefined, field: FieldName) {
  const error = fieldError(errors, field);
  return {
    "aria-describedby": `${field}-error`,
    "aria-invalid": Boolean(error),
  } as const;
}

function FieldError({
  errors,
  field,
}: {
  errors: MeetingFormErrors | undefined;
  field: FieldName;
}) {
  return (
    <p id={`${field}-error`} className="mt-1 min-h-5 text-sm text-red-800" aria-live="polite">
      {fieldError(errors, field)}
    </p>
  );
}

function inputClassName(): string {
  return "mt-1 w-full rounded border border-stone-300 bg-white px-3 py-2 text-stone-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-800";
}

export default function MeetingForm({
  action,
  meeting,
  submitLabel,
}: MeetingFormProps) {
  const [state, formAction, isPending] = useActionState(action, initialState);
  const errors = state.errors;

  return (
    <form action={formAction} className="mt-8 space-y-8" noValidate>
      {state.message && (
        <p className="rounded border border-red-300 bg-red-50 p-3 text-red-900" role="alert">
          {state.message}
        </p>
      )}

      <section className="grid gap-5 rounded border border-stone-200 bg-white p-6 md:grid-cols-2">
        <div>
          <label htmlFor="date" className="font-medium text-stone-900">Meeting date</label>
          <input
            id="date"
            name="date"
            type="date"
            required
            defaultValue={meeting?.date ?? ""}
            className={inputClassName()}
            {...errorProps(errors, "date")}
          />
          <FieldError errors={errors} field="date" />
        </div>
        <div>
          <label htmlFor="meetingType" className="font-medium text-stone-900">Meeting type</label>
          <select
            id="meetingType"
            name="meetingType"
            required
            defaultValue={meeting?.meetingType ?? "regular"}
            className={inputClassName()}
            {...errorProps(errors, "meetingType")}
          >
            <option value="testimony">Testimony</option>
            <option value="regular">Regular</option>
            <option value="stake">Stake</option>
            <option value="general">General</option>
          </select>
          <FieldError errors={errors} field="meetingType" />
        </div>
        <div>
          <label htmlFor="presiding" className="font-medium text-stone-900">Presiding</label>
          <input
            id="presiding"
            name="presiding"
            required
            defaultValue={meeting?.presiding ?? ""}
            className={inputClassName()}
            {...errorProps(errors, "presiding")}
          />
          <FieldError errors={errors} field="presiding" />
        </div>
        <div>
          <label htmlFor="conducting" className="font-medium text-stone-900">Conducting</label>
          <input
            id="conducting"
            name="conducting"
            required
            defaultValue={meeting?.conducting ?? ""}
            className={inputClassName()}
            {...errorProps(errors, "conducting")}
          />
          <FieldError errors={errors} field="conducting" />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="announcements" className="font-medium text-stone-900">Announcements</label>
          <textarea
            id="announcements"
            name="announcements"
            rows={3}
            placeholder="One announcement per line"
            defaultValue={meeting?.announcements?.join("\n") ?? ""}
            className={inputClassName()}
            {...errorProps(errors, "announcements")}
          />
          <FieldError errors={errors} field="announcements" />
        </div>
      </section>

      <section className="grid gap-5 rounded border border-stone-200 bg-white p-6 md:grid-cols-2">
        <h2 className="font-serif text-2xl text-stone-900 md:col-span-2">Opening</h2>
        <div>
          <label htmlFor="openingHymnNumber" className="font-medium text-stone-900">
            Opening hymn number
          </label>
          <input
            id="openingHymnNumber"
            name="openingHymnNumber"
            type="number"
            min="1"
            required
            defaultValue={meeting?.openingHymn.number ?? ""}
            className={inputClassName()}
            {...errorProps(errors, "openingHymnNumber")}
          />
          <FieldError errors={errors} field="openingHymnNumber" />
        </div>
        <div>
          <label htmlFor="openingHymnTitle" className="font-medium text-stone-900">
            Opening hymn title
          </label>
          <input
            id="openingHymnTitle"
            name="openingHymnTitle"
            required
            defaultValue={meeting?.openingHymn.title ?? ""}
            className={inputClassName()}
            {...errorProps(errors, "openingHymnTitle")}
          />
          <FieldError errors={errors} field="openingHymnTitle" />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="openingPrayer" className="font-medium text-stone-900">
            Opening prayer
          </label>
          <input
            id="openingPrayer"
            name="openingPrayer"
            required
            defaultValue={meeting?.openingPrayer ?? ""}
            className={inputClassName()}
            {...errorProps(errors, "openingPrayer")}
          />
          <FieldError errors={errors} field="openingPrayer" />
        </div>
      </section>

      <section className="grid gap-5 rounded border border-stone-200 bg-white p-6 md:grid-cols-2">
        <h2 className="font-serif text-2xl text-stone-900 md:col-span-2">Ward business</h2>
        <div className="md:col-span-2">
          <label htmlFor="wardBusiness" className="font-medium text-stone-900">
            Ward business and sustaining
          </label>
          <textarea
            id="wardBusiness"
            name="wardBusiness"
            rows={4}
            placeholder="One item per line"
            defaultValue={meeting?.wardBusiness.map((item) => item.description).join("\n") ?? ""}
            className={inputClassName()}
            {...errorProps(errors, "wardBusiness")}
          />
          <FieldError errors={errors} field="wardBusiness" />
        </div>
        <div className="md:col-span-2">
          <input
            id="stakeBusiness"
            name="stakeBusiness"
            type="checkbox"
            value="true"
            defaultChecked={meeting?.stakeBusiness ?? false}
            className="mr-2 size-4 accent-green-900"
            {...errorProps(errors, "stakeBusiness")}
          />
          <label htmlFor="stakeBusiness" className="font-medium text-stone-900">
            Include stake business
          </label>
          <FieldError errors={errors} field="stakeBusiness" />
        </div>
      </section>

      <section className="grid gap-5 rounded border border-stone-200 bg-white p-6 md:grid-cols-2">
        <h2 className="font-serif text-2xl text-stone-900 md:col-span-2">Sacrament</h2>
        <div>
          <label htmlFor="sacramentHymnNumber" className="font-medium text-stone-900">
            Sacrament hymn number
          </label>
          <input
            id="sacramentHymnNumber"
            name="sacramentHymnNumber"
            type="number"
            min="1"
            required
            defaultValue={meeting?.sacramentHymn.number ?? ""}
            className={inputClassName()}
            {...errorProps(errors, "sacramentHymnNumber")}
          />
          <FieldError errors={errors} field="sacramentHymnNumber" />
        </div>
        <div>
          <label htmlFor="sacramentHymnTitle" className="font-medium text-stone-900">
            Sacrament hymn title
          </label>
          <input
            id="sacramentHymnTitle"
            name="sacramentHymnTitle"
            required
            defaultValue={meeting?.sacramentHymn.title ?? ""}
            className={inputClassName()}
            {...errorProps(errors, "sacramentHymnTitle")}
          />
          <FieldError errors={errors} field="sacramentHymnTitle" />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="speakers" className="font-medium text-stone-900">Speakers and music</label>
          <textarea
            id="speakers"
            name="speakers"
            rows={5}
            placeholder={'One per line: speaker | Name | Topic\nmusical-number | Name'}
            defaultValue={meeting?.speakers
              .map((item) => `${item.type} | ${item.name}${item.topic ? ` | ${item.topic}` : ""}`)
              .join("\n") ?? ""}
            className={inputClassName()}
            {...errorProps(errors, "speakers")}
          />
          <FieldError errors={errors} field="speakers" />
        </div>
      </section>

      <section className="grid gap-5 rounded border border-stone-200 bg-white p-6 md:grid-cols-2">
        <h2 className="font-serif text-2xl text-stone-900 md:col-span-2">Closing</h2>
        <div>
          <label htmlFor="closingHymnNumber" className="font-medium text-stone-900">
            Closing hymn number
          </label>
          <input
            id="closingHymnNumber"
            name="closingHymnNumber"
            type="number"
            min="1"
            required
            defaultValue={meeting?.closingHymn.number ?? ""}
            className={inputClassName()}
            {...errorProps(errors, "closingHymnNumber")}
          />
          <FieldError errors={errors} field="closingHymnNumber" />
        </div>
        <div>
          <label htmlFor="closingHymnTitle" className="font-medium text-stone-900">
            Closing hymn title
          </label>
          <input
            id="closingHymnTitle"
            name="closingHymnTitle"
            required
            defaultValue={meeting?.closingHymn.title ?? ""}
            className={inputClassName()}
            {...errorProps(errors, "closingHymnTitle")}
          />
          <FieldError errors={errors} field="closingHymnTitle" />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="closingPrayer" className="font-medium text-stone-900">
            Closing prayer
          </label>
          <input
            id="closingPrayer"
            name="closingPrayer"
            required
            defaultValue={meeting?.closingPrayer ?? ""}
            className={inputClassName()}
            {...errorProps(errors, "closingPrayer")}
          />
          <FieldError errors={errors} field="closingPrayer" />
        </div>
      </section>

      <button className="button button-dark" type="submit" disabled={isPending}>
        {isPending ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}
