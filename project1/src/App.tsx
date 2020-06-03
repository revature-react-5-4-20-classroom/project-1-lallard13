import React from 'react';
import { User } from './models/User';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { HomeComponent } from './components/HomeComponent';
import { LoginComponent } from './components/LoginComponent';

// determines state of the App, includes logged in user
interface IAppState {
    loggedInUser: User | null;
}

export default class App extends React.Component<any, IAppState> {

    constructor(props: any) {
        super(props);
        this.state = {
            loggedInUser: null,
        }
    }

    updateUser = (user:User) => {
        this.setState({
            loggedInUser: user,
        });
    }

    render() {
        return(
            <>
            <h1>Project 1: Expense Reimbursement System</h1>
            {/* TODO: replace "guest" with something better */}
            <h2>Welcome, {this.state.loggedInUser ? this.state.loggedInUser.username : 'guest'}</h2>
            <Router>
                {/* TODO: include Navbar, router contents */}
                <Switch>
                    {/* TODO: create the login page */}
                    <Route path="/login" render = {(props) => {return <LoginComponent updateUser = {this.updateUser} {...props}/>}}/>
                    <Route path="/home">
                        {this.state.loggedInUser ? <HomeComponent loggedInUser = {this.state.loggedInUser}/> : <Redirect to="/login" />}
                    </Route>
                </Switch>
            </Router>
            </>
        )
    }
}