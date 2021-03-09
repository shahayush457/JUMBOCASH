import React from "react";
import { NavItem, NavLink, Nav, Button } from "reactstrap";
import classNames from "classnames";
import { Link } from "react-router-dom";


const SideBar = ({ isOpen, toggle }) => (
    <div className={classNames("sidebar", { "is-open": isOpen })}>
      <div className="sidebar-header">
        <span color="info" onClick={toggle} style={{ color: "#fff" }}>
          &times;
        </span>
        <h3>Cash Flow</h3>
      </div>
      <div className="side-menu">
        <Nav vertical className="list-unstyled pb-3">
          <p>Dashboard</p>
          <NavItem>
            <NavLink tag={Link} to={"/entity"}>
              <span className="fa fa-plus ml-4 mr-2"/>
              Add Entity
            </NavLink>
          </NavItem>
          <br></br>
          <NavItem>
            <NavLink tag={Link} to={"/transaction"}>
              <span className="fa fa-plus ml-4 mr-2"/>
              Add Transaction
            </NavLink>
          </NavItem>
        </Nav>
        
      </div>
    </div>
);
export default SideBar;
