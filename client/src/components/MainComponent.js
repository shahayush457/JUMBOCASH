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
import Entities from "./EntitiesDisplayComponent";
class Main extends Component {

    constructor(props){
      super(props);
      this.state={
        sidebarIsOpen:true,
        entities:[]
      }
      this.setEntities=this.setEntities.bind(this);
      this.toggleSidebar=this.toggleSidebar.bind(this);
    }
    toggleSidebar()
    {
      this.setState({
        sidebarIsOpen:!this.state.sidebarIsOpen
      })
    }
    setEntities(updatedentities)
    {
      this.setState({
        entities:updatedentities
      })
      console.log(this.state);
    }
    render() 
    {
      return (
        <div className="App wrapper">
          <SideBar setEntities={this.setEntities} toggle={this.toggleSidebar} isOpen={this.state.sidebarIsOpen} />
          <Container
            fluid
            className={classNames("content", { "is-open": this.state.sidebarIsOpen })}
          >
            <Header toggleSidebar={this.toggleSidebar}/>
            <Switch>
                <Route
                  exact path='/'
                  component={() => <Entities entities={this.state.entities} />}
                />
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