import React, { Component } from "react";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import SideBar from "./sideBar";
import { withStyles } from "@material-ui/core/styles";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { blue, lightBlue } from "@material-ui/core/colors";
import CssBaseline from "@material-ui/core/CssBaseline";
import Copyright from "./Copyright";
import auth from "../api/auth-helper";
import { readweek } from "../api/api-report";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { Bar } from "@reactchartjs/react-chart.js";

var month = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];

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
    flexGrow: 1,
    fontSize: 20,
    color: lightBlue[700]
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto",
    fontSize: 16
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4)
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
    backgroundColor: "#FFF"
  },
  fixedHeight: {
    height: 120
  },
  chart: {
    backgroundColor: "#FFF"
  }
});

class WeekReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      year: "",
      data1: {},
      data2: {},
      data3: {},
      options: {}
    };
  }
  componentWillMount() {
    const token = localStorage.getItem("jwtToken");
    readweek(token).then(data => {
      if (data.errors) {
        this.setState({ ...this.state, error: data.errors[0].msg });
      } else {
        this.setState({
          year: data
        });
        let paid = [],
          pending = [],
          total = [],
          credit = [],
          debit = [],
          net = [];
        for (let i = 0; i < month.length; i++) {
          paid.push(this.state.year[month[i]].paid);
          pending.push(this.state.year[month[i]].pending);
          total.push(this.state.year[month[i]].total);

          credit.push(this.state.year[month[i]].credit);
          debit.push(this.state.year[month[i]].debit);
          net.push(this.state.year[month[i]].totalAmount);
        }

        this.setState({
          data1: {
            labels: month,
            datasets: [
              {
                label: "Total",
                data: total,
                backgroundColor: "rgb(255, 99, 132)"
              },
              {
                label: "Paid",
                data: paid,
                backgroundColor: "rgb(54, 162, 235)"
              },
              {
                label: "Pending",
                data: pending,
                backgroundColor: "rgb(75, 192, 192)"
              }
            ]
          }
        });

        this.setState({
          data3: {
            labels: month,
            datasets: [
              {
                label: "Total",
                data: total,
                backgroundColor: "rgb(255, 99, 132)"
              },
              {
                label: "Credit",
                data: credit,
                backgroundColor: "rgb(54, 162, 235)"
              },
              {
                label: "Debit",
                data: debit,
                backgroundColor: "rgb(75, 192, 192)"
              }
            ]
          }
        });

        this.setState({
          data2: {
            labels: month,
            datasets: [
              {
                label: "Amount",
                data: net,
                backgroundColor: "rgb(255, 99, 132)"
              }
            ]
          }
        });

        this.setState({
          options: {
            legend: {
              labels: {
                fontSize: 15
              }
            },
            scales: {
              yAxes: [
                {
                  ticks: {
                    beginAtZero: true
                  }
                }
              ],
              xAxes: [
                {
                  ticks: {
                    beginAtZero: true
                  }
                }
              ]
            }
          }
        });
      }
    });
  }

  render() {
    const { classes } = this.props;
    if (auth.isAuthenticated()) {
      return (
        <ThemeProvider theme={darkTheme}>
          <CssBaseline />
          <div className={classes.root}>
            <SideBar title="Reports" />
            <main className={classes.content}>
              <div className={classes.appBarSpacer} />
              <Grid
                container
                maxWidth="lg"
                className={classes.container}
                spacing={2}
                justify="center"
              >
                <Grid item md={5}>
                  <Paper className={classes.paper}>
                  <Typography className={classes.title} color="textSecondary">Total amount per day</Typography>
                    <Bar data={this.state.data2} options={this.state.options} />
                  </Paper>
                </Grid>

                <Grid item md={5}>
                  <Paper className={classes.paper}>
                  <Typography className={classes.title} color="textSecondary">Total number of transactions for Pending and Paid</Typography>
                    <Bar data={this.state.data1} options={this.state.options} />
                  </Paper>
                </Grid>

                <Grid item md={5}>
                  <Paper className={classes.paper}>
                  <Typography className={classes.title} color="textSecondary">Total number of transactions for Credit and Debit</Typography>
                    <Bar data={this.state.data3} options={this.state.options} />
                  </Paper>
                </Grid>
              </Grid>
              <Box pt={4}>
                <Copyright />
              </Box>
            </main>
          </div>
        </ThemeProvider>
      );
    }
  }
}

export default withStyles(styles)(WeekReport);
