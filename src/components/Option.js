function Option({ question, dispatch, answer }) {
  const hasAnswered = answer !== null;

  return (
    <div className="options">
      {question.options.map((option, index) => {
        const isCorrect =
          index === question.correctOption ? "correct" : "wrong";

        return (
          <button
            key={option}
            className={`btn btn-option ${index === answer ? "answer" : ""} ${
              hasAnswered ? isCorrect : ""
            }`}
            disabled={hasAnswered}
            onClick={() => dispatch({ type: "newAnswer", payload: index })}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

export default Option;
