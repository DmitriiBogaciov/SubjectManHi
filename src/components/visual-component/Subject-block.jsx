import { Link } from "react-router-dom";
import "../../css/subjectblock.css";
function SubjectBlock(props) {
  return (
    <div key={props.subject._id}>
      <Link to={"/subject/" + props.subject._id}>
        <h4>{props.subject.name}</h4>
      </Link>
      <p>{props.subject.description}</p>
      <button onClick={() => props.methodToRemove(props.subject._id)}>
        Odebrat
      </button>
    </div>
  );
}

export default SubjectBlock;
