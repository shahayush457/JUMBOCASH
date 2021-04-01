import "date-fns";
import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { makeStyles } from "@material-ui/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import withStyles from "@material-ui/core/styles/withStyles";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from "@material-ui/pickers";
import Slider from "@material-ui/core/Slider";
import Autocomplete from "./Autocomplete";

const useStyles = makeStyles(theme => ({
  root: {
    padding: 15,
    marginBottom: 15
  },
  content: {
    marginTop: 15
  }
}));

const Toolbar = props => {
  const {
    className,
    startDate,
    setStartDate,
    finishDate,
    setFinishDate,
    priceFilter,
    setPriceFilter,
    handleDateChange,
    handleDateChangeFinish,
    setRangeFilter,
    checkstatus,
    handleChangeStatus,
    checktype,
    handleChangeType,
    checkmode,
    handleChangeMode,
    checkEntityType,
    handleChangeEtype,
    ...rest
  } = props;

  const [rangeValue, rangeSetValue] = React.useState(priceFilter);

  const classes = useStyles();

  const handleChangeRange = (event, newValue) => {
    rangeSetValue(newValue);
  };

  return (
    <div {...rest} className={clsx(classes.root, className)}>
      <Grid container spacing={3}>
        <Grid className={classes.date} item lg={3} sm={6} xl={3} xs={12} m={2}>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Grid container justify="space-around">
              <KeyboardDatePicker
                id="date-picker-dialog"
                label={<span style={{ opacity: 0.6 }}>Start Date</span>}
                format="MM/dd/yyyy"
                value={startDate}
                onChange={handleDateChange}
                KeyboardButtonProps={{
                  "aria-label": "change date"
                }}
              />
            </Grid>
          </MuiPickersUtilsProvider>
        </Grid>
        <Grid className={classes.date} item lg={3} sm={6} xl={3} xs={12} m={2}>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Grid container justify="space-around">
              <KeyboardDatePicker
                id="date-picker-dialog-finish"
                label={<span style={{ opacity: 0.6 }}>Finish Date</span>}
                format="MM/dd/yyyy"
                value={finishDate}
                onChange={handleDateChangeFinish}
                KeyboardButtonProps={{
                  "aria-label": "change date"
                }}
              />
            </Grid>
          </MuiPickersUtilsProvider>
        </Grid>
        <Grid className={classes.range} item lg={3} sm={6} xl={3} xs={12} m={2}>
          <Typography id="range-slider">Amount range</Typography>
          <Slider
            value={rangeValue}
            onChange={handleChangeRange}
            onChangeCommitted={setRangeFilter}
            aria-labelledby="range-slider"
            valueLabelDisplay="auto"
            min={0}
            max={100000}
          />
        </Grid>
        </Grid>
        <Grid container spacing={3}>
        <Grid
          className={classes.status}
          item
          lg={3}
          sm={6}
          xl={3}
          xs={12}
          m={2}
        >
          <Autocomplete
            handleChangeStatus={handleChangeStatus}
            options={checkstatus}
            label="Transaction Status"
          />
        </Grid>
        <Grid
          className={classes.status}
          item
          lg={3}
          sm={6}
          xl={3}
          xs={12}
          m={2}
        >
          <Autocomplete
            handleChangeStatus={handleChangeType}
            options={checktype}
            label="Transaction Type"
          />
        </Grid>
        <Grid
          className={classes.status}
          item
          lg={3}
          sm={6}
          xl={3}
          xs={12}
          m={2}
        >
          <Autocomplete
            handleChangeStatus={handleChangeMode}
            options={checkmode}
            label="Transaction Mode"
          />
        </Grid>
        <Grid
          className={classes.status}
          item
          lg={3}
          sm={6}
          xl={3}
          xs={12}
          m={2}
        >
          <Autocomplete
            handleChangeStatus={handleChangeEtype}
            options={checkEntityType}
            label="Entity Type"
          />
        </Grid>
      </Grid>
    </div>
  );
};

Toolbar.propTypes = {
  className: PropTypes.string
};

export default Toolbar;
