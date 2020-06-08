import React from 'react';
import { Switch, Route } from 'react-router';
import { ProfileComponent } from './ProfileComponent';
import { ReimbursementComponent } from './ReimbursementComponent';
import { UsersListComponent } from './UsersListComponent';
import { User } from '../models/User';
import { NavbarComponent } from './NavbarComponent';

interface IHomeComponentProps {
    loggedInUser: User | null,
    logoutUser: () => void,
    updateUser: (u: User) => void,
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

    render() {
        return (
            <div>
                <NavbarComponent loggedInUser={this.props.loggedInUser} logoutUser={this.props.logoutUser}/>
                <Switch>
                    <Route path="/home/profile"> 
                        <ProfileComponent loggedInUser={this.props.loggedInUser} updateUser={this.props.updateUser}/>
                    </Route>
                    <Route path='/home/reimbursements' render={(props=>{return <ReimbursementComponent loggedInUser={this.props.loggedInUser} {...props} />})}/>
                    {/* This path only accessible for admin and finance-manager */}
                    <Route path="/home/users">
                        <UsersListComponent loggedInUser={this.props.loggedInUser} updateUser={this.props.updateUser} />
                    </Route>
                </Switch>
            </div>
        );
    }
}