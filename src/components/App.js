import { useEffect, useReducer } from "react";
import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import StartScreen from "./StartScreen";
import Error from "./Error";
import Question from "./Question";
import NextButton from "./NextButton";
import Progress from "./Progress";
import Finish from "./Finish";
import Footer from "./Footer";
import Timer from "./Timer";

const SEC_PER_QUESTION = 15;

const initialState = {
  questions: [],

  // loading, error, ready, active, finished
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
  highestScore: 0,
  timer: null,
};

const reducer = (state, action) => {
  let question;
  switch (action.type) {
    case "dataRecieved":
      return { ...state, questions: action.payload, status: "ready" };
    case "dataFailed":
      return { ...state, status: "error" };
    case "start":
      return { ...state, status: "active", timer: state.questions.length * SEC_PER_QUESTION };
    case "newAnswer":
      question = state.questions.at(state.index);
      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
      };
    case "addPoints":
      return { ...state, points: state.points + action.payload };
    case "nextQuestion":
      return { ...state, index: state.index + 1, answer: null };
    case "finish":
      return { ...state, status: "finished", highestScore: Math.max(state.points, state.highestScore) };
    case "restart":
      return {...initialState, questions: state.questions, status: "ready", highestScore: state.highestScore};
    case "tick":
      return { ...state, timer: state.timer - 1, status: state.timer === 0 ? "finished" : state.status };
    default:
      throw new Error("Unknown action");
  }
};

export default function App() {
  const [{ questions, status, index, answer, points, highestScore, timer}, dispatch] = useReducer(
    reducer,
    initialState
  );
  const numberOfQuestions = questions?.length;
  const totalPoints = questions?.reduce((prev, curr) => prev + curr.points, 0);

  useEffect(() => {
    fetch("http://localhost:5000/questions")
      .then((response) => response.json())
      .then((data) => {
        dispatch({ type: "dataRecieved", payload: data });
      })
      .catch((error) => {
        dispatch({ type: "dataFailed" });
      });
  }, []);

  return (
    <div className="app">
      <Header />

      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && (
          <StartScreen
            numberOfQuestions={numberOfQuestions}
            dispatch={dispatch}
          />
        )}
        {status === "active" && (
          <>
            <Progress
              index={index}
              numberOfQuestions={numberOfQuestions}
              points={points}
              answer={answer}
              totalPoints={totalPoints}
            />
            <Question
              question={questions[index]}
              dispatch={dispatch}
              answer={answer}
            />
            <Footer>
              <Timer dispatch={dispatch} timer={timer}/>
            <NextButton dispatch={dispatch} index={index} numberOfQuestions={numberOfQuestions}/>
            </Footer>
          </>
        )}
        {status === "finished" && (
          <Finish points={points} totalPoints={totalPoints} highestScore={highestScore} dispatch={dispatch}/>
        )}
      </Main>
    </div>
  );
}
