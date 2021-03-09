import React, { Component } from 'react';

class UserOverall extends Component {
    constructor(props)
    {
        super(props);
    }
    

    render()
    {
        
        return(
            <div className="col-xl-3 col-md-6 mb-4">
                <div className="card border-left-primary shadow h-100 py-2">
                    <div className="card-body">
                        <div className="row no-gutters align-items-center">
                            <div className="col mr-2">
                                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                                    Net Balance</div>
                                <div class="h5 mb-0 font-weight-bold text-gray-800"><i className="fa fa-inr">40,000</i></div>
                            </div>
                            <div class="col-auto">
                                <i class="fa fa-calendar fa-2x text-gray-300"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}


export default UserOverall