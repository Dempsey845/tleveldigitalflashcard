import { useEffect, useState } from "react";
import "./styles/PlayButton.css";

export default function PlayButton({
  hasSelection,
  startGame,
  setPlaying,
  show,
  setGameIsStarting,
}) {
  const [fadeIn, setFadeIn] = useState(false);
  const [visible, setVisible] = useState(false);

  // Handle fade animation
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
      className="btn-container"
      style={{ maxHeight: fadeIn ? "150px" : "0px" }}
    >
      <button
        onClick={handleClick}
        disabled={!hasSelection}
        className={`btn-play
          ${fadeIn ? "btn-no-fade" : "btn-fade"}
          ${!hasSelection && "btn-disabled"}
        `}
      >
        Play
      </button>
    </div>
  );
}
