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

  useEffect(() => {
    let timeout;
    if (show) {
      setVisible(true);
      timeout = setTimeout(() => setFadeIn(true), 10);
    } else {
      setFadeIn(false);
      timeout = setTimeout(() => setVisible(false), 500);
    }

    return () => clearTimeout(timeout);
  }, [show]);

  const handleClick = () => {
    if (!hasSelection) return;

    setFadeIn(false);
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
        className={`btn btn-correct my-6 transition-all duration-500
          ${
            fadeIn
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-90 -translate-y-4"
          }
          ${!hasSelection ? "opacity-50 cursor-not-allowed" : ""}
          text-lg md:text-2xl px-6 md:px-12 py-3 md:py-6
        `}
      >
        Play
      </button>
    </div>
  );
}
