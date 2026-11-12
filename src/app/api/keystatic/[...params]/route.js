import { makeRouteHandler } from "@keystatic/next/route-handler";
import config from "../../../../../keystatic.config";

// The projects editor's own requests (reading and saving entries). Local
// storage, so only while the site runs on this computer: a live build
// answers 404 until the editor is switched to GitHub storage (CLAUDE.md).
const handler = makeRouteHandler({ config });
const closed = () => new Response("Not found", { status: 404 });

export const GET = process.env.NODE_ENV === "production" ? closed : handler.GET;
export const POST = process.env.NODE_ENV === "production" ? closed : handler.POST;
