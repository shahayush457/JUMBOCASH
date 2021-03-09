import React, { Component } from "react";
import { Switch, Route, Redirect, withRouter } from "react-router-dom";
import Header from "../components/HeaderComponent"
import Register from "../components/RegisterComponent"
import Login from "../components/LoginComponent"
import SideBar from "../components/SidebarComponent"
import classNames from "classnames";
import { Container } from "reactstrap";
import auth from "../api/auth-helper"
import AddEntity from "./EntityAddComponent";
import UserOverall from "./UserFrontComponent";
import AddTransaction from "./TransactionAddComponent";
class Main extends Component {

    constructor(props){
      super(props);
      this.state={
        sidebarIsOpen:true
      }
      this.toggleSidebar=this.toggleSidebar.bind(this);
    }
    toggleSidebar()
    {
      this.setState({
        sidebarIsOpen:!this.state.sidebarIsOpen
      })
    }
    render() 
    {
      return (
        <div className="App wrapper">
          <SideBar toggle={this.toggleSidebar} isOpen={this.state.sidebarIsOpen} />
          <Container
            fluid
            className={classNames("content", { "is-open": this.state.sidebarIsOpen })}
          >
            <Header toggleSidebar={this.toggleSidebar}/>
            <Switch>
                <Route exact path='/' component={UserOverall}/>
                <Route exact path='/transaction' component={AddTransaction}/>
                <Route exact path='/register' component={Register}/>
                <Route exact path='/login' component={Login}/>
                <Route exact path='/entity' component={AddEntity}/>
            </Switch>
          </Container>
        </div>
      );
    }
}
export default Main;