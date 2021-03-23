import React, { Component } from "react";
import { Switch, Route, BrowserRouter } from "react-router-dom";
import Header from "../components/HeaderComponent"
import Register from "../components/RegisterComponent"
import Login from "../components/LoginComponent"
import SideBar from "../components/SidebarComponent"
import classNames from "classnames";
import { Container } from "reactstrap";
import AddEntity from "./EntityAddComponent";
import EditEntity from "./EditEntityComponent"
import UserOverall from "./UserFrontComponent";
import AddTransaction from "./TransactionAddComponent";
import Entities from "./EntitiesDisplayComponent";
import Transactions from "./TransactionDisplayComponent";

class Main extends Component {

    constructor(props){
      super(props);
      this.state={
        sidebarIsOpen:false,
        entities:[],
        trans:[],
      }
      this.setEntities=this.setEntities.bind(this);
      this.setTrans=this.setTrans.bind(this);
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
    }
    setTrans(updatedtrans)
    {
      this.setState({
        trans:updatedtrans
      })
    }
    render() 
    {
      return (
        <div className="App wrapper">
          <BrowserRouter>
          <SideBar setEntities={this.setEntities} setTrans={this.setTrans} toggle={this.toggleSidebar} isOpen={this.state.sidebarIsOpen} />
          <Container
            fluid
            className={classNames("content", { "is-open": this.state.sidebarIsOpen })}
          >
            <Header toggleSidebar={this.toggleSidebar}/>
            
            <Switch>
                <Route
                  exact path='/'
                  component={() => <UserOverall/>}
                />  
                <Route
                  exact path='/showtransaction'
                  component={() => <Transactions toggleSidebar={this.toggleSidebar} transactions={this.state.trans} />}
                />
                 <Route
                  exact path='/showentities'
                  component={() => {
                                      return <Entities toggleSidebar={this.toggleSidebar} entities={this.state.entities}/>
                                  }
                            }
                />
                <Route exact path='/transaction' toggleSidebar={this.toggleSidebar} component={AddTransaction}/>
                <Route exact path='/register' component={Register}/>
                <Route exact path='/login' component={Login}/>
                <Route exact path='/entity' toggleSidebar={this.toggleSidebar} component={AddEntity}/>
                <Route exact path='/entity/edit/:entityId' toggleSidebar={this.toggleSidebar} component={EditEntity}/>
            </Switch>
          </Container>
          </BrowserRouter>
        </div>
      );
    }
}
export default Main;