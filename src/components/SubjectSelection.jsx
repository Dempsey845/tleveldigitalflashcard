import { useEffect, useState } from "react";
import "./styles/SubjectSelection.css";

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

  // Sort subjects alphabetically
  const sortedSubjects = [...subjects].sort((a, b) =>
    a.subject.localeCompare(b.subject)
  );

  const handleSubjectClick = (subject) => {
    setSubjects((prev) =>
      prev.map((s) =>
        s.subject === subject.subject ? { ...s, selected: !s.selected } : s
      )
    );
  };

  return (
    <div
      className={`subject-selection-container ${
        fadeIn ? "opacity-100 scale-100" : "opacity-0 scale-95"
      }`}
    >
      <h2 className="subject-selection-title">Select Your Subjects</h2>
      <div className="subject-list">
        {sortedSubjects.map((subject) => (
          <button
            disabled={gameIsStarting}
            className={`subject ${subject.selected ? "subject-selected" : ""}`}
            onClick={() => handleSubjectClick(subject)}
            key={subject.subject}
          >
            {subject.subject}
          </button>
        ))}
      </div>
    </div>
  );
}
