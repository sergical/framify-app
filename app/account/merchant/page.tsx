import AccountCard from "@/components/account-card";
import { setShopUrl } from "@/server/actions";
import { cookies } from "next/headers";

export default async function AccountPage() {
  const shopUrl = cookies().get("framify:shopUrl")?.value;
  return (
    <div className="w-full sm:w-[360px]">
      <AccountCard setShopUrl={setShopUrl} shopUrl={shopUrl} />
    </div>
  );
}
