export default function UserTodos({ handle }: { handle: string }) {
  return <h1>{handle}</h1>;
}

export async function getConfig() {
  return {
    render: "dynamic",
  };
}
