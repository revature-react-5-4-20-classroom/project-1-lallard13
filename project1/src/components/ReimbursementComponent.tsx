import React from 'react';
import { SubmitComponent } from './SubmitComponent';
import { UpdateReimbComponent } from './UpdateReimbComponent';
import { User } from '../models/User';
import { ReimbListComponent } from './ReimbListComponent';
import { ReimbListByStatus } from './ReimbListByStatus';
import { Switch, Route, Redirect } from 'react-router';
import { Button, Navbar, NavbarBrand, Nav, NavItem } from 'reactstrap';
import { NavLink } from 'react-router-dom';
// This is where the user can view their own reimbursements and submit new ones. The finance manager will have some additional options
// may create a seperate component page just for displaying the "list"

interface IReimbursementComponentProps {
    loggedInUser: User | null,
    history: any,
    match: any,
}
export class ReimbursementComponent extends React.Component<IReimbursementComponentProps,any> {

    constructor(props: IReimbursementComponentProps) {
        super(props);
    }

    goToSubmit = () => {
        this.props.history.push('/home/reimbursements/submit');
    }

    render() {
        return(
            <div>
            <Redirect to="/home/reimbursements/view"/>
            <Navbar color="light" light expand="md">
                <NavbarBrand>Reimbursements</NavbarBrand>
                <Nav className = "mr-auto" navbar>
                    <NavItem>
                        <NavLink className="nav-link" activeClassName="active" to="/home/reimbursements/view">View Reimbursements</NavLink>
                    </NavItem>
                    {this.props.loggedInUser?.role === 'finance-manager' ?
                        <NavLink className="nav-link" activeClassName="active" to="/home/reimbursements/status">View Reimbursements by Status (Finance Manager)</NavLink> : ''}
                    <NavItem>
                        <NavLink className="nav-link" activeClassName="active" to="/home/reimbursements/submit">Submit Reimbursement</NavLink>
                    </NavItem>
                </Nav>
            </Navbar>
            <hr/>
                <Switch>
                    {/* <Route path="/home/reimbursements/view">
                    <ReimbListComponent loggedInUser={this.props.loggedInUser}/>
                    </Route> */}
                    <Route path="/home/reimbursements/view" render = {(props)=>{return <ReimbListComponent loggedInUser={this.props.loggedInUser} {...props} />}} />
                    <Route path="/home/reimbursements/submit" render={(props)=>{return <SubmitComponent {...props} />}}/>
                    <Route path="/home/reimbursements/status" render={(props)=>{return <ReimbListByStatus loggedInUser={this.props.loggedInUser} {...props} />}} />
                </Switch>
                {/* May make submission a new path */}
                {/* <SubmitComponent />
                <UpdateReimbComponent /> */}
            </div>
        );
    }
}