import "../../App.css";
import { Link } from "react-router-dom";
import { listOfSubjects } from "../mock-data/list-of-subjects";
import { studyProgrames } from "../mock-data/study-programes";
import "bootstrap/dist/css/bootstrap.css";

function SubjectList() {
  console.log(studyProgrames);
  console.log(listOfSubjects);
  return (
    <div className="App">
      <div class="container text-center">
        <div class="row">
          <div class="col">
            <p class="fs-2 fw-bold text-white bg-dark bg-gradient">
              Study subjects
            </p>
          </div>
        </div>
        <div class="row row-cols-2">
          {studyProgrames.map((program) => (
            <div key={program.id}>
              <h2>{program.name}</h2>
              {program.subjectIdList.map((program_subject_id) =>
                listOfSubjects
                  .filter(
                    (single_subject) => single_subject.id === program_subject_id
                  )
                  .map((subject) => (
                    <div key={subject.id} className="col">
                      <Link to={"/subject/" + subject.name}>
                        <p className="fs-4 fw-bold p-3 mb-2 bg-secondary text-white">
                          {subject.name}
                        </p>
                      </Link>
                      <p className="fs-8 p-3 mb-2 bg-body-secondary">
                        {subject.description}
                      </p>
                    </div>
                  ))
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SubjectList;
