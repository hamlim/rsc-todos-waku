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
      {result.results.map(
        (todo: { id: number; title: string; completed: boolean }) => (
          <li key={todo.id}>
            <form action={checkTodo}>
              <input type="hidden" name="handle" value={handle} />
              <input type="hidden" name="title" value={todo.title} />
              <input
                type="hidden"
                name="completed"
                value={todo.completed ? "true" : "false"}
              />
              <button type="submit">{todo.completed ? "✅" : "❌"}</button>
            </form>
            {todo.title}
          </li>
        ),
      )}
    </ul>
  );
}

export default function UserTodos({ handle }: { handle: string }) {
  return (
    <main className="mx-auto max-w-prose p-4">
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
