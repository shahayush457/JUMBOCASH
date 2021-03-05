import React, { Component } from "react";
import {
  Navbar,
  NavbarBrand,
  Nav,
  NavbarToggler,
  Collapse,
  NavItem,
  Button
} from "reactstrap";
import { NavLink } from "react-router-dom";
import auth from "../api/auth-helper"

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isNavOpen: false
    };
    this.toggleNav = this.toggleNav.bind(this);
  }

  toggleNav() {
    this.setState({
      isNavOpen: !this.state.isNavOpen
    });
  }

  render() {
    return (
        <Navbar color='primary' dark expand="md">
            <NavbarBrand  href="/">
              CASH FLOW
            </NavbarBrand>
            <NavbarToggler className="ml-auto" onClick={this.toggleNav} />
            <div className="container-fluid">
            <Collapse isOpen={this.state.isNavOpen} navbar>
              <Nav navbar className="ml-1">
                <NavItem>
                  <NavLink className="nav-link" to="/">
                    <span className="fa fa-home fa-lg" /> Dashboard
                  </NavLink>
                </NavItem>
              </Nav>
              {
                !auth.isAuthenticated() && (<Nav navbar className="ml-auto">
                    <NavItem>
                      <NavLink className="nav-link" to="/login">
                        <span className="fa fa-sign-in fa-lg" /> Login
                      </NavLink>
                    </NavItem>
                  </Nav>)
              }
              {
                !auth.isAuthenticated() && (<Nav navbar className="ml-1">
                    <NavItem>
                      <NavLink className="nav-link" to="/register">
                        <span className="fa fa-sign-in fa-lg" /> Register
                      </NavLink>
                    </NavItem>
                  </Nav>)
              }
              {
                auth.isAuthenticated() && (<Nav navbar className="ml-auto">
                    <NavItem>
                      <NavLink className="nav-link" to="/">
                        <span className="fa fa-user fa-lg" /> {auth.isAuthenticated().name}
                      </NavLink>
                    </NavItem>
                  </Nav>)
              }
              {
                auth.isAuthenticated() && (<Nav navbar className="ml-1">
                    <NavItem>
                      <NavLink className="nav-link" to="/signout">
                        <span className="fa fa-sign-out fa-lg" /> Log Out
                      </NavLink>
                    </NavItem>
                  </Nav>)
              }
            </Collapse>
          </div>
        </Navbar>
    );
  }
}

export default Header;