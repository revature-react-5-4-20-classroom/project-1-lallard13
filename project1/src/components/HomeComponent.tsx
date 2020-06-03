import React from 'react';
import { Switch, Route } from 'react-router';
import { ProfileComponent } from './ProfileComponent';
import { ReimbursementComponent } from './ReimbursementComponent';
import {UsersComponent} from './UsersComponent';
import { Button } from 'reactstrap';
import { User } from '../models/User';
import { NavbarComponent } from './NavbarComponent';

interface IHomeComponentProps {
    loggedInUser: User | null,
}

export class HomeComponent extends React.Component<IHomeComponentProps,any> {
    constructor(props: any) {
        super(props);
        this.state = {
            counter: 0,
        }
    }

    handleClick = () => {
        const countValue: number = this.state.counter;
        this.setState ({
            counter: countValue + 1,
        })
    }

    // Look into nested routing a bit more
    render() {
        return (
            <>
                <h1>Hello from home!</h1>
                <NavbarComponent/>
                <Switch>
                    <Route path="/home/profile"> 
                        <ProfileComponent loggedInUser={this.props.loggedInUser}/>
                    </Route>
                    <Route path="/home/reimbursements">
                        <ReimbursementComponent loggedInUser={this.props.loggedInUser}/>
                    </Route>
                    {/* This path only accessible for admin and finance-manager */}
                    <Route path="/home/users">
                        <UsersComponent />
                    </Route>
                </Switch>
            </>
        );
    }
}