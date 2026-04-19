export async function GET() {
  const res = await fetch(
    "https://pp-pulse-backend.onrender.com/api/auth/test"
  );

  const data = await res.json();

  return Response.json(data);
}