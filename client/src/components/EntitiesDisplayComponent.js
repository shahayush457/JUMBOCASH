import React, { Component } from 'react';
import {
    Card,
    CardBody,
    CardTitle,
    CardText,
    CardSubtitle
} from "reactstrap";
import UserOverall from "./UserFrontComponent"
// A functional compoennet to render single entity
function RenderEntity({ entity }) {
    return (
          <Card >
            <CardBody>
            <CardTitle tag="h6"><span className="fa fa-user fa-lg justify-content-center" /> : {entity.name} <span className="float-right">{entity.entityType}</span></CardTitle>
            <CardSubtitle tag="h6" className="mb-2 text-muted"><i class="fa fa-building"></i> : {entity.address}</CardSubtitle>
            <CardText><i class="fa fa-phone" aria-hidden="true"></i> : {entity.contactNo}</CardText>
            </CardBody>
          </Card>
    );
}


class Entities extends Component {

    constructor(props) {
        super(props);
        
    }
    render()
    {
        const menu = this.props.entities.map(entity => {
            return (
              <div className="col-md-4 mt-3" key={entity.id}>
                <RenderEntity entity={entity} />
              </div>
            );
        });
        return(
            <div className="container-fluid">
               
                    <div className="row">
                       {menu} 
                     </div>
            </div>
        )
    }
}


export default Entities;