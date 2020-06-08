import React from 'react';
import { Navbar, NavbarBrand, Nav, NavItem, Button } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import { User } from '../models/User';

// Creating a top navbar for the home page (reimbursements and profile)

interface INavbarComponentProps {
    loggedInUser: User | null,
    logoutUser: () => void,
}

export class NavbarComponent extends React.Component<INavbarComponentProps,any> {

    constructor(props:any) {
        super(props);
    }

    render() {
        return(
            <div>
            <Navbar color="light" light expand="md">
                <NavbarBrand>Navigate</NavbarBrand>
                <Nav className = "mr-auto" navbar>
                    <NavItem>
                        <NavLink to="/home/reimbursements" className="nav-link" activeClassName="active">Reimbursement Page</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink className="nav-link" activeClassName="active" hidden={this.props.loggedInUser?.role !== 'admin' && this.props.loggedInUser?.role !== 'finance-manager'} to="/home/users">Users</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink className="nav-link" activeClassName="active" to="/home/profile">Profile</NavLink>
                    </NavItem>
                    <NavItem tag={()=>{return <Button  hidden={!this.props.loggedInUser} onClick={this.props.logoutUser} color="secondary" outline>Logout</Button>}} />
                </Nav>
            </Navbar>
            <hr/>
            </div>
        );
    }
}