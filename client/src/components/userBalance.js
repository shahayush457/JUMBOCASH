import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Title from "./Title";

function preventDefault(event) {
  event.preventDefault();
}

const useStyles = makeStyles( theme => ({
  depositContext: {
    flex: 1
  },
  typography: {
    fontSize: '1.2rem',
    '@media (min-width:600px)': {
      fontSize: '1.5rem',
    },
    [theme.breakpoints.up('md')]: {
      fontSize: '2.0rem',
    },
  }
}));

export default function Balance(props) {
  const classes = useStyles();
  return (
    <React.Fragment>
      <Title>{props.title}</Title>
      <Typography className = {classes.typography} component="p" variant="h4">
        Rs. {props.balance}
      </Typography>
    </React.Fragment>
  );
}
