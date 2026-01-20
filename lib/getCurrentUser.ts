import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

type JwtPayload = {
  id: number;
  email: string;
  role: string;
};

export async function getCurrentUser() {
  const cookieStore = await cookies(); // ❌ do NOT await here
  const token = cookieStore.get("hydro_token")?.value;

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    return decoded; // { id, email, role }
  } catch {
    return null;
  }
}
