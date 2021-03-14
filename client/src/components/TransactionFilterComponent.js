import React, { Component } from "react";
import classNames from "classnames";
import { Button, Collapse, NavItem, NavLink , Row , Label , Form, Col , Input , FormGroup} from "reactstrap";
import Checkbox from "../components/Checkbox"
import { Link, Redirect } from "react-router-dom";
import {find} from "../api/api-trans"
const checktype = [
    {
      name: 'credit',
      key: 'credit',
      label: 'credit',
    },
    {
      name: 'debit',
      key: 'debit',
      label: 'debit',
    }
];

const checketype = [
    {
      name: 'vendor',
      key: 'vendor',
      label: 'vendor',
    },
    {
      name: 'customer',
      key: 'customer',
      label: 'customer',
    }
];

const checkstatus = [
    {
      name: 'pending',
      key: 'pending',
      label: 'pending',
    },
    {
      name: 'paid',
      key: 'paid',
      label: 'paid',
    }
];

const checkmode = [
    {
      name: 'cash',
      key: 'cash',
      label: 'cash',
    },
    {
      name: 'credit-card',
      key: 'credit-card',
      label: 'credit card',
    },
    {
        name: 'debit-card',
        key: 'debit-card',
        label: 'debit card',
    },
    {
        name: 'upi',
        key: 'upi',
        label: 'upi',
    }
];

class SubMenu extends Component{
    
    constructor(props){
        super(props);
        this.state={
            collapsed:'true',
            tType: new Map(),
            tMode: new Map(),
            tStatus: new Map(),
            sAmount: '',
            eAmount:'',
            sDate:'',
            eDate:'',
            eType: new Map(),
           
        }
        this.toggle=this.toggle.bind(this);
        this.handletTypeChange = this.handletTypeChange.bind(this);
        this.handletModeChange = this.handletModeChange.bind(this);
        this.handleeTypeChange = this.handleeTypeChange.bind(this);
        this.handletStatusChange = this.handletStatusChange.bind(this);
        this.handleClick=this.handleClick.bind(this);
    }
    toggle()
    {
        this.setState({
            collapsed:!this.state.collapsed
        })
    }
    handletTypeChange(e) {
        const item = e.target.name;
        const isChecked = e.target.checked;
        this.setState(prevState => ({ tType: prevState.tType.set(item, isChecked)}));
    }
    handletModeChange(e) {
        const item = e.target.name;
        const isChecked = e.target.checked;
        this.setState(prevState => ({ tMode: prevState.tMode.set(item, isChecked)}));
    }
    handletStatusChange(e) {
        const item = e.target.name;
        const isChecked = e.target.checked;
        this.setState(prevState => ({ tStatus: prevState.tStatus.set(item, isChecked)}));
    }
    handleeTypeChange(e) {
        const item = e.target.name;
        const isChecked = e.target.checked;
        this.setState(prevState => ({ eType: prevState.eType.set(item, isChecked)}));
    }
    handleInputChange=(event)=>
    {
        const target = event.target;
        const value = target.value;
        const name=target.name;
        this.setState({[name]:value})
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
    generateurlval(data,val)
    {
        if(!data)
        {
            return '';
        }
        var part="";
        part=part+"&"+val+"="+data
        return part;
    }
    handleClick(e)
    {
        
        const url=this.generateurlmap(this.state.tType,"tType")
                  +this.generateurlmap(this.state.eType,"eType")
                  +this.generateurlmap(this.state.tMode,"tMode")
                  +this.generateurlmap(this.state.tStatus,"tStatus")
                  +this.generateurlval(this.state.sAmount,"sAmount")
                  +this.generateurlval(this.state.eAmount,"eAmount")
                  +this.generateurlval(this.state.sDate,"sDate")
                  +this.generateurlval(this.state.eDate,"eDate")
       
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
    render()
    {
       
        return (
            
            <div>
              <NavItem
                onClick={this.toggle}
                className={classNames({ "menu-open": !this.state.collapsed })}
              >
                <NavLink tag={Link} to="/showtransaction" className="ml-4">
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
                    <br></br>
                    <Row className="ml-2 mt-2">
                        Transaction Type
                    </Row>
                    
                    <Row className="ml-3">
                        {
                        checktype.map(item => (
                            <Label className="mr-4" key={item.key}>
                            <Checkbox name={item.name} checked={this.state.tType.get(item.name)} onChange={this.handletTypeChange} />
                            {"  "+item.label}
                            </Label>
                        ))
                        }
                    </Row>

                    <Row className="ml-2 mt-2">
                         Mode
                    </Row>
                    
                    <Row className="ml-3">
                        {
                        checkmode.map(item => (
                            <Label className="mr-3" key={item.key}>
                            <Checkbox name={item.name} checked={this.state.tMode.get(item.name)} onChange={this.handletModeChange} />
                            {"  "+item.label}
                            </Label>
                        ))
                        }
                    </Row>

                    <Row className="ml-2 mt-2">
                        Status 
                    </Row>
                    
                    <Row className="ml-3">
                        {
                        checkstatus.map(item => (
                            <Label className="mr-4" key={item.key}>
                            <Checkbox name={item.name} checked={this.state.tStatus.get(item.name)} onChange={this.handletStatusChange} />
                            {"  "+item.label}
                            </Label>
                        ))
                        }
                    </Row>
                    
                    <Form onChange={this.handleInputChange}>
                        <span className="ml-2">Amount</span>
                        <FormGroup row>
                            <Label htmlFor="sAmount" md={2} className="ml-4">From</Label>
                            <Col md={5}>
                                <Input type="number" id="sAmount" name="sAmount"
                                placeholder="Lower" value={this.state.sAmount} 
                                />
                            </Col>
                        </FormGroup>

                        <FormGroup row>
                            <Label htmlFor="eAmount" md={2} className="ml-4">To</Label>
                            <Col md={5}>
                                <Input type="number" id="eAmount" name="eAmount"
                                placeholder="High" value={this.state.eAmount} 
                                />
                            </Col>
                        </FormGroup>
                    </Form>

                    <Form onChange={this.handleInputChange}>
                        <span className="ml-2">Date</span>
                        <FormGroup row>
                            <Label htmlFor="sDate" md={2} className="ml-4">From</Label>
                            <Col md={8}>
                                <Input type="date" id="sDate" name="sDate"
                                placeholder="From" value={this.state.sDate} 
                                />
                            </Col>
                        </FormGroup>

                        <FormGroup row>
                            <Label htmlFor="eDate" md={2} className="ml-4">To</Label>
                            <Col md={8}>
                                <Input type="date" id="eDate" name="eDate"
                                placeholder="To" value={this.state.eDate} 
                                />
                            </Col>
                        </FormGroup>
                    </Form>
                    
                    <Row className="ml-2 mt-2">
                        Entity Type
                    </Row>
                    
                    <Row className="ml-3">
                        {
                        checketype.map(item => (
                            <Label className="mr-4" key={item.key}>
                            <Checkbox name={item.name} checked={this.state.eType.get(item.name)} onChange={this.handleeTypeChange} />
                            {"  "+item.label}
                            </Label>
                        ))
                        }
                    </Row>

                    <Row className="ml-4">
                        <Button color="primary" onClick={this.handleClick}>
                          Show Transactions
                        </Button>
                   </Row>
                </div>
              </Collapse>
            </div>
          );
    }

}

export default SubMenu;
