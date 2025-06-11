"use server";

import { getHonoContext } from "./utils/get-hono-context";

export async function createTodo(formData: FormData) {
  let handle = formData.get("handle");
  let title = formData.get("title");

  if (!handle || !title) {
    return { error: "Missing handle or title" };
  }

  let ctx = getHonoContext();
  if (!ctx) {
    return { error: "Not in a Hono context" };
  }

  let db = ctx.env.DB;
  if (!db) {
    return { error: "DB not found" };
  }

  let result = await db
    .prepare("INSERT INTO todos (handle, title) VALUES (?, ?)")
    .bind(handle, title)
    .run();
  if (result.error) {
    return { error: result.error };
  }

  return { success: true };
}

export async function checkTodo(formData: FormData) {
  let handle = formData.get("handle");
  let title = formData.get("title");

  if (!handle || !title) {
    return { error: "Missing handle or title" };
  }

  let ctx = getHonoContext();
  if (!ctx) {
    return { error: "Not in a Hono context" };
  }

  let db = ctx.env.DB;
  if (!db) {
    return { error: "DB not found" };
  }

  let result = await db
    .prepare("UPDATE todos SET completed = TRUE WHERE handle = ? AND title = ?")
    .bind(handle, title)
    .run();
  if (result.error) {
    return { error: result.error };
  }

  return { success: true };
}
