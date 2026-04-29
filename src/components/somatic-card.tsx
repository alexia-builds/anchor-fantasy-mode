import * as React from "react";

const cues = [
  { title: "Soften",   body: "Same task. Softer grip." },
  { title: "Unclench", body: "Release tension before deciding." },
];

export function SomaticCard() {
  return (
    <div className="space-y-2 text-sm">
      {cues.map(({ title, body }) => (
        <div
          key={title}
          className="rounded-xl border border-[rgb(var(--border))] bg-white p-3"
        >
          <p className="font-medium">{title}</p>
          <p className="text-[rgb(var(--muted))]">{body}</p>
        </div>
      ))}
    </div>
  );
}
