import { useEffect, useState } from "react";
import { getScoreBySubjects } from "../lib/scores";

export default function ScoreBySubjectDisplay({ userId, updateOn }) {
  const [scoresBySubject, setScoresBySubject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fadeIn, setFadeIn] = useState(false);

  const fetchScoreBySubjects = async () => {
    setLoading(true);
    const scores = await getScoreBySubjects(userId);
    setScoresBySubject(scores);
    setLoading(false);
    setFadeIn(true); // trigger fade-in animation
  };

  useEffect(() => {
    if (userId) {
      fetchScoreBySubjects();
    }
  }, [userId, updateOn]);

  if (loading) {
    return (
      <p className="text-gray-400 text-center mt-4 animate-pulse">
        Loading scores...
      </p>
    );
  }

  if (!scoresBySubject) {
    return <p className="text-gray-400 text-center mt-4">No scores yet.</p>;
  }

  return (
    <div className="max-w-md mx-auto mt-6">
      {/* Title */}
      <h2 className="text-2xl font-bold text-center text-blue-700 mb-4 animate-fade-in">
        Your Scores by Subject
      </h2>

      {/* Score cards */}
      <div className="space-y-3">
        {Object.entries(scoresBySubject).map(
          ([subject, { correct, total }]) => (
            <div
              key={subject}
              className={`flex justify-between items-center bg-white/20 shadow-lg backdrop-blur-md text-blue-700 p-4 rounded-xl gap-2 transform transition-all duration-500 ease-in-out ${
                fadeIn
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 -translate-y-3"
              }`}
            >
              <span className="font-semibold text-lg">{subject}</span>
              <span className="font-medium">
                {correct} / {total} correct
              </span>
            </div>
          )
        )}
      </div>
    </div>
  );
}
