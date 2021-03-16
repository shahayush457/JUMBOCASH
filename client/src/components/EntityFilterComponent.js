import React, { Component } from "react";
import classNames from "classnames";
import {Row,
        Collapse, 
        NavItem, 
        NavLink,
        Button,
        Label, 
        Input,
        FormGroup} from "reactstrap";
import Checkbox from "../components/Checkbox"
import { find } from "../api/api-entities";
import { Link } from "react-router-dom";
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
    }

    this.toggle=this.toggle.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleClick=this.handleClick.bind(this);
  }
  generateurlmap(data,val)
  {
        var part="";
        for (let [key, value] of data) {
            if(value==true)
            {
                part=part+"&"+val+"="+key
            }
        }
        return part;
  }
  handleClick(e)
  {
    
    var url=this.generateurlmap(this.state.eType,"eType")
    url+='&orderBy=' + this.state.orderBy        
    e.preventDefault();
    const token=localStorage.getItem('jwtToken');

    find(url,token).then((data) => {
      if (data.error) {
          this.setState({ ...this.state})
      } else {
          this.props.setData(data);
      }
     
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
    
    return (
      <div>
        <NavItem
                onClick={this.toggle}

                className={classNames({ "menu-open": !this.state.collapsed })}
              >
                <NavLink tag={Link} to="/showentities" className="ml-4">
                  <i className="fa fa-arrow-down mr-1"></i> 
                  {this.props.title}
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

                  <FormGroup row>
                    <Label className="ml-5 col-3">
                        <Input
                        type="radio"
                        value="1"
                        checked={this.state.orderBy === "1"}
                        onChange={this.onRadioOrderChange}
                        />
                        Ascending
                    </Label>
                    <Label className="ml-5 col">
                        <Input
                        type="radio"
                        value="-1"
                        checked={this.state.orderBy === "-1"}
                        onChange={this.onRadioOrderChange}
                        />
                        Descending
                      </Label>
                  </FormGroup >
                  
                  <Row className="ml-4">
                    <Button color="light btn-sm" onClick={this.handleClick}>
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
