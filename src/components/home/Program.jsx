import { useEffect, useState } from "react";
import "../../App.css";
import "../../css/program.css";
import { useParams } from "react-router-dom";
import axios from "axios";
import SubjectBlock from "./Subject-block";
import { useAuth0 } from "@auth0/auth0-react";

function Program() {
  const { id } = useParams();
  const { getAccessTokenSilently } = useAuth0();
  const [dataOfSingleProgram, setDataOfSingleProgram] = useState();
  const [subjects, setSubjects] = useState();
  const [subjectsByYear, setSubjectsByYear] = useState({
    firstYear: [],
    secondYear: [],
    thirdYear: [],
  });

  async function removeItem(program_id) {
    const accessToken = await getAccessTokenSilently();
    const new_subjects = subjects.filter((subject) => subject._id !== program_id);
    await axios.put(
      `/study-programme/update/` + dataOfSingleProgram._id,
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
        const response = await axios.get(`/study-programme/get/${id}`);
        setDataOfSingleProgram(response.data.result);
        const ids = response.data.result.subjects
          .map((subject) => subject._id)
          .join(",");

        const subjectsResponse = await axios.get(`/subject/get/?subjectIds=${ids}`);
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
    <div className="App">
      <h1>{dataOfSingleProgram?.name}</h1>
      <p>{dataOfSingleProgram?.description}</p>
      <p>{dataOfSingleProgram?.degree} </p>
      <p>{dataOfSingleProgram?.language} </p>
      <div id="subjects-list">
        <h2> První ročník </h2>
        {subjectsByYear.firstYear.map((subject) => (
          <SubjectBlock methodToRemove={removeItem} subject={subject} key={subject._id} />
        ))}
        <h2> Druhý ročník </h2>
        {subjectsByYear.secondYear.map((subject) => (
          <SubjectBlock methodToRemove={removeItem} subject={subject} key={subject._id} />
        ))}
        <h2> Třetí ročník </h2>
        {subjectsByYear.thirdYear.map((subject) => (
          <SubjectBlock methodToRemove={removeItem} subject={subject} key={subject._id} />
        ))}
      </div>
    </div>
  );
}

export default Program;
