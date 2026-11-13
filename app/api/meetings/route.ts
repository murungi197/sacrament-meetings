import { getMeetings } from "@/lib/meetings-db";

export async function GET(request: Request): Promise<Response> {
  const date = new URL(request.url).searchParams.get("date");
  return Response.json(await getMeetings(date));
}
