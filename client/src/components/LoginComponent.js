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
        Alert} from 'reactstrap'
import {signin} from '../api/api-auth'
import auth from '../api/auth-helper'
import {oauthGoogle , oauthFacebook} from '../api/api-oauth'
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'
import config from '../config'
class Login extends Component {
    
    constructor(props)
    {
        super(props);
        this.state={
            password:'',
            email:'',
            error:'',
            open:'',
            touched:{
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
      window.location.href = "/";
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

    responseGoogle(res) {
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
                auth.authenticate(data.token, () => {
                    this.setState({ ...this.state, error: '' ,open: true})
                })
            } 
        })
    }
    
    responseFacebook(res) {
        //console.log(JSON.stringify({"access_token":res.accessToken}));
        oauthFacebook(res.accessToken).then((data) => {
            //console.log(data);
            if (data.errors) 
            {
                this.setState({ ...this.state, error: data.errors[0].msg})
            } 
            else
            {
                auth.authenticate(data.token, () => {
                    this.setState({ ...this.state, error: '' ,open: true})
                })
            } 
        })
    }

    validate=(email,password)=>
    {
        const errors={
            password:'',
            email:''
        }

        if(this.state.touched.password && password.length<6)
            errors.password='Password should be greater than 6 characters';

        if(this.state.touched.email && email.split('').filter(x=>x==='@').length!=1)
            errors.email='Email is not valid';

        return errors;
    }
    handleSubmit=(event)=>
    {
        const user={
          "email":this.state.email,
          "password": this.state.password,
        }

        event.preventDefault();

        signin(user).then((data) => {
          
          if (data.errors) {
            this.setState({ ...this.state, error: data.errors[0].msg})
          } else {
            
            auth.authenticate(data.token, () => {
                this.setState({ ...this.state, error: '' ,open: true})
            })
          }
        })
        
    }

    render() { 

        const errors = this.validate(this.state.email, this.state.password);

        return ( 
            <div className="container">
            <div className="row row-content">
                <div className="col-12 col-md-9 mt-5">
                { this.state.error && <Alert color="danger">
                  {this.state.error}
                </Alert>}
                <Form onSubmit={this.handleSubmit} onChange={this.handleInputChange}>

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
                            Or sign in using third-party services
                            </div>
                            <FacebookLogin
                                appId={config.facebook}
                                render={renderProps => (
                                    <button style={{ marginRight: 15 }} className="btn btn-primary" onClick={renderProps.onClick}><i class="fa fa-facebook" aria-hidden="true"></i> Facebook</button>
                                )}
                                fields="name,email,picture"
                                callback={this.responseFacebook}
                                cssClass="btn btn-outline-primary"
                            />
                        <GoogleLogin 
                                clientId={config.google}
                                render={renderProps => (
                                    <button className="btn btn-danger" onClick={renderProps.onClick} disabled={renderProps.disabled}><i class="fa fa-google" aria-hidden="true"></i> Google</button>
                                )}
                                onSuccess={this.responseGoogle}
                                onFailure={this.responseGoogle}
                                className="btn btn-outline-danger"
                            />
                        </div>
                </div>
            </div>
            <Modal isOpen={this.state.open} toggle={this.toggleModal}>
              <ModalHeader toggle={this.toggleModal}>Login</ModalHeader>
              <ModalBody>
                You have successfully Logged In ! <br/> 
              </ModalBody>
            </Modal>
        </div>

         );
    }
}
 
export default Login;