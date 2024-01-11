import 'bootstrap/dist/css/bootstrap.css';
import React from "react";

export default function Navbar(props) {
  return (
    <div>
      <nav className="navbar bg-body-tertiary">
        <div className="container-fluid">
          <form className="d-flex" role="search">
              {props.permissions.includes('create:programmes') && (
                  <div className="row">
                      <div className="col">
                          <button onClick={props.onCreate} className="btn btn-success ml-auto" type="button">Add programme</button>
                      </div>
                  </div>
              )}
          </form>
        </div>
      </nav>
    </div>
  )
}