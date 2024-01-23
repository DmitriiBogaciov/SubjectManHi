import { Link } from "react-router-dom";
import "../../css/subjectblock.css";
function SubjectBlock(props) {
  return (
    <Link className="no-underline" to={"/subject/" + props.subject._id}>
      <div className="shadow-lg bg-slate-800 rounded-md p-4 text-white" key={props.subject._id}>
        <h4 className="uppercase font-thin border-b-[1px] p-2">{props.subject.name}</h4>
        <p>{props.subject.description}</p>
      </div>
    </Link>
  );
}

export default SubjectBlock;
