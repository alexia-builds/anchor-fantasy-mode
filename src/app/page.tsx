"use client";

import * as React from "react";
import { Card, SectionHeader, Button } from "@/components/ui";
import { ModePills, type Mode } from "@/components/mode-pills";
import { AnchorTop3 } from "@/components/anchor-top3";
import { SprintTimer } from "@/components/sprint-timer";
import { SessionNotes } from "@/components/session-notes";
import { PlannerCard } from "@/components/planner-card";
import { BubbleBrain } from "@/components/bubble-brain";
import { SomaticCard } from "@/components/somatic-card";

function makeCommitDraft(p: {
  mode: Mode;
  started: string;
  figured: string;
  ended: string;
  files: string[];
}): string {
  const type  = p.mode === "Developer" ? "fix" : "chore";
  const scope = p.mode === "Developer" ? "dev" : "anchor";
  const summary =
    p.ended.split("\n")[0].trim() ||
    p.figured.split("\n")[0].trim() ||
    "update progress";

  const lines = [`${type}(${scope}): ${summary.toLowerCase()}`, ""];
  if (p.started) lines.push(`- Started with: ${p.started.split("\n")[0]}`);
  if (p.figured) lines.push(`- Figured out: ${p.figured.split("\n")[0]}`);
  if (p.ended)   lines.push(`- Ended here: ${p.ended.split("\n")[0]}`);
  if (p.files.length) {
    const shown = p.files.slice(0, 4);
    lines.push(`- Touched: ${shown.join(", ")}${p.files.length > 4 ? "…" : ""}`);
  }
  return lines.join("\n");
}

export default function FocusPage() {
  const [mode, setMode]     = React.useState<Mode>("Developer");
  const [top3, setTop3]     = React.useState<string[]>(["", "", ""]);
  const [locked, setLocked] = React.useState(false);
  const [brain, setBrain]   = React.useState("");

  const [started, setStarted] = React.useState("");
  const [figured, setFigured] = React.useState("");
  const [ended,   setEnded]   = React.useState("");
  const [files,   setFiles]   = React.useState<string[]>([]);

  const [commitDraft,      setCommitDraft]      = React.useState("");
  const [plannerQuickHits, setPlannerQuickHits] = React.useState<string[]>([]);
  const [plannerDone,      setPlannerDone]      = React.useState<string[]>([]);

  const generateCommit = () =>
    setCommitDraft(makeCommitDraft({ mode, started, figured, ended, files }));

  const sendToPlanner = () =>
    setPlannerQuickHits(
      [...ended.split("\n"), ...figured.split("\n")]
        .map((l) => l.trim())
        .filter(Boolean)
        .slice(0, 5)
    );

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      {/* ── header ── */}
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Anchor</h1>
          <p className="text-sm text-[rgb(var(--muted))]">
            Three priorities. One day. Stay grounded.
          </p>
        </div>
        <div className="flex flex-col items-start gap-2 md:items-end">
          <ModePills value={mode} onChange={setMode} />
          <p className="text-xs text-[rgb(var(--muted))]">
            Mode changes the tone. Not the standards.
          </p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* ── left column (2/3) ── */}
        <div className="space-y-4 lg:col-span-2">
          <Card className="p-5">
            <SectionHeader
              title="Today’s Anchor (pick 3 only)"
              subtitle="Three priorities. That’s the deal."
              right={
                <span className="rounded-full border border-[rgb(var(--border))] bg-white px-3 py-1 text-xs">
                  {locked ? "Locked" : "Editable"}
                </span>
              }
            />
            <div className="mt-4">
              <AnchorTop3
                items={top3}
                setItems={setTop3}
                locked={locked}
                setLocked={setLocked}
              />
            </div>
          </Card>

          <Card className="p-5">
            <SectionHeader
              title="Focus Sprint"
              subtitle="We’re not spiraling. One sprint at a time."
            />
            <div className="mt-4">
              <SprintTimer />
            </div>
          </Card>

          <Card className="p-5">
            <SectionHeader
              title="Session Notes"
              subtitle="We started with → figured out → ended here → files touched."
            />
            <div className="mt-4">
              <SessionNotes
                started={started}   setStarted={setStarted}
                figured={figured}   setFigured={setFigured}
                ended={ended}       setEnded={setEnded}
                files={files}       setFiles={setFiles}
                onGenerateCommit={generateCommit}
                onSendToPlanner={sendToPlanner}
              />
            </div>
          </Card>

          {commitDraft && (
            <Card className="p-5">
              <SectionHeader
                title="Commit Draft"
                subtitle="Write it while context is alive."
                right={
                  <Button
                    variant="secondary"
                    onClick={() => navigator.clipboard.writeText(commitDraft)}
                  >
                    Copy
                  </Button>
                }
              />
              <pre className="mt-4 whitespace-pre-wrap rounded-xl border border-[rgb(var(--border))] bg-white p-3 text-sm">
                {commitDraft}
              </pre>
            </Card>
          )}
        </div>

        {/* ── right column (1/3) ── */}
        <div className="space-y-4">
          <Card className="p-5">
            <SectionHeader
              title="Bubble Brain"
              subtitle="Drop it here. No organizing. Park the side quests."
            />
            <div className="mt-4">
              <BubbleBrain value={brain} onChange={setBrain} />
            </div>
          </Card>

          <Card className="p-5">
            <SectionHeader
              title="Planner Card"
              subtitle="Mental cue → screen → write it down."
            />
            <div className="mt-4">
              <PlannerCard top3={top3} quickHits={plannerQuickHits} done={plannerDone} />

              <div className="mt-4 rounded-xl border border-[rgb(var(--border))] bg-white p-3">
                <p className="text-sm font-medium">Mark items done</p>
                <p className="mt-1 text-sm text-[rgb(var(--muted))]">
                  Even completed items deserve to be written + highlighted.
                </p>
                <div className="mt-3 flex gap-2">
                  <Button
                    variant="ghost"
                    onClick={() => setPlannerDone(top3.filter(Boolean))}
                    disabled={!top3.some(Boolean)}
                  >
                    Add Top 3 to Done ✅
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setPlannerDone([])}
                    disabled={!plannerDone.length}
                  >
                    Clear
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <SectionHeader
              title="Somatic Instructions"
              subtitle="Reduce force, keep direction."
            />
            <div className="mt-4">
              <SomaticCard />
            </div>
          </Card>
        </div>
      </div>

      <p className="mt-8 text-center text-xs text-[rgb(var(--muted))]">
        Anchor — stay grounded, ship the day.
      </p>
    </div>
  );
}