import React from 'react'
import { User } from '../models/User';
import { Row, Collapse, Card, CardBody, Col, Button } from 'reactstrap';

// Simple component for expanding a user list item

interface IUserListProps {
    user: User
}

interface IUserListState {
    isOpen: boolean
}

export class UserListItem extends React.Component<IUserListProps,IUserListState>{

    constructor(props: IUserListProps) {
        super(props);
        this.state = {
            isOpen: false
        }
    }

    toggle = () => {
        this.setState({
            isOpen: !this.state.isOpen,
        })
    }

    render() {
        return(
            <div>
                <Button xl='auto' size="sm" onClick={this.toggle} color="info" active style={{fontSize:'larger'}}>User id: {this.props.user.userId}, Username: {this.props.user.username}, Role: {this.props.user.role}...</Button>
                <Collapse isOpen={this.state.isOpen}>
                    <Card style={{backgroundColor:'#b4ceef'}}>
                        <CardBody style={{fontSize:'larger'}}>
                            User id: {this.props.user.userId} <br/>
                            Username: {this.props.user.username} <br/>
                            Name: {this.props.user.firstName + ' ' + this.props.user.lastName} <br/>
                            Email: {this.props.user.email} <br/>
                            Role: {this.props.user.role} <br/>
                        </CardBody>
                    </Card>
                </Collapse>
            </div>
        );
    }
}