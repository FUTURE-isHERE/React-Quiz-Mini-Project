function Finish({ points, totalPoints, highestScore, dispatch }) {
  const percentage = Math.round((points / totalPoints) * 100);

  let emoji;
  if (percentage === 100) emoji = "🥇";
  if (percentage >= 80 && percentage < 100) emoji = "🎉";
  if (percentage >= 50 && percentage < 80) emoji = "🙃";
  if (percentage >= 0 && percentage < 50) emoji = "🤨";
  if (percentage === 0) emoji = "🤦‍♂️";

  return (
    <>
      <p className="result">
        {emoji} You got <strong>{points}</strong> out of{" "}
        <strong>{totalPoints}</strong> ({Math.ceil(percentage)}%)
      </p>

      <p className="highscore">(Highest score: {highestScore})</p>

      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "restart" })}
      >
        Restart the Quiz
      </button>
    </>
  );
}

export default Finish;
