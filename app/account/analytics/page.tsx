import { format, sub } from "date-fns";
import { CardTitle, CardContent, Card } from "@/components/ui/card";
import { LineChart } from "./line-chart";

async function fetchAnalytics() {
  const now = new Date();
  const thirtyDaysAgo = sub(now, { days: 30 });

  const response = await fetch(
    // Date format of YYYY-MM-DD HH:MM:SS
    `https://api.pinata.cloud/farcaster/frames/interactions?start_date=${encodeURIComponent(
      format(thirtyDaysAgo, "yyyy-MM-dd HH:mm:ss")
    )}&end_date=${encodeURIComponent(format(now, "yyyy-MM-dd HH:mm:ss"))}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.PINATA_JWT}`,
      },
    }
  );
  const data = await response.json();

  return data;
}

export default async function AnalyticsPage() {
  const stats = await fetchAnalytics();
  console.log(stats);
  return (
    <div>
      <h3 className="text-base font-semibold leading-6 text-gray-900">
        Last 30 days
      </h3>
      <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">
            Total interactions
          </dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
            {stats.total_interactions}
          </dd>
        </div>
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">
            Unique interactions
          </dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
            {stats.total_unique_interactions}
          </dd>
        </div>
      </dl>
      <Card className="w-full max-w-lg mt-10">
        <CardContent className="flex flex-col gap-4 p-6">
          <CardTitle className="text-lg">Interactions</CardTitle>
          <div>
            <div className="text-sm text-gray-500">Start</div>
            <div className="text-sm text-gray-500 text-right">End</div>
          </div>
          <LineChart className="h-[300px] w-full" data={stats.time_periods} />
        </CardContent>
      </Card>
    </div>
  );
}
