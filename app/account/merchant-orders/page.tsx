import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import db from "@/server/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { baseSepolia } from "viem/chains";
import { Button } from "@/components/ui/button";
import ActionButtons from "./action-buttons";

const orderStatuses = [
  {
    label: "Pending",
    value: "pending",
    textColor: "text-gray-800",
    background: "bg-gray-200",
  },
  {
    label: "Email sent",
    value: "paid",
    textColor: "text-blue-800",
    background: "bg-blue-200",
  },
  {
    label: "Shipped",
    value: "shipped",
    textColor: "text-yellow-800",
    background: "bg-yellow-200",
  },
  {
    label: "Delivered",
    value: "delivered",
    textColor: "text-green-800",
    background: "bg-green-200",
  },
  {
    label: "Cancelled",
    value: "cancelled",

    textColor: "text-red-800",
    background: "bg-red-200",
  },
];

export default async function MerchantOrders() {
  const shopUrl = cookies().get("framify:shopUrl")?.value;
  if (!shopUrl) {
    redirect("/account/merchant");
  }
  const merchantOrders = await db.order.findMany({
    where: {
      shopUrl: shopUrl,
    },
    orderBy: {
      timePlaced: "desc",
    },
  });

  const getRandomStatusBadge = () => {
    const randomIndex = Math.floor(Math.random() * orderStatuses.length);
    const status = orderStatuses[randomIndex];
    return (
      <span
        className={`inline-flex items-center rounded-md ${status.background} px-2 py-1 text-xs font-medium ${status.textColor} ring-1 ring-inset `}
      >
        {status.label}
      </span>
    );
  };

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
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {merchantOrders.map((order) => (
                    <tr key={order.transactionId}>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.frameId}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.emailAddress}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDistanceToNow(new Date(order.timePlaced), {
                          addSuffix: true,
                        })}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                        <Link
                          target="_blank"
                          href={`${baseSepolia.blockExplorers.default.url}/tx/${order.transactionId}`}
                          className="
                          text-indigo-600 hover:text-indigo-900
                          underline
                        "
                        >
                          Trasaction Link
                        </Link>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm">
                        {getRandomStatusBadge()}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                        <ActionButtons order={order} />
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
