"use server";

import { cookies } from "next/headers";

export async function setShopUrl(shopUrl: string) {
  cookies().set("framify:shopUrl", shopUrl);
  return { status: 200, body: "Shop URL set" };
}
