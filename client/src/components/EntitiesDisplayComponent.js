import React, { useState } from "react";
import { find } from "../api/api-entities";
import auth from "../api/auth-helper";
import "../css/userfront.css";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import { TablePagination } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { blue, lightBlue } from "@material-ui/core/colors";
import SideBar from "./sideBar";
import Entities from "./entities";
import Copyright from "./Copyright";

const drawerWidth = 240;

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
    height: 120
  }
}));

export default function EntitiesDisplay() {
  const classes = useStyles();
  const [entities, setEntities] = useState([]);

  const pages = [5, 10, 25, 50];
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(pages[page]);

  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("name");

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleSortRequest = cellId => {
    const isAsc = orderBy === cellId && order === "asc";
    setOrderBy(cellId);
    setOrder(isAsc ? "desc" : "asc");
  };

  const token = localStorage.getItem("jwtToken");

  React.useEffect(() => {
    const Order = order === "desc" ? -1 : 1;

    let url = `limit=${rowsPerPage}&pageNo=${page +
      1}&sortBy=${orderBy}&orderBy=${Order}`;

    find(url, token).then(data => {
      if (data.errors) {
        console.log(data.error);
      } else {
        setEntities(data.entities);
        setTotalCount(data.totalCount[0].count);
      }
    });
  }, [rowsPerPage, page, order, orderBy]);

  if (auth.isAuthenticated()) {
    return (
      <ThemeProvider theme={darkTheme}>
        <div className={classes.root}>
          <CssBaseline />
          <SideBar title="Entities Added" />
          <main className={classes.content}>
            <div className={classes.appBarSpacer} />
            <Container maxWidth="lg" className={classes.container}>
              {/* Entities */}
              <Grid item xs="auto">
                <Paper className={classes.paper}>
                  <Entities
                    entities={entities}
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
              <Box pt={4}>
                <Copyright />
              </Box>
            </Container>
          </main>
        </div>
      </ThemeProvider>
    );
  }
}
