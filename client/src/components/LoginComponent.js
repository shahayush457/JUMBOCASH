import React, { Component } from "react";
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Col,
  FormFeedback,
  Alert
} from "reactstrap";
import { signin } from "../api/api-auth";
import auth from "../api/auth-helper";
import { oauthGoogle, oauthFacebook } from "../api/api-oauth";
import GoogleLogin from "react-google-login";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { blue, lightBlue } from "@material-ui/core/colors";
import Box from "@material-ui/core/Box";
import Link from "@material-ui/core/Link";
import Copyright from "./Copyright";

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

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex"
  },
  paper: {
    marginTop: 50,
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto",
    fontSize: 30
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password: "",
      email: "",
      error: "",
      open: "",
      touched: {
        password: false,
        email: false
      }
    };
    this.toggleModal = this.toggleModal.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.responseGoogle = this.responseGoogle.bind(this);
    this.responseFacebook = this.responseFacebook.bind(this);
  }

  handleBlur = field => evt => {
    this.setState({
      touched: { ...this.state.touched, [field]: true }
    });
  };

  toggleModal() {
    
    this.setState({
      open: !this.state.open
    });
  }

  handleInputChange = event => {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({ [name]: value });
  };

  responseGoogle(res) {
    oauthGoogle(res.accessToken).then(data => {
      if (data.errors) {
        this.setState({ ...this.state, error: data.errors[0].msg });
      } else {
        auth.authenticate(data.token, () => {
          this.setState({ ...this.state, error: "", open: true });
          window.location.href = "/";
        });
      }
    });
  }

  responseFacebook(res) {
    //console.log(JSON.stringify({"access_token":res.accessToken}));
    oauthFacebook(res.accessToken).then(data => {
      //console.log(data);
      if (data.errors) {
        this.setState({ ...this.state, error: data.errors[0].msg });
      } else {
        auth.authenticate(data.token, () => {
          this.setState({ ...this.state, error: "", open: true });
          window.location.href = "/";
        });
      }
    });
  }

  validate = (email, password) => {
    const errors = {
      password: "",
      email: ""
    };

    if (this.state.touched.password && password.length < 6)
      errors.password = "Password should be greater than 6 characters";

    if (
      this.state.touched.email &&
      email.split("").filter(x => x === "@").length != 1
    )
      errors.email = "Email is not valid";

    return errors;
  };
  handleSubmit = event => {
    const user = {
      email: this.state.email,
      password: this.state.password
    };

    event.preventDefault();

    signin(user).then(data => {
      if (data.errors) {
        this.setState({ ...this.state, error: data.errors[0].msg });
      } else {
        auth.authenticate(data.token, () => {
          this.setState({ ...this.state, error: "", open: true });
          window.location.href = "/";
        });
      }
    });
  };

  render() {
    const errors = this.validate(this.state.email, this.state.password);
    const { classes } = this.props;

    return (
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <div className="container">
          <Paper className={classes.paper}>
            <Typography
              component="h1"
              variant="h5"
              style={{ paddingTop: 30 }}
              align="center"
            >
              Sign in
            </Typography>
            <div className="row row-content">
              <div className="col-12 col-md-9 mt-5">
                {this.state.error && (
                  <Alert color="danger">{this.state.error}</Alert>
                )}
                <Alert severity="success" isOpen={this.state.open} toggle={this.toggleModal}>
                    Login Success.
                 </Alert>
                <Form
                  onSubmit={this.handleSubmit}
                  onChange={this.handleInputChange}
                  style={{ paddingLeft: 30 }}
                >
                  <FormGroup row>
                    <Label htmlFor="email" md={2}>
                      Email
                    </Label>
                    <Col md={10}>
                      <Input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Email"
                        value={this.state.email}
                        valid={errors.email === ""}
                        invalid={errors.email !== ""}
                        onBlur={this.handleBlur("email")}
                      />
                      <FormFeedback>{errors.email}</FormFeedback>
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Label htmlFor="password" md={2}>
                      Password
                    </Label>
                    <Col md={10}>
                      <Input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Password"
                        value={this.state.password}
                        valid={errors.password === ""}
                        invalid={errors.password !== ""}
                        onBlur={this.handleBlur("password")}
                      />
                      <FormFeedback>{errors.password}</FormFeedback>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md={{ size: 10, offset: 2 }}>
                      <Button type="submit" color="primary">
                        Submit
                      </Button>
                    </Col>
                  </FormGroup>
                </Form>
              </div>
            </div>
            <div className="container ml-md-5" style={{ paddingBottom: 30 }}>
              <div className="row row-content ml-md-4">
                <div className="text-center">
                  <div className="ml-md-4">
                    <Link href="/register" variant="body2">
                      {"Don't have an account? Sign Up"}
                    </Link>
                  </div>
                  <div className="alert alert-primary ml-md-4">
                    Or sign in using third-party services
                  </div>
                  <FacebookLogin
                    appId="435566974381314"
                    render={renderProps => (
                      <button
                        style={{ marginRight: 15 }}
                        className="btn btn-primary"
                        onClick={renderProps.onClick}
                      >
                        <i class="fa fa-facebook" aria-hidden="true"></i>{" "}
                        Facebook
                      </button>
                    )}
                    fields="name,email,picture"
                    callback={this.responseFacebook}
                    cssClass="btn btn-outline-primary"
                  />
                  <GoogleLogin
                    clientId="395911397838-qevt8tlmbbrs21h7f5devar2lf2cm120.apps.googleusercontent.com"
                    render={renderProps => (
                      <button
                        className="btn btn-danger"
                        onClick={renderProps.onClick}
                        disabled={renderProps.disabled}
                      >
                        <i class="fa fa-google" aria-hidden="true"></i> Google
                      </button>
                    )}
                    onSuccess={this.responseGoogle}
                    onFailure={this.responseGoogle}
                    className="btn btn-outline-danger"
                  />
                </div>
              </div>
            </div>
          </Paper>
          <Box pt={4}>
            <Copyright />
          </Box>  
        </div>
      </ThemeProvider>
    );
  }
}

export default withStyles(useStyles)(Login);
