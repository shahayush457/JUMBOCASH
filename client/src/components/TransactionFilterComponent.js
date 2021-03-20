import React, { Component } from "react";
import classNames from "classnames";
import { Button, Collapse, NavItem, NavLink , Row , Label , Form, Col , Input , FormGroup} from "reactstrap";
import Checkbox from "../components/Checkbox"
import { Link } from "react-router-dom";
import {find} from "../api/api-trans"
import {read} from '../api/api-entities';
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
            orderBy:'-1',
            sortBy:'createdAt',
            entityId:'',
            entities:[]
           
        }
        this.toggle=this.toggle.bind(this);
        this.handletTypeChange = this.handletTypeChange.bind(this);
        this.handletModeChange = this.handletModeChange.bind(this);
        this.handleeTypeChange = this.handleeTypeChange.bind(this);
        this.handletStatusChange = this.handletStatusChange.bind(this);
        this.onRadioOrderChange = this.onRadioOrderChange.bind(this);
        this.onRadioSortChange = this.onRadioSortChange.bind(this);
        this.handleEntityChange=this.handleEntityChange.bind(this);
        this.handleClick=this.handleClick.bind(this);
    }
    componentDidMount()
    {
        const token=localStorage.getItem('jwtToken');
        read(token).then((data) => {
            //console.log(data);
            
            if (data.errors) {
                this.setState({ ...this.state,error:data.errors[0].msg})
            } else {
                this.setState({
                   entities:data
                })
            }
            //console.log(this.state);
        })
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
    handleEntityChange(e) {

        this.setState({entityId:e.target.value});
        
    }
    onRadioOrderChange = (e) => {
        
        this.setState({
          orderBy: e.target.value
        });
    }
    onRadioSortChange = (e) => {
       
        this.setState({
          sortBy: e.target.value
        });
    }
    handleClick(e)
    {
        
        var url=this.generateurlmap(this.state.tType,"tType")
                  +this.generateurlmap(this.state.eType,"eType")
                  +this.generateurlmap(this.state.tMode,"tMode")
                  +this.generateurlmap(this.state.tStatus,"tStatus")
                  +this.generateurlval(this.state.sAmount,"sAmount")
                  +this.generateurlval(this.state.eAmount,"eAmount")
                  +this.generateurlval(this.state.sDate,"sDate")
                  +this.generateurlval(this.state.eDate,"eDate")
                  +'&orderBy=' + this.state.orderBy
                  +'&sortBy=' + this.state.sortBy
        if(this.state.entityId)
        {
            url+='&entityId=' + this.state.entityId
        }
        //console.log(url);
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
                    <Row id="f2" className="ml-2 mt-2">
                         Type
                    </Row>
                    
                    <Row id="f2" className="ml-3">
                        {
                        checktype.map(item => (
                            <Label className="mr-4" key={item.key}>
                            <Checkbox name={item.name} checked={this.state.tType.get(item.name)} onChange={this.handletTypeChange} />
                            {"  "+item.label}
                            </Label>
                        ))
                        }
                    </Row>

                    <Row id="f2" className="ml-2 mt-2">
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

                    <Row id="f2" className="ml-2 mt-2">
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
                        <span id="f2" className="ml-2">Amount</span>
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
                        <span id="f2" className="ml-2">Date</span>
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
                    
                    <Row id="f2" className="ml-2 mt-2">
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
                    
                    <Row id="f2" className="ml-2 mt-2">
                        Sort By
                    </Row>
                    
                    <FormGroup row>
                        <Label className="ml-5 col-6">
                            <Input
                            type="radio"
                            value="createdAt"
                            checked={this.state.sortBy === "createdAt"}
                            onChange={this.onRadioSortChange}
                            />
                            Creation Date
                        </Label>
                        <Label className="ml-5 col-6">
                            <Input
                            type="radio"
                            value="amount"
                            checked={this.state.sortBy === "amount"}
                            onChange={this.onRadioSortChange}
                            />
                            Amount
                        </Label>
                        {/* <Label className="ml-5 col-6">
                            <Input
                            type="radio"
                            value="eName"
                            checked={this.state.sortBy === "eName"}
                            onChange={this.onRadioSortChange}
                            />
                            Entity Name
                        </Label> */}
                    </FormGroup >

                    
                    <Row id="f2" className="ml-2 mt-2">
                        Order By
                    </Row>
                    
                    <FormGroup row>
                        <Label className="ml-5 col-4">
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
                    
                    <Row id="f2" className="ml-2 mt-2">
                        Entity
                    </Row>
                    <FormGroup row>
                        <Col md={10} className="ml-2">
                            
                            <Input type="select" name="entityId" id="entityId" value={this.state.entityId} onChange={this.handleEntityChange}>
                            (
                                <option selected value={''}> All Entities</option>
                                {this.state.entities.map(entity=>(<option value={entity._id}  >{entity.name} :  {entity.address} : {entity.contactNo}</option>))}
                            )
                            </Input>
                        </Col>
                    </FormGroup>

                    <Row className="ml-4">
                        <Button color="light btn-sm" id="fltr" onClick={this.handleClick}>
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
