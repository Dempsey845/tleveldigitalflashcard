import { useEffect, useState } from "react";

export default function PlayButton({
  hasSelection,
  startGame,
  setPlaying,
  show,
  setGameIsStarting,
}) {
  const [fadeIn, setFadeIn] = useState(false);
  const [visible, setVisible] = useState(false);

  // Animate visibility whenever "show" changes
  useEffect(() => {
    let timeout;
    if (show) {
      // Show and fade in
      setVisible(true);
      timeout = setTimeout(() => setFadeIn(true), 10);
    } else {
      // Fade out
      setFadeIn(false);
      timeout = setTimeout(() => setVisible(false), 500);
    }

    return () => clearTimeout(timeout);
  }, [show]);

  const handleClick = () => {
    if (!hasSelection) return;

    setFadeIn(false); // fade out button
    setGameIsStarting(true);

    setTimeout(() => {
      startGame();
      setPlaying(true);
    }, 500);
  };

  if (!visible) return null;

  return (
    <div
      className={`w-full flex justify-center overflow-hidden transition-[max-height] duration-500 ease-in-out`}
      style={{ maxHeight: fadeIn ? "150px" : "0px" }}
    >
      <button
        onClick={handleClick}
        disabled={!hasSelection}
        className={`btn btn-correct my-6 transition-all duration-500 ${
          fadeIn
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-90 -translate-y-4"
        } ${!hasSelection ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        Play
      </button>
    </div>
  );
}
