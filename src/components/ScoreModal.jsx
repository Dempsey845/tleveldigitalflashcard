import { useEffect } from "react";
import { addScoreBySubjects } from "../lib/scores";

export default function ScoreModal({
  scoreBySubject,
  totalScore,
  onClose,
  userId,
}) {
  useEffect(() => {
    if (!userId || !scoreBySubject) return;

    const saveScores = async () => {
      await addScoreBySubjects(userId, scoreBySubject);
    };

    saveScores();
  }, [userId, scoreBySubject]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center text-black">
        <h2 className="text-xl font-bold mb-4">Game Over</h2>

        <div className="mb-4">
          {Object.entries(scoreBySubject).map(([topic, score]) => (
            <p key={topic}>
              {topic}: {score.correct}/{score.total}
            </p>
          ))}
        </div>

        <p className="font-semibold mb-4">
          Total: {totalScore.correct}/{totalScore.total}
        </p>

        <button onClick={onClose} className="btn btn-correct mt-2">
          Close
        </button>
      </div>
    </div>
  );
}
