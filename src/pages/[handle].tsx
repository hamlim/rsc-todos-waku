import { CheckIcon, XIcon } from "lucide-react";
import { Suspense } from "react";
import { checkTodo, createTodo } from "../actions";
import { getHonoContext } from "../utils/get-hono-context";

async function Todos({ handle }: { handle: string }) {
  let context = getHonoContext();
  if (!context) {
    return <p>Not in a Hono context</p>;
  }

  let db = context.env.DB;

  if (!db) {
    return <p>DB not found</p>;
  }

  let result = await db
    .prepare("SELECT * FROM todos WHERE handle = ?")
    .bind(handle)
    .all();
  if (result.error) {
    return <p>Error fetching todos: {result.error}</p>;
  }

  return (
    <ul>
      {(
        result.results as unknown as Array<{
          id: number;
          title: string;
          completed: boolean;
        }>
      )
        .toSorted((a, b) => (a.completed ? 1 : -1))
        .map((todo: { id: number; title: string; completed: boolean }) => (
          <li key={todo.id}>
            <form action={checkTodo} className="flex items-center gap-2">
              <input type="hidden" name="handle" value={handle} />
              <input type="hidden" name="title" value={todo.title} />
              <input type="hidden" name="id" value={todo.id} />
              <input
                type="hidden"
                name="completed"
                value={todo.completed ? "true" : "false"}
              />
              <button
                type="submit"
                className="p-1 flex items-center content-center rounded-md bg-slate-50 border border-slate-200"
              >
                {todo.completed ? (
                  <CheckIcon className="text-green-400" size={20} />
                ) : (
                  <XIcon size={20} className="text-red-400" />
                )}
              </button>
              {todo.completed ? <s>{todo.title}</s> : todo.title}
            </form>
          </li>
        ))}
    </ul>
  );
}

export default async function HandlePage({ handle }: { handle: string }) {
  return (
    <main className="mx-auto max-w-prose p-4">
      <title>{`${handle} Todos`}</title>
      <h1 className="text-center text-2xl font-bold">{handle} Todos:</h1>
      <form action={createTodo}>
        <input type="hidden" name="handle" value={handle} />
        <input type="text" name="title" placeholder="Add a todo" />
        <button type="submit">Add</button>
      </form>
      <Suspense fallback={<p>Loading...</p>}>
        <Todos handle={handle} />
      </Suspense>
    </main>
  );
}

export async function getConfig() {
  return {
    render: "dynamic",
  };
}
