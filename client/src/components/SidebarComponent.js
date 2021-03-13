import React,{Component} from "react";
import { NavItem, 
         NavLink, 
         Nav } from "reactstrap";
import classNames from "classnames";
import { Link } from "react-router-dom";
import auth from "../api/auth-helper"
import EntityFilter from "../components/EntityFilterComponent";

class SideBar extends Component {

  constructor(props){
    super(props)
  }
  render()
  {
    return(
        <div className={classNames("sidebar", { "is-open": this.props.isOpen })}>
        <div className="sidebar-header">
          <span color="info" onClick={this.props.toggle} style={{ color: "#fff" }}>
            &times;
          </span>
          <h3>Cash Flow</h3>
        </div>
        <div className="side-menu">
          <Nav vertical className="list-unstyled pb-3">
            <p className="ml-5">Dashboard</p> 
            {
              auth.isAuthenticated() && (
                  <NavItem>
                    <NavLink tag={Link} to={"/entity"}>
                      <span className="fa fa-plus ml-4 mr-2"/>
                      Add Entity
                    </NavLink>
                  </NavItem>
                )
            }
            
            <br></br>
            {
              auth.isAuthenticated() && (
                  <NavItem>
                    <NavLink tag={Link} to={"/transaction"}>
                      <span className="fa fa-plus ml-4 mr-2"/>
                      Add Transaction
                    </NavLink>
                  </NavItem>
                )
            }
            <br></br>
            {
              auth.isAuthenticated() && (
                    <EntityFilter setData={this.props.setEntities}  title="Entities"/>
                )
            }
            
          </Nav>
          
        </div>
      </div>
    )
  }
}

export default SideBar;
