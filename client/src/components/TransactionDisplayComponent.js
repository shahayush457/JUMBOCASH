import React, { Component } from 'react';
import moment from 'moment'
import {
    Card,
    CardBody,
    Col,
    Row
} from "reactstrap";
// A functional component to render single entity
function RenderTrans({ trans }) {
    //console.log(trans);
    return (
          <Card >
            <CardBody>
                <div className="row ml-0">
                    <Col md={8}>
                        <Row tag="h5"><span className="fa fa-rupee fa-lg justify-content-center" />  {trans.amount} </Row>
                        <Row tag="h6" className="mb-2 "><i className="fa fa-print"></i>Entity: {trans.entity[0].name}</Row>
                        <Row><i className="fa fa-calendar">{' '+moment(trans.createdAt).format("dddd, MMMM Do YYYY, h:mm:ss a")}</i></Row>
                        <Row className="mt-1">Remarks: {trans.remark}</Row>
                        <Row><i className="fa fa-building"></i> : {trans.entity[0].address}</Row>
                    </Col>
                    <Col md={4} className="mr-auto">
                        <Row><span>Status : {trans.transactionStatus}</span></Row>
                        <Row><i className="fa fa-phone" aria-hidden="true"></i>:{trans.entity[0].contactNo}</Row>
                        <Row><span > Mode : {trans.transactionMode}</span> </Row>
                        <Row>Type : {trans.transactionType}</Row>
                    </Col>
                </div>
            </CardBody>
          </Card>
    );
}


class Transactions extends Component {

   
    render()
    {
        const menu = this.props.transactions.map(trans => {
            return (
              <div className="col-md-4 mt-3" key={trans.id}>
                <RenderTrans trans={trans} />
              </div>
            );
        });
        return(
            <div className="container-fluid">
                     <h5 className="mx-auto">Transactions History </h5>
                    <div className="row">
                       {menu} 
                     </div>
            </div>
        )
    }
}


export default Transactions;