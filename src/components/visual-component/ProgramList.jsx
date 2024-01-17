import "../../App.css";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import { useEffect, useState } from "react";
import axios from "axios";
const apiUrl = process.env.REACT_APP_API_URL;

function ProgramList() {
  const [listofProgrammes, setListofProgrammes] = useState();
  useEffect(() => {
    async function getData() {
      await axios
        .get(`${apiUrl}/study-programme/list`)
        .then((response) => {
          setListofProgrammes(response.data);
          console.log(response.data);
        });
    }
    getData();
  }, []);
  return (
    <div className="App">
      <div className="container text-center">
        <div className="row">
          <div className="col">
            <p className="fs-2 fw-bold text-white bg-dark bg-gradient">
              Programmes
            </p>
          </div>
        </div>
        <div className="row row-cols-2">
          {listofProgrammes?.map((program) => (
            <div className="" key={program._id}>
              <Link to={"/program/" + program._id}>
                <h2>{program.name}</h2>
              </Link>
              <p> {program.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProgramList;
