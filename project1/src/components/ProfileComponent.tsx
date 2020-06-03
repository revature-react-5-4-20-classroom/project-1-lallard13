import React from 'react';
import { User } from '../models/User';
import { Card, CardImg, CardBody, CardTitle, CardSubtitle, CardText, Button, Jumbotron } from 'reactstrap';
// For displaying profile information

interface IProfileComponentProps {
    loggedInUser: User | null,
}

export class ProfileComponent extends React.Component<IProfileComponentProps,any> {
    constructor(props: IProfileComponentProps) {
        super(props);
    }
    
    render() {
        return(
            
            <Jumbotron>
                <h1 className="display-3">User Profile for {this.props.loggedInUser?.firstName + ' ' + this.props.loggedInUser?.lastName}</h1>
                <hr className="my-2"/>
                <p className="lead">First Name: {this.props.loggedInUser?.firstName}</p>
                <p className="lead">Last Name: {this.props.loggedInUser?.lastName}</p>
                <p className="lead">Display Name: {this.props.loggedInUser?.username}</p>
                <p className="lead">Email: {this.props.loggedInUser?.email}</p>
                <p className="lead">Access Level: {this.props.loggedInUser?.role}</p>
            </Jumbotron>
        );
    }
}