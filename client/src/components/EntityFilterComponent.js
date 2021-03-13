import React, { Component, useState } from "react";
import classNames from "classnames";
import {Row,
        Collapse, 
        NavItem, 
        NavLink,
        Button,
        Label, 
        Input} from "reactstrap";
import Checkbox from "../components/Checkbox"
import { find } from "../api/api-entities";
const checkboxes = [
  {
    name: 'customer',
    key: 'customer',
    label: 'customer',
  },
  {
    name: 'vendor',
    key: 'vendor',
    label: 'vendor',
  }
];


class EntityFilter extends Component {

  constructor(props){
    super(props);

    this.state={
      entities:'',
      collapsed:true,
      orderBy:'1',
      eType: new Map(),
      limit:'',
      pageNo:'',
      openentity:''
    }

    this.toggle=this.toggle.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleClick=this.handleClick.bind(this);
  }

  handleClick(e)
  {
    this.setState({
      openentity:'true'
    })
    var etype;
    if(this.state.eType.get("customer")==true)
    etype="customer"
    if(this.state.eType.get("vendor")==true)
    etype="vendor"

    const urldata={
      orderBy: this.state.orderBy,
      eType:etype 
    }

    if((this.state.eType.get("customer")==true && this.state.eType.get("vendor")==true) || this.state.eType.size==0)
    delete urldata.eType

    const searchParams = new URLSearchParams(urldata);
    
    e.preventDefault();
    const token=localStorage.getItem('jwtToken');

    find(searchParams.toString(),token).then((data) => {
      if (data.error) {
          this.setState({ ...this.state})
      } else {
          this.props.setData(data);
      }
      console.log(this.state);
    })
  }

  handleChange(e) {
    const item = e.target.name;
    const isChecked = e.target.checked;
    this.setState(prevState => ({ eType: prevState.eType.set(item, isChecked)}));
  }

  toggle()
  {
    this.setState({
      collapsed:!this.state.collapsed
    })
  }

  onRadioOrderChange = (e) => {
        
    this.setState({
      orderBy: e.target.value
    });
  }
  render()
  {
    const { title, items } = this.props;
    return (
      <div>
        <NavItem
          onClick={this.toggle}
          className={classNames({ "menu-open": !this.state.collapsed })}
        >
          <NavLink className="ml-4">
          <i className="fa fa-arrow-down"></i> {title}
          </NavLink>
        </NavItem>
        <Collapse
          isOpen={!this.state.collapsed}
          navbar
          className={classNames("items-menu", { "mb-1": !this.state.collapsed })}
        >
                <div>
                  <Row className="ml-2 mt-2">
                      Entity Type
                  </Row>
                
                  <Row className="ml-3">
                    {
                      checkboxes.map(item => (
                        <Label className="mr-2" key={item.key}>
                          <Checkbox name={item.name} checked={this.state.eType.get(item.name)} onChange={this.handleChange} />
                          {"  "+item.name}
                        </Label>
                      ))
                    }
                  </Row>

                  <Row className="ml-2">
                      Order Names By
                  </Row>

                  <Row>
                    <Label className="ml-5">
                        <Input
                        type="radio"
                        value="1"
                        checked={this.state.orderBy === "1"}
                        onChange={this.onRadioOrderChange}
                        />
                        <span>Ascending</span>
                    </Label>
                    <Label className="ml-4">
                        <Input
                        type="radio"
                        value="-1"
                        checked={this.state.orderBy === "-1"}
                        onChange={this.onRadioOrderChange}
                        />
                        <span>Descending</span>
                      </Label>
                  </Row>
                  
                  <Row className="ml-4">
                    <Button color="primary" onClick={this.handleClick}>
                      Show Enitites
                    </Button>
                  </Row>
                </div>
        </Collapse>
      </div>
    );
  }
}

export default EntityFilter;
