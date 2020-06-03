import React from 'react';
import { Navbar, NavbarBrand, Nav, NavItem } from 'reactstrap';
import { NavLink } from 'react-router-dom';

// Creating a top navbar for the home page (reimbursements and profile)

export class NavbarComponent extends React.Component<any,any> {
    render() {
        return(
            <div>
            <Navbar color="light" light expand="md">
                <NavbarBrand>Home</NavbarBrand>
                <Nav className = "mr-auto" navbar>
                    <NavItem>
                        <NavLink to="/home/reimbursements">Reimbursement Page</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink to="/home/profile">Profile</NavLink>
                    </NavItem>
                </Nav>
            </Navbar>
            </div>
        );
    }
}