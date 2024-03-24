"use client";
import {
  DynamicEmbeddedWidget,
  DynamicWidget,
  useDynamicContext,
  useEmbeddedWallet,
} from "@/lib/dynamic";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Label } from "@/components/ui/label";
import { CopyInput } from "./ui/copy-input";
import Link from "next/link";

export default function AccountCard() {
  const { user } = useDynamicContext();
  const farcasterFid = user?.verifiedCredentials.filter(
    (c) => c.oauthProvider === "farcaster"
  )[0].oauthAccountId;
  const embeddedWalletAddress =
    user?.verifiedCredentials.filter(
      (c) => c.walletProvider === "embeddedWallet"
    )[0].address || "";

  const truncatedAddress = `${embeddedWalletAddress.slice(
    0,
    6
  )}...${embeddedWalletAddress.slice(-4)}`;

  const { userHasEmbeddedWallet } = useEmbeddedWallet();

  return (
    <div>
      {user ? (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Your account</CardTitle>
              <CardDescription>
                If you&apos;re looking to connect your Framify app, head over to
                Shopify and fill in the details below
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form>
                <div className="grid w-full items-center gap-4">
                  {farcasterFid ? (
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="name">Farcaster username</Label>
                      <CopyInput text={farcasterFid} />
                    </div>
                  ) : (
                    <p>No Farcaster account connected</p>
                  )}
                  {userHasEmbeddedWallet() ? (
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="name">Embedded wallet</Label>
                      <CopyInput
                        text={truncatedAddress}
                        copyText={embeddedWalletAddress}
                      />
                    </div>
                  ) : (
                    <Button>Create store wallet</Button>
                  )}
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Logout</Button>
              <Button asChild>
                <Link href="https://accounts.shopify.com" target="_blank">
                  Go to your store
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </>
      ) : (
        <DynamicEmbeddedWidget background="with-border" />
      )}
    </div>
  );
}
