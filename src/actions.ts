"use server";

import { unstable_rerenderRoute } from "waku/router/server";
import { getHonoContext } from "./utils/get-hono-context";

export async function createTodo(formData: FormData): Promise<void> {
  let handle = formData.get("handle");
  let title = formData.get("title");

  if (!handle || !title) {
    throw new Error("Missing handle or title");
  }

  let ctx = getHonoContext();
  if (!ctx) {
    throw new Error("Not in a Hono context");
  }

  let db = ctx.env.DB;
  if (!db) {
    throw new Error("DB not found");
  }

  let result = await db
    .prepare("INSERT INTO todos (handle, title) VALUES (?, ?)")
    .bind(handle, title)
    .run();
  if (result.error) {
    throw new Error(result.error);
  }
  unstable_rerenderRoute(`/${handle}`);
}

export async function checkTodo(formData: FormData): Promise<void> {
  let handle = formData.get("handle");
  let title = formData.get("title");
  let id = formData.get("id");
  let completed = formData.get("completed");

  if (!handle || !title || !id) {
    throw new Error("Missing handle or title or id");
  }

  let ctx = getHonoContext();
  if (!ctx) {
    throw new Error("Not in a Hono context");
  }

  let db = ctx.env.DB;
  if (!db) {
    throw new Error("DB not found");
  }

  let result = await db
    .prepare(
      `UPDATE todos SET completed = ${completed === "true" ? "false" : "true"} WHERE id = ?`,
    )
    .bind(id)
    .run();
  if (result.error) {
    throw new Error(result.error);
  }
  unstable_rerenderRoute(`/${handle}`);
}
