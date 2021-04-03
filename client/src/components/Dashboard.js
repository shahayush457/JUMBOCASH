import React, { useState } from "react";
import {Link} from "react-router-dom"
import { read } from "../api/api-user";
import { find } from "../api/api-trans";
import auth from "../api/auth-helper";
import i1 from "../images/header-hero.jpg";
import i2 from "../images/header.png";
import "../css/userfront.css";
import clsx from "clsx";
import { TablePagination } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { blue, lightBlue } from "@material-ui/core/colors";
import Transactions from "./transactions";
import Balance from "./userBalance";
import SideBar from "./sideBar";
import Filter from "./FilterTransaction";
import Copyright from "./Copyright";
import Title from "./Title";


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

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex"
  },
  toolbar: {
    paddingRight: 24 // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  menuButton: {
    marginRight: 36
  },
  menuButtonHidden: {
    display: "none"
  },
  title: {
    flexGrow: 1
  },
  drawerPaper: {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  drawerPaperClose: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9)
    }
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
    height: 85,
    [theme.breakpoints.up("sm")]: {
      height: 120
    }
  }
}));

const checkstatus = [
  {
    name: "pending",
    key: "pending",
    label: "pending"
  },
  {
    name: "paid",
    key: "paid",
    label: "paid"
  }
];

const checktype = [
  {
    name: "credit",
    key: "credit",
    label: "credit"
  },
  {
    name: "debit",
    key: "debit",
    label: "debit"
  }
];

const checkmode = [
  {
    name: "cash",
    key: "cash",
    label: "cash"
  },
  {
    name: "credit-card",
    key: "credit-card",
    label: "credit card"
  },
  {
    name: "debit-card",
    key: "debit-card",
    label: "debit card"
  },
  {
    name: "upi",
    key: "upi",
    label: "upi"
  }
];

const checkEntityType = [
  {
    name: "vendor",
    key: "vendor",
    label: "vendor"
  },
  {
    name: "customer",
    key: "customer",
    label: "customer"
  }
];

export default function Dashboard() {
  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  const [balance, setBalance] = useState(0);
  const [pendingDebit, setPendingDebit] = useState(0);
  const [pendingCredit, setPendingCredit] = useState(0);

  const [transactions, setTransactions] = useState([]);

  const pages = [5, 10, 25, 50, 100];
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(pages[page]);

  const [order, setOrder] = React.useState("desc");
  const [orderBy, setOrderBy] = React.useState("createdAt");

  const [startDate, setStartDate] = React.useState(null);
  const [finishDate, setFinishDate] = React.useState(null);
  const [priceFilter, setPriceFilter] = React.useState([0, 100000]);

  const [statusValue, statusSetValue] = React.useState(["pending", "paid"]);
  const [typeValue, typeSetValue] = React.useState(["debit", "credit"]);
  const [modeValue, modeSetValue] = React.useState([
    "upi",
    "cash",
    "debit-card",
    "credit-card"
  ]);
  const [etypeValue, etypeSetValue] = React.useState(["vendor", "customer"]);

  function generateurl(data, field) {
    let part = "";
    data.forEach(value => (part += `&${field}=${value}`));
    return part;
  }

  const handleChangeStatus = (event, newValues) => {
    let arr = newValues.map(value => value.name);
    console.log(newValues.length);
    if (!newValues.length) arr = ["pending", "paid"];
    statusSetValue(arr);
  };

  const handleChangeType = (event, newValues) => {
    let arr = newValues.map(value => value.name);
    console.log(newValues.length);
    if (!newValues.length) arr = ["debit", "credit"];
    typeSetValue(arr);
  };

  const handleChangeMode = (event, newValues) => {
    let arr = newValues.map(value => value.name);
    console.log(newValues.length);
    if (!newValues.length) arr = ["upi", "cash", "debit-card", "credit-card"];
    modeSetValue(arr);
  };

  const handleChangeEtype = (event, newValues) => {
    let arr = newValues.map(value => value.name);
    console.log(newValues.length);
    if (!newValues.length) arr = ["vendor", "customer"];
    etypeSetValue(arr);
  };

  const handleSortRequest = cellId => {
    const isAsc = orderBy === cellId && order === "asc";
    setOrderBy(cellId);
    setOrder(isAsc ? "desc" : "asc");
  };

  const handleDateChange = date => {
    setStartDate(date);
  };

  const handleDateChangeFinish = date => {
    setFinishDate(date);
  };

  const setRangeFilter = (event, newValue) => {
    setPriceFilter(newValue);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const token = localStorage.getItem("jwtToken");

  React.useEffect(() => {
    read(token).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        setBalance(data.balance);
        setPendingDebit(data.pendingAmountDebit);
        setPendingCredit(data.pendingAmountCredit);
      }
    });

    const Order = order === "desc" ? -1 : 1;

    let url = `limit=${rowsPerPage}&pageNo=${page +
      1}&sortBy=${orderBy}&orderBy=${Order}&sDate=${startDate}&eDate=${finishDate}&sAmount=${
      priceFilter[0]
    }&eAmount=${priceFilter[1]}`;

    url += generateurl(statusValue, "tStatus");
    url += generateurl(typeValue, "tType");
    url += generateurl(modeValue, "tMode");
    url += generateurl(etypeValue, "eType");

    find(url, token).then(data => {
      console.log(data);
      if (data.errors) {
        console.log(data.error);
      } else {
        setTransactions(data.transactions);
        setTotalCount(data.totalCount[0].count);
      }
    });
  }, [
    rowsPerPage,
    page,
    order,
    orderBy,
    startDate,
    finishDate,
    priceFilter,
    statusValue,
    typeValue,
    modeValue,
    etypeValue
  ]);

  if (auth.isAuthenticated()) {
    return (
      <div className={classes.root}>
        <ThemeProvider theme={darkTheme}>
          <CssBaseline />
          <SideBar title="Dashboard" />
          <main className={classes.content}>
            <div className={classes.appBarSpacer} />
            <Container maxWidth="lg" className={classes.container}>
              <Grid container spacing={5}>
                {/* Balance */}
                <Grid item lg>
                  <Paper className={fixedHeightPaper}>
                    <Balance title="Balance" balance={balance} />
                  </Paper>
                </Grid>

                <Grid item lg>
                  <Paper className={fixedHeightPaper}>
                    <Balance title="You'll Get" balance={pendingCredit} />
                  </Paper>
                </Grid>

                <Grid item lg>
                  <Paper className={fixedHeightPaper}>
                    <Balance title="You'll Give" balance={pendingDebit} />
                  </Paper>
                </Grid>

                {/* Transactions */}
                <Grid item xs={12}>
                  <Paper className={classes.paper}>
                  <Title>Transactions</Title>
                  <Filter
                    startDate={startDate}
                    setStartDate={setStartDate}
                    finishDate={finishDate}
                    setFinishDate={setFinishDate}
                    priceFilter={priceFilter}
                    setPriceFilter={setPriceFilter}
                    handleDateChange={handleDateChange}
                    handleDateChangeFinish={handleDateChangeFinish}
                    setRangeFilter={setRangeFilter}
                    checkstatus={checkstatus}
                    handleChangeStatus={handleChangeStatus}
                    checktype={checktype}
                    handleChangeType={handleChangeType}
                    checkmode={checkmode}
                    handleChangeMode={handleChangeMode}
                    checkEntityType={checkEntityType}
                    handleChangeEtype={handleChangeEtype}
                  />
                    <Transactions
                      transactions={transactions}
                      orderBy={orderBy}
                      order={order}
                      handleSortRequest={handleSortRequest}
                    />
                    <TablePagination
                      component="div"
                      rowsPerPageOptions={pages}
                      count={totalCount}
                      page={page}
                      onChangePage={handleChangePage}
                      rowsPerPage={rowsPerPage}
                      onChangeRowsPerPage={handleChangeRowsPerPage}
                    />
                  </Paper>
                </Grid>
              </Grid>
              <Box pt={4}>
                <Copyright />
              </Box>
            </Container>
          </main>
        </ThemeProvider>
      </div>
    );
  } else {
    return (
      <div className="row">
        <div
          id="home"
          className="header-hero bg_cover d-lg-flex align-items-center"
          style={{ "background-image": { i1 }, marginTop: 15 }}
        >
          <div className="container">
            <div className="row">
              <div className="col-lg-7">
                <div className="header-hero-content">
                  <h1
                    className="hero-title wow fadeInUp"
                    data-wow-duration="1s"
                    data-wow-delay="0.2s"
                  >
                    <b>A</b> <span>Cash Flow Management</span> portal for{" "}
                    <b>Effective management.</b>
                  </h1>
                  {/* <p class="text wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.5s">Phasellus vel elit efficitur, gravida libero sit amet, scelerisque  tortor arcu, commodo sit amet nulla sed.</p> */}
                  <div
                    className="header-singup wow fadeInUp"
                    data-wow-duration="1s"
                    data-wow-delay="0.8s"
                  >
                    {/* <button class="main-btn">Sign Up</button> */}
                    <Link className="main-btn" to="/register">
                      Register
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className="header-hero-image d-flex align-items-center wow fadeInRightBig"
            data-wow-duration="1s"
            data-wow-delay="1.1s"
          >
            <div className="image">
              <img src={i2} alt="Hero" />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
