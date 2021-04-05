import React from "react";
import { Link } from "react-router-dom";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Badge from "@material-ui/core/Badge";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";
import DashboardIcon from "@material-ui/icons/Dashboard";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import IconButton from "@material-ui/core/IconButton";
import Divider from "@material-ui/core/Divider";
import AddCircleRoundedIcon from "@material-ui/icons/AddCircleRounded";
import PersonAddTwoToneIcon from "@material-ui/icons/PersonAddTwoTone";
import BarChartIcon from "@material-ui/icons/BarChart";
import TimelineIcon from '@material-ui/icons/Timeline';
import LayersIcon from "@material-ui/icons/Layers";
import MenuIcon from "@material-ui/icons/Menu";
import NotificationsIcon from "@material-ui/icons/Notifications";
import Tooltip from "@material-ui/core/Tooltip";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import auth from "../api/auth-helper";

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex"
  },
  toolbar: {
    paddingRight: 24 // keep right padding when drawer closed
  },
  logOut: {
    marginLeft: 24
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

const mainListItems = (
  <div>
    <ListItem button component={Link} to="/">
      <Tooltip title="Dashboard" placement="right">
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
      </Tooltip>
      <ListItemText primary="Dashboard" />
    </ListItem>
    <ListItem button component={Link} to="/transaction">
      <Tooltip title="Add transaction" placement="right">
        <ListItemIcon>
          <AddCircleRoundedIcon />
        </ListItemIcon>
      </Tooltip>
      <ListItemText primary="Add transaction" />
    </ListItem>
    <ListItem button component={Link} to="/entity">
      <Tooltip title="Add Entity" placement="right">
        <ListItemIcon>
          <PersonAddTwoToneIcon />
        </ListItemIcon>
      </Tooltip>
      <ListItemText primary="Add Entity" />
    </ListItem>
    <ListItem button component={Link} to="/showentities">
      <Tooltip title="List Entities" placement="right">
        <ListItemIcon>
          <LayersIcon />
        </ListItemIcon>
      </Tooltip>
      <ListItemText primary="List Entities" />
    </ListItem>
    <ListItem button component={Link} to="/insights">
      <Tooltip title="Insights" placement="right">
        <ListItemIcon>
          <TimelineIcon />
        </ListItemIcon>
      </Tooltip>
      <ListItemText primary="Insights" />
    </ListItem>
  </div>
);

const secondaryListItems = (
  <div>
    <ListSubheader inset>Reports</ListSubheader>
    <ListItem button>
      <Tooltip title="Current Week" placement="right">
        <ListItemIcon>
          <BarChartIcon />
        </ListItemIcon>
      </Tooltip>
      <ListItemText primary="Current Week" />
    </ListItem>
    <ListItem button>
      <Tooltip title="Current Month" placement="right">
        <ListItemIcon>
          <BarChartIcon />
        </ListItemIcon>
      </Tooltip>
      <ListItemText primary="Current Month" />
    </ListItem>
    <ListItem button button component={Link} to="/report" >
      <Tooltip title="Current Year" placement="right">
        <ListItemIcon>
          <BarChartIcon />
        </ListItemIcon>
      </Tooltip>
      <ListItemText primary="Current Year" />
    </ListItem>
  </div>
);

function SignOut() {
  auth.clearJWT();
  window.location.href = "/";
}

export default function Sidebar(props) {
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <AppBar
        position="absolute"
        className={clsx(classes.appBar, open && classes.appBarShift)}
      >
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            className={clsx(
              classes.menuButton,
              open && classes.menuButtonHidden
            )}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            className={classes.title}
          >
            {props.title}
          </Typography>
          <Tooltip title="Notifications" placement="bottom">
            <IconButton color="inherit">
              <Badge badgeContent={4} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>
          <Tooltip title="Logout" placement="bottom">
            <IconButton
              color="inherit"
              onClick={SignOut}
              className={classes.logout}
            >
              <ExitToAppIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="temporary"
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose)
        }}
        open={open}
      >
        <div className={classes.toolbarIcon}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List>{mainListItems}</List>
        <Divider />
        <List>{secondaryListItems}</List>
      </Drawer>
    </div>
  );
}
