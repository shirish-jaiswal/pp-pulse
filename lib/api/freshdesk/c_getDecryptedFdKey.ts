import { cookies } from "next/headers";
import { jwtVerify } from "jose"; 
import { decryptData } from "@/utils/crypto";
import { findProfile } from "@/lib/excel-engine/rbac/profile/find";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key");

export default async function c_getDecryptedFdKey(): Promise<string> {
  try {
    const cookieStore = await cookies();
    const userTokenCookie = cookieStore.get("user_token");

    if (!userTokenCookie || !userTokenCookie.value) {
      throw new Error("User token cookie is missing or empty.");
    }

    const token = userTokenCookie.value;

    const { payload } = await jwtVerify(token, JWT_SECRET);
    
    const isFreshDeskUser = payload.isFreshDesk as boolean;

    if (!isFreshDeskUser) {
      throw new Error("Authenticated user does not have Freshdesk access.");
    }
    
    const email = payload.email as string;

    if (!email) {
      throw new Error("Email claim missing from JWT payload.");
    }

    const encryptedFreshdeskKey = await fetchEncryptedKeyFromDatabase(email); 

    if (!encryptedFreshdeskKey) {
      throw new Error(`No Freshdesk configuration found for user: ${email}`);
    }
    
    const liveFreshdeskKey = decryptData(encryptedFreshdeskKey);

    return liveFreshdeskKey;

  } catch (error: any) {
    console.error("Error retrieving decrypted Freshdesk key:", error.message);
    return "";
  }
}

async function fetchEncryptedKeyFromDatabase(email: string): Promise<string> {
  const profile = await findProfile({ email });
  console.log("Fetched profile for email:", email, profile);
  return profile.at(0)?.freshdesk || "";
}