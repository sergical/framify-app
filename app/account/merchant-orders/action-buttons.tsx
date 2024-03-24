"use client";

import { Button } from "@/components/ui/button";

export default function ActionButtons({ order }: { order: any }) {
  return (
    <div className="flex space-x-4">
      <Button variant="outline">Cast</Button>
      <Button>Send email</Button>
    </div>
  );
}
