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

  SignOut()
  {
    auth.clearJWT();
    window.location.href = "/";
  }
  render() {
    return (
        <Navbar color="light"
        light
        className="navbar shadow-sm p-3 mb-5 bg-white rounded"
        expand="md">
            <Button color="primary" onClick={this.props.toggleSidebar}>
                <span class="fa fa-align-left"></span>
            </Button>
            <NavbarToggler onClick={this.toggleNav} />
            <Collapse isOpen={this.state.isNavOpen} navbar>
              <Nav navbar className="ml-auto">
                <NavItem>
                  <NavLink className="nav-link" to="/">
                    <span className="fa fa-home fa-lg" /> Dashboard
                  </NavLink>
                </NavItem>
                  {
                    !auth.isAuthenticated() && (
                        <NavItem>
                          <NavLink className="nav-link" to="/login">
                            <span className="fa fa-sign-in fa-lg" /> Login
                          </NavLink>
                        </NavItem>
                      )
                  }
                  {
                    !auth.isAuthenticated() && (
                        <NavItem>
                          <NavLink className="nav-link" to="/register">
                            <span className="fa fa-sign-in fa-lg" /> Register
                          </NavLink>
                        </NavItem>
                      )
                  }
                  {
                    auth.isAuthenticated() && (
                        <NavItem>
                          <NavLink className="nav-link" to="/">
                            <span className="fa fa-user fa-lg" /> {auth.isAuthenticated().name}
                          </NavLink>
                        </NavItem>
                      )
                  }
                  {
                    auth.isAuthenticated() && (
                        <NavItem>
                          <Button color="primary" to="/signout" onClick={this.SignOut}>
                            <span className="fa fa-sign-out fa-lg" /> Log Out
                          </Button>
                        </NavItem>
                      )
                  }
              </Nav>
            </Collapse>
        </Navbar>
    );
  }
}

export default Header;