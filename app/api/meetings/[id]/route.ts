import { getMeetingById } from "@/lib/meetings-db";

export async function GET(
  _request: Request,
  context: RouteContext<"/api/meetings/[id]">,
): Promise<Response> {
  const { id: idParam } = await context.params;
  const id = Number(idParam);

  if (!Number.isSafeInteger(id)) {
    return Response.json({ error: "Meeting ID must be a valid integer." }, { status: 400 });
  }

  const meeting = await getMeetingById(id);

  if (!meeting) {
    return Response.json({ error: "Meeting not found." }, { status: 404 });
  }

  return Response.json(meeting);
}
