import { useEffect } from "react";
import { addScoreBySubjects } from "../lib/scores";
import "./styles/ScoreModal.css";

export default function ScoreModal({
  scoreBySubject,
  totalScore,
  onClose,
  userId,
}) {
  // If user changes/logs in or scoreBySubject is modifed, save SBS it to DB
  useEffect(() => {
    if (!userId || !scoreBySubject) return;

    const saveScores = async () => {
      await addScoreBySubjects(userId, scoreBySubject);
    };

    saveScores();
  }, [userId, scoreBySubject]);

  return (
    <div className="modal-container">
      <div className="modal-card">
        <h2>Game Over</h2>

        <div className="mb-4">
          {Object.entries(scoreBySubject).map(([topic, score]) => (
            <p key={topic}>
              {topic}: {score.correct}/{score.total}
            </p>
          ))}
        </div>

        <p>
          Total: {totalScore.correct}/{totalScore.total}
        </p>

        <button onClick={onClose} className="btn btn-correct mt-2">
          Close
        </button>
      </div>
    </div>
  );
}
