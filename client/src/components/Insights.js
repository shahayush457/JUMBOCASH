import React, { Component } from 'react';
import auth from "../api/auth-helper";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import SideBar from './sideBar';
import { withStyles } from '@material-ui/core/styles';
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { blue, lightBlue } from "@material-ui/core/colors";
import CssBaseline from "@material-ui/core/CssBaseline";
import {read} from '../api/api-insight';
import Copyright from "./Copyright"
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import BusinessIcon from '@material-ui/icons/Business';
import TimelineIcon from '@material-ui/icons/Timeline';
import StarsIcon from '@material-ui/icons/Stars';
import PaymentIcon from '@material-ui/icons/Payment';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';

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

const TTypography = withStyles({
    root: {
      color: "#FFFFFF"
    }
})(Typography);


const styles = theme => ({
    root: {
      display: "flex",
      height: "100%"
    },
    title: {
      flexGrow: 1,
      fontSize: 25,
      color: lightBlue[500]
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
    },
    card: {
        width: "270px",
        display: "block",
        margin: theme.spacing(2)
    },
    card2: {
        width: "340px",
        display: "block",
        padding: theme.spacing(2)
    }
});

class Insights extends Component {

    constructor(props) {
        super(props);

        this.state = {
           error:'',
           favvendor:'',
           venc: 0,
           favcust:'',
           custc:0,
           intotal:0,
           outtotal:0,
           cash:0,
           online:0
        };
   
    }

    componentWillMount()
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
                        favvendor:data.favouriteVendor.entity[0],
                        venc:data.favouriteVendor.count,
                        favcust:data.favouriteCustomer.entity[0],
                        custc:data.favouriteCustomer.count,
                        intotal:data.totalBalanceIn,
                        outtotal:data.totalBalanceOut,
                        online:data.onlinePayments,
                        cash:data.inCashPayments
                    })
                }
            }
            else
            {
                this.setState({error:'Please add a transaction first'})
            }
        })
        
    }

    render() {
        console.log()
        const { classes } = this.props;
        
        if (auth.isAuthenticated()) {
        return (
            <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <div className = {classes.root}>
            <SideBar title="Insights" />
            <main className={classes.content}>
            <div className={classes.appBarSpacer} />

            <Grid container maxWidth="lg" className={classes.container} spacing={2} justify="center">
                
                <Grid item md={2}>
                    <Card className={classes.root} variant="outlined">
                        <CardContent>
                            <Typography className={classes.title} color="textSecondary" gutterBottom>
                                <AccountBalanceWalletIcon/> Total Credit
                            </Typography>
                            <TTypography variant="h5" component="h2">
                                Rs. {this.state.intotal}
                            </TTypography>
                        </CardContent>
                        {/* <CardActions>
                            <Button size="small">Learn More</Button>
                        </CardActions> */}
                    </Card>
                </Grid>

                <Grid item md={4} lg={2}>
                    <Card className={classes.root} variant="outlined">
                        <CardContent>
                            <Typography className={classes.title} color="textSecondary" gutterBottom>
                                <AccountBalanceWalletIcon/> Total Debit
                            </Typography>
                            <TTypography variant="h5" component="h2">
                                Rs. {this.state.outtotal}
                            </TTypography>
                        </CardContent>
                        {/* <CardActions>
                            <Button size="small">Learn More</Button>
                        </CardActions> */}
                    </Card>
                </Grid>

                <Grid item md={4} lg={2}>
                    <Card className={classes.root} variant="outlined">
                        <CardContent>
                            <Typography className={classes.title} color="textSecondary" gutterBottom>
                                <PaymentIcon/> Cash Payments
                            </Typography>
                            <TTypography variant="h5" component="h2">
                                {this.state.cash}
                            </TTypography>
                        </CardContent>
                        {/* <CardActions>
                            <Button size="small">Learn More</Button>
                        </CardActions> */}
                    </Card>
                </Grid>
                

                <Grid item md={4} lg={2}>
                    <Card className={classes.root} variant="outlined">
                        <CardContent>
                            <Typography className={classes.title} color="textSecondary" gutterBottom>
                                <PaymentIcon/> Online Payments
                            </Typography>
                            <TTypography variant="h5" component="h2">
                                {this.state.online}
                            </TTypography>
                        </CardContent>
                        {/* <CardActions>
                            <Button size="small">Learn More</Button>
                        </CardActions> */}
                    </Card>
                </Grid>
                
            </Grid>


            <Grid container maxWidth="lg" className={classes.container} spacing={4} justify="center">
                
                {this.state.favvendor && (<Grid item md={4} lg={3}>
                    <Card className={classes.root} variant="outlined">
                        <CardContent>
                            <Typography className={classes.title} color="textSecondary" gutterBottom>
                                <StarsIcon/> Favourite Vendor
                            </Typography>
                            <TTypography variant="h6" component="h2">
                                <PersonOutlineIcon/> { this.state.favvendor.name}
                            </TTypography>
                            <Typography className={classes.pos} color="textSecondary">
                                <BusinessIcon/> {this.state.favvendor.address}
                            </Typography>
                            <Typography variant="body2" component="p">
                                <TimelineIcon/> Traded {this.state.venc} times
                            </Typography>
                        </CardContent>
                        {/* <CardActions>
                            <Button size="small">Learn More</Button>
                        </CardActions> */}
                    </Card>
                </Grid>)}

                { this.state.favcust && (<Grid item md={4} lg={3}>
                    <Card className={classes.root} variant="outlined">
                        <CardContent>
                            <Typography className={classes.title} color="textSecondary" gutterBottom>
                                <StarsIcon/> Favourite Customer
                            </Typography>
                            <TTypography variant="h6" component="h2">
                                <PersonOutlineIcon/> {this.state.favcust.name}
                            </TTypography>
                            <Typography className={classes.pos} color="textSecondary">
                                <BusinessIcon/> {this.state.favcust.address}
                            </Typography>
                            <Typography variant="body2" component="p">
                                <TimelineIcon/> Traded {this.state.custc} times
                            </Typography>
                        </CardContent>
                        {/* <CardActions>
                            <Button size="small">Learn More</Button>
                        </CardActions> */}
                    </Card>
                </Grid>)}


                
            </Grid>
            <Box pt={4}>
                  <Copyright />
            </Box>
            </main>
            </div>
            </ThemeProvider>
        );
    }
    };
}

export default withStyles(styles)(Insights);