import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import Register from "../components/RegisterComponent";
import Login from "../components/LoginComponent";
import AddEntity from "./EntityAddComponent";
import Dashboard from "./Dashboard";
import AddTransaction from "./TransactionAddComponent";
import Entities from "./EntitiesDisplayComponent";
import Transactions from "./transactions";
import EditEntity from "./EditEntity";
import EditTransaction from "./EditTransaction";
import Insights from "./Insights"
import Report from "./Report";
import MonthReport from './MonthReport'


class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sidebarIsOpen: false,
      entities: [],
      trans: [],
    };
    this.setEntities = this.setEntities.bind(this);
    this.setTrans = this.setTrans.bind(this);
    this.toggleSidebar = this.toggleSidebar.bind(this);
  }
  

  toggleSidebar() {
    this.setState({
      sidebarIsOpen: !this.state.sidebarIsOpen
    });
  }
  setEntities(updatedentities) {
    this.setState({
      entities: updatedentities
    });
  }
  setTrans(updatedtrans) {
    this.setState({
      trans: updatedtrans
    });
  }
  render() {
    return (
      <div>
        <Switch>
          <Route exact path="/" component={() => <Dashboard />} />
          <Route
            exact
            path="/showtransaction"
            component={() => <Transactions transactions={this.state.trans} />}
          />
          <Route exact path="/insights" component={Insights} />
          <Route exact path="/showentities" component={Entities} />
          <Route exact path="/transaction" component={AddTransaction} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/entity" component={AddEntity} />
          <Route exact path="/report"  component={Report} />
          <Route exact path="/month"  component={MonthReport} />
          <Route exact path="/entity/edit/:entityId" component={EditEntity} />
          <Route
            exact
            path="/transaction/edit/:transId"
            component={EditTransaction}
          />
        </Switch>
      </div>
    );
  }
}
export default Main;
