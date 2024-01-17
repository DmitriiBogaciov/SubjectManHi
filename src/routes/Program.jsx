import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { useParams } from "react-router-dom";
import axios from "axios";
import SubjectBlock from "../components/visual-component/Subject-block";
import { useAuth0 } from "@auth0/auth0-react";
import EditProgramModal from "../components/visual-component/edit-program";
import { Modal, Button, Form } from 'react-bootstrap';
const apiUrl = process.env.REACT_APP_API_URL;


function Program() {
  const { id } = useParams();
  const { getAccessTokenSilently, isAuthenticated, user } = useAuth0();
  const [dataOfSingleProgram, setDataOfSingleProgram] = useState();
  const [subjects, setSubjects] = useState();
  const [subjectsByYear, setSubjectsByYear] = useState({
    firstYear: [],
    secondYear: [],
    thirdYear: [],
  });
  const [showEditModal, setShowEditModal] = useState(false);

  async function removeItem(program_id) {
    const accessToken = await getAccessTokenSilently();
    const new_subjects = subjects.filter((subject) => subject._id !== program_id);
    await axios.put(
      `${apiUrl}/study-programme/update/` + dataOfSingleProgram._id,
      {
        subjects: new_subjects,
      },
      {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      }
    );
  }

  useEffect(() => {
    async function getData() {
      try {
        const response = await axios.get(`${apiUrl}/study-programme/get/${id}`);
        setDataOfSingleProgram(response.data.result);
        const ids = response.data.result.subjects
          .map((subject) => subject._id)
          .join(",");

        const subjectsResponse = await axios.get(`${apiUrl}/subject/get/?subjectIds=${ids}`);
        const new_subjects = {
          firstYear: [],
          secondYear: [],
          thirdYear: [],
        };
        setSubjects(response.data.result.subjects);

        subjectsResponse.data.result.forEach((subject) => {
          const year = response.data.result.subjects.find(
            (subject_real) => subject._id === subject_real._id
          ).year;
          switch (year) {
            case 1:
              new_subjects.firstYear.push(subject);
              break;
            case 2:
              new_subjects.secondYear.push(subject);
              break;
            case 3:
              new_subjects.thirdYear.push(subject);
              break;
            default:
              break;
          }
        });
        setSubjectsByYear(new_subjects);
      } catch (error) {
        console.error("Chyba:", error.message);
      }
    }

    getData();
  }, [id]);

  return (
    <div className="pt-3">
      <div className="container text-center">
        <div className="row">
          <div className="col">
            <p className="fs-2 fw-bold text-white bg-dark bg-gradient">
              {dataOfSingleProgram?.name}
            </p>
          </div>
        </div>
        <div className="row row-cols-2">
          <div className="col">
            <p className="fs-5 p-3 mb-2 bg-body-secondary">
              {dataOfSingleProgram?.description}
            </p>
          </div>
          <div className="col">
            <p className="fs-5 p-3 mb-2 bg-body-secondary">
              Degree: {dataOfSingleProgram?.degree} <br></br>
              Language: {dataOfSingleProgram?.language}
            </p>
          </div>
          <div className="col">
            <p className="fs-4 fw-bold p-3 mb-2 bg-secondary text-white">
              First Year
            </p>
            <p className="fs-8 p-3 mb-2 bg-body-secondary">
              {subjectsByYear.firstYear.map((subject) => (
                <SubjectBlock methodToRemove={removeItem} subject={subject} key={subject._id} />
              ))}
            </p>
          </div>
          <div className="col">
            <p className="fs-4 fw-bold p-3 mb-2 bg-secondary text-white">
              Second Year
            </p>
            <p className="fs-8 p-3 mb-2 bg-body-secondary">
              {subjectsByYear.secondYear.map((subject) => (
                <SubjectBlock methodToRemove={removeItem} subject={subject} key={subject._id} />
              ))}
            </p>
          </div>
          <div className="col">
            <p className="fs-4 fw-bold p-3 mb-2 bg-secondary text-white">
              Third Year
            </p>
            <p className="fs-8 p-3 mb-2 bg-body-secondary">
              {subjectsByYear.thirdYear.map((subject) => (
                <SubjectBlock methodToRemove={removeItem} subject={subject} key={subject._id} />
              ))}
            </p>
          </div>
        </div>
      </div>
      {isAuthenticated && <Button onClick={() => { setShowEditModal(true) }}>Update programme</Button>}
      <EditProgramModal
        show={showEditModal}
        handleClose={() => setShowEditModal(false)}
        data={dataOfSingleProgram}
        setData={setDataOfSingleProgram}
      ></EditProgramModal>
    </div>

  );
}

export default Program;
