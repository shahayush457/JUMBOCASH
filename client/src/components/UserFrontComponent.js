import React, { Component } from 'react';
import {Link} from "react-router-dom"
import {read} from '../api/api-user'
import auth from '../api/auth-helper';
import i1 from '../images/header-hero.jpg'
import i2 from '../images/header.png'
import '../css/userfront.css'
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
            
            if (data.error) {
                this.setState({ ...this.state})
            } else {
                this.setState({
                    balance:data.balance,
                    pendingDebit:data.pendingAmountDebit,
                    pendingCredit:data.pendingAmountCredit
                })
            }
        })
    }
    render()
    {
        //console.log(auth.isAuthenticated)
        if(auth.isAuthenticated())
        {
            return(
                <div className="row">
                        <div className="col-xl-3 col-md-6 mb-4 ml-5 mr-5">
                            <div className="card border-left-primary shadow h-100 py-2">
                                <div className="card-body">
                                    <div className="row no-gutters align-items-center">
                                        <div className="col mr-2">
                                            <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                                                Net Balance</div>
                                            <div className="h5 mb-0 font-weight-bold text-gray-800"><i className="fa fa-inr">{this.state.balance}</i></div>
                                        </div>
                                        <div className="col-auto">
                                            <i className="fa fa-money fa-2x text-gray-300"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-3 col-md-6 mb-4 ml-5 mr-5">
                        <div className="card border-left-primary shadow h-100 py-2">
                            <div className="card-body">
                                <div className="row no-gutters align-items-center">
                                    <div className="col mr-2">
                                        <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                                            Pending Balance To Pay</div>
                                        <div className="h5 mb-0 font-weight-bold text-gray-800"><i className="fa fa-inr">{this.state.pendingDebit}</i></div>
                                    </div>
                                    <div className="col-auto">
                                        <i className="fa fa-money fa-2x text-gray-300"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-3 col-md-6 mb-4 ml-5 mr-5 ">
                    <div className="card border-left-primary shadow h-100 py-2">
                        <div className="card-body">
                            <div className="row no-gutters align-items-center">
                                <div className="col mr-2">
                                    <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                                        Pending Balance To Recieve</div>
                                    <div className="h5 mb-0 font-weight-bold text-gray-800"><i className="fa fa-inr">{this.state.pendingCredit}</i></div>
                                </div>
                                <div className="col-auto">
                                    <i className="fa fa-money fa-2x text-gray-300"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                   
                </div>
                    <div className="d-none d-md-block ">
                        {/* <img id="userimg" src={i2} alt="Hero"/> */}
                    </div>
                </div>
            )
            
        }
        else
        {
            return (
                <div className="row">
                    <div id="home" className="header-hero bg_cover d-lg-flex align-items-center" style={{"background-image": {i1}}}>
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-7">
                                    <div className="header-hero-content">
                                        <h1 className="hero-title wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.2s"><b>A</b> <span>Cash Flow Management</span>  portal for <b>Effective management.</b></h1>
                                        {/* <p class="text wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.5s">Phasellus vel elit efficitur, gravida libero sit amet, scelerisque  tortor arcu, commodo sit amet nulla sed.</p> */}
                                        <div className="header-singup wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.8s">
                                            {/* <button class="main-btn">Sign Up</button> */}
                                            <Link className="main-btn" to="/register">Register</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div> 
                        <div className="header-hero-image d-flex align-items-center wow fadeInRightBig" data-wow-duration="1s" data-wow-delay="1.1s">
                            <div className="image">
                                <img src={i2} alt="Hero"/>
                            </div>
                        </div>
                    </div> 

                </div>
            )
        }
       
    }
}


export default UserOverall