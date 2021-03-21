import React,{Component} from 'react';
import {Button,
        Form,
        FormGroup,
        Label,
        Input,
        Col,
        FormFeedback, 
        Modal,
        ModalHeader,
        ModalBody,
        Alert,
        } from 'reactstrap'
import {Link} from 'react-router-dom'
import {create} from '../api/api-auth'
import {oauthGoogle , oauthFacebook} from '../api/api-oauth'
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'
class Register extends Component {
    
    constructor(props)
    {
        super(props);
        this.state={
            name:'',
            password:'',
            email:'',
            error:'',
            open:'',
            touched:{
                name:false,
                password:false,
                email:false
            }
        };
        this.toggleModal=this.toggleModal.bind(this);
        this.handleSubmit=this.handleSubmit.bind(this);
        this.handleInputChange=this.handleInputChange.bind(this);
        this.responseGoogle = this.responseGoogle.bind(this);
        this.responseFacebook = this.responseFacebook.bind(this);
    }

    handleBlur=(field)=>(evt)=>
    {
        this.setState(
            {
                touched:{...this.state.touched,[field]:true}
            }
        )
    }
    toggleModal() {
      
      this.setState({
        open: !this.state.open
      });
    }
    handleInputChange=(event)=>
    {
        const target = event.target;
        const value = target.value;
        const name=target.name;
        this.setState({[name]:value})
    }

    validate=(name,email,password)=>
    {
        const errors={
            name:'',
            password:'',
            email:''
        }

        if(this.state.touched.name && name.length<3)
            errors.name='Name should be greater than 3 characters';
        else if (this.state.touched.name && name.length>15)
            errors.firstname='Name should be less than 16 characters';

        if(this.state.touched.password && password.length<6)
            errors.password='Password should be greater than 6 characters';

        if(this.state.touched.email && email.split('').filter(x=>x==='@').length!=1)
            errors.email='Email is not valid';

        return errors;
    }
    responseGoogle(res) {
        
        //console.log(res.accessToken);
        //console.log(JSON.stringify({"access_token":res.accessToken}));
        oauthGoogle(res.accessToken).then((data) => {
            //console.log(data);
            //console.log(data);
            if (data.errors) 
            {
                this.setState({ ...this.state, error: data.errors[0].msg})
            } 
            else
            {
                this.setState({ ...this.state, error: '' ,open: true})
            } 
        })
    }
    responseFacebook(res) {
        
        oauthFacebook(res.accessToken).then((data) => {
            //console.log(data);
            if (data.errors) 
            {
                this.setState({ ...this.state, error: data.errors[0].msg})
            } 
            else
            {
                this.setState({ ...this.state, error: '' ,open: true})
            }
        })
    }
    handleSubmit=(event)=>
    {
        
        const user={
          "name":this.state.name,
          "email":this.state.email,
          "password": this.state.password,
          "method":['local']
        }
         
        create(user).then((data) => {
          if (data.errors) {
            this.setState({ ...this.state, error: data.errors[0].msg})
          } else {
            this.setState({ ...this.state, error: '' ,open: true})
          }
        })
        event.preventDefault();
    }

    render() { 

        const errors = this.validate(this.state.name,this.state.email, this.state.password);
        return ( 
            <div className="container">
            <div className="row row-content">
                <div className="col-12 col-md-9 mt-5">
                { this.state.error && <Alert color="danger">
                  {this.state.error}
                </Alert>}
                <Form onSubmit={this.handleSubmit} onChange={this.handleInputChange}>
                    
                    <FormGroup row>
                        <Label htmlFor="name" md={2}>Name</Label>
                        <Col md={10}>
                            <Input type="text" id="name" name="name"
                            placeholder="Name" value={this.state.name} 
                            valid={errors.name===''}
                            invalid={errors.name!==''}
                            onBlur={this.handleBlur("name")} required/>
                            <FormFeedback>
                                {errors.name}
                            </FormFeedback>

                        </Col>
                    </FormGroup>

                    <FormGroup row>
                        <Label htmlFor="email" md={2}>Email</Label>
                        <Col md={10}>
                            <Input type="email" id="email" name="email"
                            placeholder="Email" value={this.state.email} 
                            valid={errors.email===''}
                            invalid={errors.email!==''}
                            onBlur={this.handleBlur("email")}/>
                            <FormFeedback>
                                {errors.email}
                            </FormFeedback>
                        </Col>
                    </FormGroup>

                    <FormGroup row>
                        <Label htmlFor="password" md={2}>Password</Label>
                        <Col md={10}>
                            <Input type="password" id="password" name="password"
                            placeholder="Password" value={this.state.password}
                            valid={errors.password===''}
                            invalid={errors.password!==''}
                            onBlur={this.handleBlur("password")} />
                            <FormFeedback>
                                {errors.password}
                            </FormFeedback>
                        </Col>
                    </FormGroup>
                    
                    <FormGroup row>
                        <Col md={{size:10,offset:2}}>
                            <Button type="submit" color="primary">
                            Submit
                            </Button>
                        </Col>
                    </FormGroup>
                </Form>
                </div>
               
            </div>
            <div className="container ml-md-5">
                <div className="row row-content ml-md-5">
                        <div className="text-center">
                            <div className="alert alert-primary ml-md-4">
                            Or register using third-party services
                            </div>
                            <FacebookLogin
                                appId="435566974381314"
                                render={renderProps => (
                                    <button style={{ marginRight: 15 }} className="btn btn-primary" onClick={renderProps.onClick}><i class="fa fa-facebook-square" aria-hidden="true"></i> Facebook</button>
                                )}
                                fields="name,email,picture"
                                callback={this.responseFacebook}
                                cssClass="btn btn-outline-primary"
                            />
                        <GoogleLogin 
                                clientId="395911397838-qevt8tlmbbrs21h7f5devar2lf2cm120.apps.googleusercontent.com"
                                render={renderProps => (
                                    <button className="btn btn-danger" onClick={renderProps.onClick} disabled={renderProps.disabled}><i class="fa fa-google" aria-hidden="true"></i> Google</button>
                                )}
                                onSuccess={this.responseGoogle}
                                onFailure={this.responseGoogle}
                                cookiePolicy={'single_host_origin'}
                                className="btn btn-outline-danger"
                            />
                        </div>
                </div>
            </div>
            <Modal isOpen={this.state.open} toggle={this.toggleModal}>
              <ModalHeader toggle={this.toggleModal}>Register</ModalHeader>
              <ModalBody>
                You have successfully registered ! <br/> 
                <Link to="/login">
                <Button color="primary" className="mr-auto mt-2">
                  Sign In
                </Button>
              </Link>
              </ModalBody>
            </Modal>
        </div>

         );
    }
}
 
export default Register;