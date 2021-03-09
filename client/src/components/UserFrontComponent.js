import React, { Component } from 'react';
import {read} from '../api/api-user'
class UserOverall extends Component {

    constructor(props) {
        super(props);

        this.state = {
            balance:'',
            pendingDebit:'',
            pendingCredit:''
        };
    }
    componentWillMount()
    {
        const token=localStorage.getItem('jwtToken');
        read(token).then((data) => {
            console.log(data);
            
            if (data.error) {
                this.setState({ ...this.state})
            } else {
                this.setState({
                    balance:data.balance,
                    pendingDebit:data.pendingAmountDebit,
                    pendingCredit:data.pendingAmountCredit
                })
            }
            console.log(this.state);
        })
    }
    render()
    {
        
        return(
            <div className="row">
                    <div className="col-xl-3 col-md-6 mb-4 ml-2">
                        <div className="card border-left-primary shadow h-100 py-2">
                            <div className="card-body">
                                <div className="row no-gutters align-items-center">
                                    <div className="col mr-2">
                                        <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                                            Net Balance</div>
                                        <div class="h5 mb-0 font-weight-bold text-gray-800"><i className="fa fa-inr">{this.state.balance}</i></div>
                                    </div>
                                    <div class="col-auto">
                                        <i class="fa fa-money fa-2x text-gray-300"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-3 col-md-6 mb-4 ml-auto">
                    <div className="card border-left-primary shadow h-100 py-2">
                        <div className="card-body">
                            <div className="row no-gutters align-items-center">
                                <div className="col mr-2">
                                    <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                                        Pending Balance To Pay</div>
                                    <div class="h5 mb-0 font-weight-bold text-gray-800"><i className="fa fa-inr">{this.state.pendingDebit}</i></div>
                                </div>
                                <div class="col-auto">
                                    <i class="fa fa-money fa-2x text-gray-300"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-xl-3 col-md-6 mb-4 ml-auto">
                <div className="card border-left-primary shadow h-100 py-2">
                    <div className="card-body">
                        <div className="row no-gutters align-items-center">
                            <div className="col mr-2">
                                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                                    Pending Balance To Recieve</div>
                                <div class="h5 mb-0 font-weight-bold text-gray-800"><i className="fa fa-inr">{this.state.pendingCredit}</i></div>
                            </div>
                            <div class="col-auto">
                                <i class="fa fa-money fa-2x text-gray-300"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        )
    }
}


export default UserOverall