import React, { Component } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import Table from "@material-ui/core/Table";
import { Toolbar, InputAdornment, Button } from "@material-ui/core";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { Search } from "@material-ui/icons";
import EditIcon from "@material-ui/icons/Edit";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import Title from "./Title";
import Input from "./Input";
import StatusBullet from "./StatusBullet";
import { CsvBuilder } from 'filefy';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import { spacing } from '@material-ui/system';
import Box from '@material-ui/core/Box';
const statusColors = {
  paid: "success",
  processing: "info",
  pending: "danger"
};

const headCells = [
  { id: "createdAt", label: "Date (GMT +5:30)" },
  { id: "entity.name", label: "Name", disableSorting: true },
  { id: "eType", label: "Entity Type", disableSorting: true },
  { id: "transactionType", label: "Type" },
  { id: "transactionStatus", label: "Status" },
  { id: "transactionMode", label: "Mode" },
  { id: "amount", label: "Amount" }
];




class Transactions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filterFn: {
        fn: transactions => {
          return transactions;
        }
      }
    };
    this.handleSearch = this.handleSearch.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick ()
  {
    
    var csvBuilder = new CsvBuilder("trasactions.csv")
                     .setColumns(["Date","Name","Entity Type","Type","Status","Mode", "Amount"])
  
    this.state.filterFn.fn(this.props.transactions).forEach(function(row) {
        //console.log(row);
        let currow=[];
      
        currow.push(moment(row.createdAt).format("dddd, MMMM Do YYYY, h:mm:ss a"))
        currow.push(row.entity[0].name)
        currow.push(row.entity[0].entityType)
        currow.push(row.transactionType)
        currow.push(row.transactionStatus)
        currow.push(row.transactionMode)
        currow.push(row.amount)
        
        

        csvBuilder.addRow(currow);
    });
    csvBuilder.exportFile();
    
  }
  handleSearch = e => {
    let target = e.target;
    this.setState({
      filterFn: {
        fn: transactions => {
          if (target.value == "") return transactions;
          else
            return transactions.filter(transaction =>
              transaction.entity[0].name
                .toLowerCase()
                .includes(target.value.toLowerCase())
            );
        }
      }
    });
  };

  render() {
    const recordsAfterPagingAndSorting = () => {
      return this.state.filterFn.fn(this.props.transactions);
    };

    const menu = recordsAfterPagingAndSorting().map(row => (
      <TableRow key={row.id}>
        <TableCell>
          <Link to={"transaction/edit/" + row._id}>
            <Tooltip title="Edit" placement="right">
              <IconButton color="inherit">
                <EditIcon />
              </IconButton>
            </Tooltip>
          </Link>
        </TableCell>
        <TableCell>
          {moment(row.createdAt).format("dddd, MMMM Do YYYY, h:mm:ss a")}
        </TableCell>
        <TableCell>{row.entity[0].name}</TableCell>
        <TableCell>{row.entity[0].entityType}</TableCell>
        <TableCell>{row.transactionType}</TableCell>
        <TableCell>
          <StatusBullet color={statusColors[row.transactionStatus]} size="sm" />
          {row.transactionStatus}
        </TableCell>
        <TableCell>{row.transactionMode}</TableCell>
        <TableCell align="right">{row.amount}</TableCell>
      </TableRow>
    ));
    
    return (
      <React.Fragment>
        <Toolbar>
          <Input
            label="Search Entities"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              )
            }}
            onChange={this.handleSearch}
          />
           <Box ml="auto" >
              <Button variant="contained" color="primary" onClick={this.handleClick}>
                <ArrowDownwardIcon/>
              </Button>
          </Box>
        </Toolbar>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              {headCells.map(headCell => (
                <TableCell
                  key={headCell.id}
                  sortDirection={
                    this.props.orderBy === headCell.id
                      ? this.props.order
                      : false
                  }
                >
                  {headCell.disableSorting ? (
                    headCell.label
                  ) : (
                    <TableSortLabel
                      active={this.props.orderBy === headCell.id}
                      direction={
                        this.props.orderBy === headCell.id
                          ? this.props.order
                          : "asc"
                      }
                      onClick={() => {
                        this.props.handleSortRequest(headCell.id);
                      }}
                    >
                      {headCell.label}
                    </TableSortLabel>
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>{menu}</TableBody>
        </Table>
      </React.Fragment>
    );
  }
}

export default Transactions;
