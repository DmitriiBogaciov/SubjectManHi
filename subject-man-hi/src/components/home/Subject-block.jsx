import { Link } from "react-router-dom";
import "../../css/subjectblock.css";
function SubjectBlock(props) {
  return (
    <div id="subject-block" key={props.subject._id}>
      <Link to={"/subject/" + props.subject._id}>
        <h2>{props.subject.name}</h2>
      </Link>
      <p>{props.subject.description}</p>
      <button onClick={() => props.methodToRemove(props.subject._id)}>
        Odebrat
      </button>
    </div>
  );
}

export default SubjectBlock;
