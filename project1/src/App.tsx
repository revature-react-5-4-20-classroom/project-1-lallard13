import React from 'react';
import { User } from './models/User';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { HomeComponent } from './components/HomeComponent';
import { LoginComponent } from './components/LoginComponent';
import { Jumbotron } from 'reactstrap';

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

    logOutUser = () => {
        this.setState({
            loggedInUser: null,
        })
    }

    render() {
        return(
            <div className="App">
            <Jumbotron className='display-1' style={{backgroundColor: '#142074', color: 'white'}}>
            <h1>Project 1: Expense Reimbursement System</h1>
            <h2>{this.state.loggedInUser ? `Welcome, ${this.state.loggedInUser.username}` : 'Please Login'}</h2>
            </Jumbotron>
            <Router>
                <Switch>
                    <Route exact path="/">
                        {this.state.loggedInUser ? (
                            <Redirect to="/home" />
                        ) : (
                            <Redirect to="/login" />
                        )}
                    </Route>
                    <Route path="/login" render = {(props) => {return <LoginComponent updateUser = {this.updateUser} {...props}/>}}/>
                    <Route path="/home">
                        {this.state.loggedInUser ? (
                            <HomeComponent loggedInUser = {this.state.loggedInUser} logoutUser={this.logOutUser} updateUser={this.updateUser}/>
                        ) : (
                            <Redirect to="/login" />
                        )}
                    </Route>
                </Switch>
            </Router>
            </div>
        )
    }
}