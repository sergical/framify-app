"use client";

import { format } from "date-fns";

import { ResponsiveLine } from "@nivo/line";

export function LineChart(props: any) {
  const { data } = props;
  const totalInteractions = data.map((d: any) => ({
    x: format(new Date(d.period_start_time), "MMM d"),
    y: d.interactions,
  }));

  const uniqueInteractions = data.map((d: any) => ({
    x: format(new Date(d.period_start_time), "MMM d"),
    y: d.unique_interactions,
  }));

  return (
    <div {...props}>
      <ResponsiveLine
        data={[
          {
            id: "Total interactions",
            data: totalInteractions,
          },
          {
            id: "Unique interactions",
            data: uniqueInteractions,
          },
        ]}
        margin={{ top: 10, right: 10, bottom: 40, left: 40 }}
        xScale={{
          type: "point",
        }}
        yScale={{
          type: "linear",
        }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 0,
          tickPadding: 16,
        }}
        axisLeft={{
          tickSize: 0,
          tickValues: 5,
          tickPadding: 16,
        }}
        colors={["#2563eb", "#e11d48"]}
        pointSize={6}
        useMesh={true}
        gridYValues={6}
        theme={{
          tooltip: {
            chip: {
              borderRadius: "9999px",
            },
            container: {
              fontSize: "12px",
              textTransform: "capitalize",
              borderRadius: "6px",
            },
          },
          grid: {
            line: {
              stroke: "#f3f4f6",
            },
          },
        }}
        role="application"
      />
    </div>
  );
}
