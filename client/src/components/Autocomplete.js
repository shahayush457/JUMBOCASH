import React from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";

const useStyles = makeStyles(theme => ({
  root: {
    "& > * + *": {
      marginTop: theme.spacing(3)
    }
  }
}));

export default function Multi({ handleChangeStatus, values, options, label }) {
  const classes = useStyles();

  const defaultProps = {
    options: options,
    getOptionLabel: option => option.name
  };

  return (
    <div className={classes.root}>
      <Autocomplete
        {...defaultProps}
        multiple
        style={{ width: 200 }}
        onChange={handleChangeStatus}
        id={label}
        renderInput={params => (
          <TextField {...params} label={label} variant="outlined" />
        )}
      />
    </div>
  );
}
