"use client";

import * as React from "react";
import { Button, Textarea } from "./ui";

export function BubbleBrain({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-3">
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Ideas, worries, random reminders…"
      />
      <div className="flex gap-2">
        <Button variant="ghost" onClick={() => onChange("")} disabled={!value}>
          Clear
        </Button>
        <span className="ml-auto text-sm text-[rgb(var(--muted))]">
          Cute idea? Park it.
        </span>
      </div>
    </div>
  );
}
