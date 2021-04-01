import React, { Component } from "react";
import { Link } from "react-router-dom";
import Table from "@material-ui/core/Table";
import { Toolbar, InputAdornment } from "@material-ui/core";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Box from "@material-ui/core/Box";
import { Search } from "@material-ui/icons";
import EditIcon from "@material-ui/icons/Edit";
import IconButton from "@material-ui/core/IconButton";
import Input from "./Input";
import Title from "./Title";

const headCells = [
  { id: "name", label: "Name" },
  { id: "entityType", label: "Entity Type" },
  { id: "contactNo", label: "Contact No", disableSorting: true },
  { id: "address", label: "Address" }
];

class Entities extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filterFn: {
        fn: entities => {
          return entities;
        }
      }
    };
    this.handleSearch = this.handleSearch.bind(this);
  }

  handleSearch = e => {
    let target = e.target;
    this.setState({
      filterFn: {
        fn: entities => {
          if (target.value == "") return entities;
          else
            return entities.filter(entity =>
              entity.name.toLowerCase().includes(target.value.toLowerCase())
            );
        }
      }
    });
  };

  render() {
    const recordsAfterPagingAndSorting = () => {
      return this.state.filterFn.fn(this.props.entities);
    };

    const menu = recordsAfterPagingAndSorting().map(row => (
      <TableRow key={row.id}>
        <TableCell>
          <Link to={"entity/edit/" + row._id}>
            <IconButton color="inherit">
              <EditIcon />
            </IconButton>
          </Link>
        </TableCell>
        <TableCell>{row.name}</TableCell>
        <TableCell>{row.entityType}</TableCell>
        <TableCell>{row.contactNo}</TableCell>
        <TableCell>{row.address}</TableCell>
      </TableRow>
    ));

    return (
      <React.Fragment>
        <Box justifyContent="center" alignItems="center" minHeight="20vh">
          <Title>Entities</Title>
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
        </Box>
      </React.Fragment>
    );
  }
}

export default Entities;
