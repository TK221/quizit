import { Leaderboard } from "./_components/leaderboard/leaderboard";

export default function Home() {
  return (
    <div className="flex flex-col items-center space-y-6">
      <h1 className="mt-20 text-8xl font-bold">Quizit</h1>
      <p className="mt-5 text-xl">
        A platform for tracking points and buzzing in quizzes
      </p>
      <div className="w-2/3">
        <Leaderboard />
      </div>
    </div>
  );
}
