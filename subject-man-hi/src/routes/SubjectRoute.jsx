import "bootstrap/dist/css/bootstrap.css";
import React from "react";
import Navbar from "../components/home/navbar";
import SearchBox from "../components/home/search-box";
import List from "../components/home/SubjectList";

export default function SubjectRoute() {
  return (
    <div className="listOfSubjects">
      <SearchBox />
      <List />
    </div>
  );
}
