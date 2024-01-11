import "../../App.css";
import { useParams } from "react-router-dom";

function Subject() {
  const { nameofsubject } = useParams();
  return (
    <div className="App">
      <h1> {nameofsubject} </h1>
    </div>
  );
}

export default Subject;
