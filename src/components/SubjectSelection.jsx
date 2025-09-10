import { useEffect, useState } from "react";
import "./SubjectSelection.css";

export default function SubjectSelection({
  subjects,
  setSubjects,
  playing,
  setPlaying,
}) {
  const [showPlayButton, setShowPlayButton] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    let timeout;
    if (!playing) {
      timeout = setTimeout(() => {
        setShowPlayButton(true);
        setTimeout(() => setFadeIn(true), 10);
      }, 500);
    } else {
      setFadeIn(false);
      setShowPlayButton(false);
    }

    return () => clearTimeout(timeout);
  }, [playing]);

  return (
    <div className="subject-selection-container relative">
      <h2 className="subject-selection-title">Select Your Subjects</h2>
      <div className="subject-list">
        {subjects.map((subject, index) => (
          <button
            disabled={playing}
            className={`subject ${subject.selected ? "subject-selected" : ""}`}
            onClick={() => {
              setSubjects((prev) =>
                prev.map((s, i) =>
                  i === index ? { ...s, selected: !s.selected } : s
                )
              );
            }}
            key={subject.subject}
          >
            {subject.subject}
          </button>
        ))}
      </div>

      {showPlayButton && (
        <button
          onClick={() => setPlaying(true)}
          className={`btn btn-correct my-10 transition-opacity duration-500 ${
            fadeIn ? "opacity-100" : "opacity-0"
          }`}
        >
          Play
        </button>
      )}
    </div>
  );
}
