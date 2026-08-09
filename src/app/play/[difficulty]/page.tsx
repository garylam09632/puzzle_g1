import { notFound } from "next/navigation";
import { TPuzzleGame } from "@/components/TPuzzleGame";
import { getLevelForDifficulty } from "@/content/levels";
import { DIFFICULTIES, parseDifficulty } from "@/lib/difficulty";

type PlayPageProps = {
  params: Promise<{ difficulty: string }>;
};

export function generateStaticParams() {
  return DIFFICULTIES.map((difficulty) => ({ difficulty }));
}

export default async function PlayPage({ params }: PlayPageProps) {
  const { difficulty: raw } = await params;
  const difficulty = parseDifficulty(raw);
  if (!difficulty) {
    notFound();
  }

  const level = getLevelForDifficulty(difficulty);

  return (
    <main className="app-atmosphere relative min-h-full">
      <TPuzzleGame difficulty={difficulty} level={level} />
    </main>
  );
}
