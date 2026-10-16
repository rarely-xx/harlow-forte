import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function auth() {
  try {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get("hf_user")?.value;
    if (!userCookie) return null;

    const user = JSON.parse(userCookie);
    return { user };
  } catch {
    return null;
  }
}

export const handlers = {
  GET: async () => {
    const session = await auth();
    return NextResponse.json(session || { user: null });
  },
  POST: async () => {
    const session = await auth();
    return NextResponse.json(session || { user: null });
  },
};