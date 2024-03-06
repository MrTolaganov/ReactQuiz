const Progress = ({ numQuestions, idx, answer, points, maxPoints }) => (
  <header className="progress">
    <progress max={numQuestions} value={idx + +(answer !== null)} />
    <p>
      Question <strong>{idx + 1}</strong> {numQuestions}
    </p>
    <p>
      <strong>{points}</strong> / {maxPoints}
    </p>
  </header>
);

export default Progress;
