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
  const [token,setToken] = useState()
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
  useEffect(()=>
  { 
    getAccessTokenSilently().then((val)=>
    {
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
        for(let sub in subjectResponse)
        {
            for(let r in response.data.result.subjects)
            {
              if(response.data.result.subjects[r]._id === subjectResponse[sub]._id)
              {
                new_subjects["year"+response.data.result.subjects[r].year].push(subjectResponse[sub]);
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
              {subjectsByYear.year1.map((subject) => (
                <SubjectBlock methodToRemove={removeItem} subject={subject} key={subject._id} />
              ))}
            </p>
          </div>
          <div className="col">
            <p className="fs-4 fw-bold p-3 mb-2 bg-secondary text-white">
              Second Year
            </p>
            <p className="fs-8 p-3 mb-2 bg-body-secondary">
              {subjectsByYear.year2.map((subject) => (
                <SubjectBlock methodToRemove={removeItem} subject={subject} key={subject._id} />
              ))}
            </p>
          </div>
          <div className="col">
            <p className="fs-4 fw-bold p-3 mb-2 bg-secondary text-white">
              Third Year
            </p>
            <p className="fs-8 p-3 mb-2 bg-body-secondary">
              {subjectsByYear.year3.map((subject) => (
                <SubjectBlock methodToRemove={removeItem} subject={subject} key={subject._id} />
              ))}
            </p>
          </div>
          <div className="col">
            <p className="fs-4 fw-bold p-3 mb-2 bg-secondary text-white">
              Fourth Year
            </p>
            <p className="fs-8 p-3 mb-2 bg-body-secondary">
              {subjectsByYear.year4.map((subject) => (
                <SubjectBlock methodToRemove={removeItem} subject={subject} key={subject._id} />
              ))}
            </p>
          </div>
        </div>
      </div>

      {isAuthenticated && <Button onClick={() => { setShowEditModal(true) }}>Update programme</Button>}
  
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
