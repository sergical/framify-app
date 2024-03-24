"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { useEffect, useState } from "react";
import { baseSepolia } from "viem/chains";

export default function PurchasesCard() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useDynamicContext();
  const farcasterFid = user?.verifiedCredentials.filter(
    (c) => c.oauthProvider === "farcaster"
  )[0].oauthAccountId;

  useEffect(() => {
    const fetchPurchases = async () => {
      const response = await fetch(
        `/api/fetch-orders-by-fid?fid=${farcasterFid}`
      );
      const data = await response.json();

      setPurchases(data.orders);
      setLoading(false);
    };

    fetchPurchases();
  }, [farcasterFid]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mt-8 flow-root">
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Product ID
                    </th>

                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Email Address
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Time Placed
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Transaction
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {purchases.map((purchase: any) => (
                    <tr key={purchase.transactionId}>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                        {purchase.frameId}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                        {purchase.emailAddress}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDistanceToNow(new Date(purchase.timePlaced), {
                          addSuffix: true,
                        })}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                        <Link
                          target="_blank"
                          href={`${baseSepolia.blockExplorers.default.url}/tx/${purchase.transactionId}`}
                          className="
                      text-indigo-600 hover:text-indigo-900
                      underline
                    "
                        >
                          Trasaction Link
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
