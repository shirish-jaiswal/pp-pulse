import { cookies } from "next/headers";

export async function getSessionCookie() {
  const cookieStore = await cookies();
  const session = cookieStore.get("JSESSIONID");

  return session ? `JSESSIONID=${session.value}` : "";
}