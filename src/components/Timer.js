import { useEffect } from "react";

const Timer = ({ seconds, dispatch }) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  useEffect(() => {
    const interval = setInterval(() => dispatch({ type: "timerQuiz" }), 1000);

    return () => clearInterval(interval);
  }, [dispatch]);

  return (
    <div className="timer">
      {mins < 10 && "0"}
      {mins}:{secs < 10 && "0"}
      {secs}
    </div>
  );
};

export default Timer;
