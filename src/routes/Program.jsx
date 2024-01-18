import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { useParams } from "react-router-dom";
import axios from "axios";
import SubjectBlock from "../components/visual-component/Subject-block";
import { useAuth0 } from "@auth0/auth0-react";
import { ToastContainer } from "react-toastify";
import { Button } from 'react-bootstrap';
import ProgrammeModalData from "../components/data-component/programme-modal-data";
const apiUrl = process.env.REACT_APP_API_URL;


function Program() {
  const { id } = useParams();
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const [token, setToken] = useState()
  const [dataOfSingleProgram, setDataOfSingleProgram] = useState();
  const [subjects, setSubjects] = useState();
  const [subjectsByYear, setSubjectsByYear] = useState({
    year1: [],
    year2: [],
    year3: [],
    year4: [],
  });
  const [showEditModal, setShowEditModal] = useState(false);

  async function removeItem(program_id) {
    setToken(await getAccessTokenSilently());
    const new_subjects = subjects.filter((subject) => subject._id !== program_id);
    await axios.put(
      `${apiUrl}/study-programme/update/` + dataOfSingleProgram._id,
      {
        subjects: new_subjects,
      },
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
  }
  useEffect(() => {
    getAccessTokenSilently().then((val) => {
      setToken(val);
    })
    
  },[getAccessTokenSilently])

  useEffect(() => {
    async function getData() {
      try {
        const response = await axios.get(`${apiUrl}/study-programme/get/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        setDataOfSingleProgram(response.data.result);
     

        let subjectResponse = await (await axios.get(`${apiUrl}/subject/list`)).data.result

        //const subjectsResponse = await axios.get(`${apiUrl}/subject/get/?subjectIds=${ids}`);
        const new_subjects = {
          year1: [],
          year2: [],
          year3: [],
          year4: [],
        };
        let subjectsToShow = [];
        for (let sub in subjectResponse) {
          for (let r in response.data.result.subjects) {
            if (response.data.result.subjects[r]._id === subjectResponse[sub]._id) {
              new_subjects["year" + response.data.result.subjects[r].year].push(subjectResponse[sub]);
            }
          }
        }
        setSubjects(response.data.result.subjects);

        setSubjectsByYear(new_subjects);
      } catch (error) {
        console.error("Chyba:", error.message);
      }
    }

    getData();
  }, [id, token]);

  return (
    <div className="pt-3">
      <div className="container text-center bg-slate-600 p-3">
        <div className="">
          <p className="text-4xl text-white uppercase font-thin p-4">
            {dataOfSingleProgram?.name}
          </p>
        </div>
        <div className="grid grid-cols-1 mb-4 text-white text-xl bg-slate-700 p-4 rounded-md">
          <p className="mr-4 uppercase font-thin text-left">Description: </p>
          <p className="text-left">
            {dataOfSingleProgram?.description}
          </p>
        </div>
        <div className="grid grid-cols-1 mb-4 text-white text-xl bg-slate-700 p-4 rounded-md">
          <p className="text-left">
            <span className="mr-4 uppercase font-thin"> Degree:</span> {dataOfSingleProgram?.degree} <br></br>
          </p>
          <p className="text-left">
            <span className="mr-4 uppercase font-thin text-left">Language:</span> {dataOfSingleProgram?.language}
          </p>
        </div>
        <div className="mb-4 bg-slate-700 p-4 rounded-md">
          <h3 className="text-left text-white">Subjects:</h3>
          <div className="p-2 text-left">
            <p className="fs-4 fw-bold p-3 mb-2 text-white">
              First Year
            </p>
            <p className="">
              {subjectsByYear.year1.map((subject) => (
                <div className="mb-2">
                  <SubjectBlock methodToRemove={removeItem} subject={subject} key={subject._id} />
                </div>
              ))}
            </p>
          </div>
          <div className="p-2 text-left">
            <p className="fs-4 fw-bold p-3 mb-2 text-white">
              Second Year
            </p>
            <p className="">
              {subjectsByYear.year2.map((subject) => (
                <div className="mb-2">
                  <SubjectBlock methodToRemove={removeItem} subject={subject} key={subject._id} />
                </div>
              ))}
            </p>
          </div>
          <div className="p-2 text-left">
            <p className="fs-4 fw-bold p-3 mb-2 text-white">
              Third Year
            </p>
            <p className="">
              {subjectsByYear.year3.map((subject) => (
                <div className="mb-2">
                  <SubjectBlock methodToRemove={removeItem} subject={subject} key={subject._id} />
                </div>
              ))}
            </p>
          </div>
          <div className="p-2 text-left">
            <p className="fs-4 fw-bold p-3 mb-2 text-white">
              Fourth Year
            </p>
            <p className="">
              {subjectsByYear.year4.map((subject) => (
                <div className="mb-2">
                  <SubjectBlock methodToRemove={removeItem} subject={subject} key={subject._id} />
                </div>
              ))}
            </p>
          </div>
        </div>
        {isAuthenticated && <Button onClick={() => { setShowEditModal(true) }}>Update programme</Button>}
      </div>


      <ProgrammeModalData
        show={showEditModal}
        handleClose={() => setShowEditModal(false)}
        studyProgramme={dataOfSingleProgram}
        mode={"update"}
        token={token} >
      </ProgrammeModalData>

      <ToastContainer></ToastContainer>
    </div>

  );
}

export default Program;
