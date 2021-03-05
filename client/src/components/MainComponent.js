import React, { Component } from "react";
import { Switch, Route, Redirect, withRouter } from "react-router-dom";
import Header from "../components/HeaderComponent"
import Register from "../components/RegisterComponent"
import Login from "../components/LoginComponent"
class Main extends Component {
   
    render() 
    {
      return (
        <div>
            <Header/>
            <Switch>
                <Route exact path='/register' component={Register}/>
                <Route exact path='/login' component={Login}/>
            </Switch>
        </div>
      );
    }
}
export default Main;