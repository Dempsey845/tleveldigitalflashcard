import { useEffect, useState } from "react";
import "./SubjectSelection.css";

export default function SubjectSelection({
  subjects,
  setSubjects,
  gameIsStarting,
  setHasSelection,
}) {
  const [showContainer, setShowContainer] = useState(true);
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setHasSelection(subjects.some((s) => s.selected));
  }, [subjects, setHasSelection]);

  // Animate container when game starts / ends
  useEffect(() => {
    if (!gameIsStarting) {
      setShowContainer(true);
      setFadeIn(false);
      setTimeout(() => setFadeIn(true), 10);
    } else {
      setFadeIn(false);
      setTimeout(() => setShowContainer(false), 500);
    }
  }, [gameIsStarting]);

  if (!showContainer) return null;

  return (
    <div
      className={`subject-selection-container transition-all duration-500 ease-in-out transform origin-top ${
        fadeIn ? "opacity-100 scale-100" : "opacity-0 scale-95"
      }`}
    >
      <h2 className="subject-selection-title">Select Your Subjects</h2>
      <div className="subject-list">
        {subjects.map((subject, index) => (
          <button
            disabled={gameIsStarting}
            className={`subject ${subject.selected ? "subject-selected" : ""}`}
            onClick={() =>
              setSubjects((prev) =>
                prev.map((s, i) =>
                  i === index ? { ...s, selected: !s.selected } : s
                )
              )
            }
            key={subject.subject}
          >
            {subject.subject}
          </button>
        ))}
      </div>
    </div>
  );
}
