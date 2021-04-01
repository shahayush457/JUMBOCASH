import React, { Component } from 'react';
import { Alert,
         Button,
         Form, 
         FormGroup, 
         Label, 
         Input, 
         Col, 
         FormFeedback } from 'reactstrap';
import moment from 'moment'
import { createMuiTheme, ThemeProvider, withStyles } from "@material-ui/core/styles";
import { blue, lightBlue } from "@material-ui/core/colors";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import Copyright from "./Copyright"
import SideBar from './sideBar';
import {readone,editone} from '../api/api-trans';
import {read} from '../api/api-entities';
import {withRouter} from 'react-router'

const darkTheme = createMuiTheme({
    palette: {
      type: "dark",
      primary: {
        main: lightBlue[500]
      },
      secondary: {
        main: blue[900]
      }
    }
});

const styles = theme => ({
    root: {
      display: "flex"
    },
    title: {
      flexGrow: 1
    },
    appBarSpacer: theme.mixins.toolbar,
    content: {
      flexGrow: 1,
      height: "100vh",
      overflow: "auto"
    },
    container: {
      paddingTop: theme.spacing(4),
      paddingBottom: theme.spacing(4)
    },
    paper: {
      padding: theme.spacing(2),
      display: "flex",
      overflow: "auto",
      flexDirection: "column"
    },
    fixedHeight: {
      height: 120
    }
});

class EditTransaction extends Component {

    constructor(props) {
        super(props);

        this.state = {
            amount:'',
            type:'',
            mode:'',
            remark:'',
            status:'',
            error:'',
            open:'',
            entityId:'',
            entities:[],
            pDate:'',
            touched: {
                amount: false,
                type: false,
                mode: false,
                remark: false,
                status: false,
            }
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.toggleModal=this.toggleModal.bind(this);
        this.handleEntityChange=this.handleEntityChange.bind(this);
    }

    componentDidMount()
    {
        const token=localStorage.getItem('jwtToken');
        read(token).then((data) => {
            //console.log(data);
            
            if(data.length!==0)
            {
                if (data.errors) {
                    this.setState({ ...this.state,error:data.errors[0].msg})
                } else {
                    this.setState({
                    entities:data
                    })
                }
            }
            else
            {
                this.setState({error:'Please add a entity first'})
            }
            //console.log(this.state);
        })

        readone(token,this.props.match.params.transId).then((data) => {
            
            if(data && data.errors) 
            {
              this.setState({...this.state, error: data.errors[0].msg})
            } 
            else 
            {
              this.setState({...this.state,amount: data.amount,type: data.transactionType,mode: data.transactionMode,remark:data.remark,status:data.transactionStatus,entityId:data.entityId,pDate:moment(data.reminderDate).format("YYYY-MM-DD")})
            }
        })

    }

    toggleModal() {
        this.props.history.push('/');
        this.setState({
          open: !this.state.open
        });
      }

    onRadioChange = (e) => {
       
        this.setState({
          type: e.target.value
        });
    }

    onRadioModeChange = (e) => {
        
        this.setState({
          mode: e.target.value
        });
    }

    onRadioStatusChange = (e) => {
        
        this.setState({
          status: e.target.value
        });
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({ [name]: value })
    }

    handleEntityChange(e) {

        this.setState({entityId:e.target.value});
        
    }

    handleSubmit(event) {
       
        var transaction={
            "amount":Number(this.state.amount),
            "transactionType":this.state.type,
            "transactionMode":this.state.mode,
            "transactionStatus":this.state.status,
            "remark":this.state.remark,
            "entityId":this.state.entityId
        }
        
        event.preventDefault();
        const token=localStorage.getItem('jwtToken');

        editone(token,this.props.match.params.transId,transaction).then((data) => {
            //console.log(data);
             if (data.errors) {
               this.setState({ ...this.state, error: data.errors[0].msg})
             } else {
               this.setState({ ...this.state, error:'',open:true})
             }
        }) 
        
    }

    handleBlur = (field) => (evt) => {
        this.setState({
            touched: { ...this.state.touched, [field]: true}
        });
    }

    validate(amount,type,mode,remark,status) {
        const errors = {
            amount:'',
            type:'',
            mode:'',
            remark:'',
            status:''
        };

        if (this.state.touched.remark && remark.length < 3)
            errors.remark = 'Remark should be greater than 3 characters';
        else if (this.state.touched.remark && remark.length > 25)
            errors.remark = 'Remark should be less than 25 characters';

        const reg = /^\d+$/;

        if (this.state.touched.amount && !reg.test(amount))
            errors.amount = 'Amount should contain only numbers';

        return errors;
    };

    render() {
        const errors = this.validate(this.state.amount, this.state.type, this.state.mode,this.state.remark,this.state.status);
        const { classes } = this.props;
        return (
            <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <div className = {classes.root}>
            <SideBar title="Add Transaction" />
            <main className={classes.content}>
            <div className={classes.appBarSpacer} />
            <Container maxWidth="lg" className={classes.container}>
                <div className="row row-content">
                    <div className="col-12 col-md-9">
                        { 
                            this.state.error && <Alert color="danger">
                                {this.state.error}
                            </Alert>
                        }
                        <Alert severity="success" isOpen={this.state.open} toggle={this.toggleModal}>
                          Transaction edited successfully — <a href="/"><strong>check it out!</strong></a>
                        </Alert>
                        <Form onSubmit={this.handleSubmit}>
                            <FormGroup row>
                                <Label htmlFor="amount" md={2}>Amount</Label>
                                <Col md={10}>
                                    <Input type="number" id="amount" name="amount" placeholder="Amount" value={this.state.amount} valid={errors.amount === ''} invalid={errors.amount !== ''} onChange={this.handleInputChange} onBlur={this.handleBlur('amount')} />
                                    <FormFeedback>{errors.contactNo}</FormFeedback>
                                </Col>
                            </FormGroup>


                            <FormGroup row>
                                <Col sm={2} >
                                    <p>Type </p>
                                </Col>
                                <Col sm={2} className="ml-3 mr-0">
                                    <Label>
                                        <Input
                                        type="radio"
                                        value="credit"
                                        checked={this.state.type === "credit"}
                                        onChange={this.onRadioChange}
                                        />
                                        <span>Credit</span>
                                    </Label>
                                </Col>
                                <Col sm={2} className="ml-3 mr-0">
                                    <Label>
                                        <Input
                                        type="radio"
                                        value="debit"
                                        checked={this.state.type === "debit"}
                                        onChange={this.onRadioChange}
                                        />
                                        <span>Debit</span>
                                    </Label>
                                </Col>
                            </FormGroup>

                            <FormGroup row>
                                <Col sm={2} >
                                    <p>Status </p>
                                </Col>
                                <Col sm={2} className="ml-3 mr-0">
                                    <Label>
                                        <Input
                                        type="radio"
                                        value="pending"
                                        checked={this.state.status === "pending"}
                                        onChange={this.onRadioStatusChange}
                                        />
                                        <span>Pending</span>
                                    </Label>
                                </Col>
                                <Col className="ml-3 mr-0">
                                    <Label>
                                        <Input
                                        type="radio"
                                        value="paid"
                                        checked={this.state.status === "paid"}
                                        onChange={this.onRadioStatusChange}
                                        />
                                        <span>Completed</span>
                                    </Label>
                                </Col>
                            </FormGroup>
                            {
                                this.state.status=="pending" && (

                                    <FormGroup row>
                                        <Label htmlFor="pDate" md={2} className="ml-0 mb-2">Reminder</Label>
                                        <Col md={8}>
                                            <Input type="date" id="pDate" name="pDate"
                                            disabled
                                            placeholder="Reminder" value={this.state.pDate} 
                                            //onChange={this.handleInputChange}
                                            />
                                        </Col> 
                                    </FormGroup>
                                )
                            }

                            <FormGroup row>
                                <Col sm={2} >
                                    <p>Mode </p>
                                </Col>
                                <Col sm={2} className="ml-3 mr-0">
                                    <Label>
                                        <Input
                                        type="radio"
                                        value="cash"
                                        checked={this.state.mode === "cash"}
                                        onChange={this.onRadioModeChange}
                                        />
                                        <span>Cash</span>
                                    </Label>
                                </Col>
                                <Col sm={2} className="ml-3 mr-0">
                                    <Label>
                                        <Input
                                        type="radio"
                                        value="upi"
                                        checked={this.state.mode === "upi"}
                                        onChange={this.onRadioModeChange}
                                        />
                                        <span>UPI</span>
                                    </Label>
                                </Col>
                                <Col sm={2} className="ml-3 mr-0">
                                    <Label>
                                        <Input
                                        type="radio"
                                        value="debit-card"
                                        checked={this.state.mode === "debit-card"}
                                        onChange={this.onRadioModeChange}
                                        />
                                        <span>Debit Card</span>
                                    </Label>
                                </Col>
                                <Col sm={2} className="ml-3 mr-0" >
                                    <Label>
                                        <Input
                                        type="radio"
                                        value="credit-card"
                                        checked={this.state.mode === "credit-card"}
                                        onChange={this.onRadioModeChange}
                                        />
                                        <span>Credit Card</span>
                                    </Label>
                                </Col>
                            </FormGroup>

                            <FormGroup row>
                                <Label htmlFor="enitityId" md={2}>Entitiy</Label>
                                <Col md={10}>
                                    <Input type="select" name="entityId" id="entityId" value={this.state.entityId} onChange={this.handleEntityChange}>
                                    (
                                        <option selected value={''}> Select Entitiy</option>
                                        {this.state.entities.map(entity=>(<option value={entity._id}  >{entity.name} :  {entity.address} : {entity.contactNo}</option>))}
                                    )
                                    </Input>
                                </Col>
                            </FormGroup>

                            <FormGroup row>
                                <Label htmlFor="remark" md={2}>Remarks</Label>
                                <Col md={10}>
                                    <Input type="text" id="remark" name="remark" placeholder="Remark" value={this.state.remark} valid={errors.remark === ''} invalid={errors.remark !== ''} onChange={this.handleInputChange} onBlur={this.handleBlur('remark')} />
                                    <FormFeedback>{errors.remark}</FormFeedback>
                                </Col>
                            </FormGroup>

                            

                            <FormGroup row>
                                <Col md={{ size: 10, offset: 2 }}>
                                    <Button type="submit" color="primary">Edit</Button>
                                </Col>
                            </FormGroup>  
                        </Form>
                    </div>
                </div>
            <Box pt={4}>
              <Copyright />
            </Box>
            </Container>
            </main>
            </div>
            </ThemeProvider>
        );
    };
}

export default withRouter(withStyles(styles)(EditTransaction));