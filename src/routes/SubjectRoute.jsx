import "bootstrap/dist/css/bootstrap.css";
import React from "react";
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
