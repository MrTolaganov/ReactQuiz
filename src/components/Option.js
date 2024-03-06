const Option = ({ question, answer, dispatch }) => {
  const { options, correctOption } = question;
  const hasAnswered = answer !== null;

  return (
    <div className="options">
      {options.map((option, idx) => (
        <button
          className={`btn btn-option ${answer === idx ? "answer" : ""} ${
            hasAnswered ? (correctOption === idx ? "correct" : "wrong") : ""
          }`}
          key={option}
          disabled={hasAnswered}
          onClick={() => dispatch({ type: "newAnswer", payload: idx })}
        >
          {option}
        </button>
      ))}
    </div>
  );
};

export default Option;
