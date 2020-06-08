import React from 'react';
import { User } from '../models/User';
import { getAllUsers } from '../api/ReimbursementClient';
import { Redirect } from 'react-router';
import { Jumbotron, Container, Row, Col, Input, ListGroup, ListGroupItem, Button, Modal, ModalHeader, ModalBody, Label } from 'reactstrap';
import { UserListItem } from './UserListItem';
import { UpdateUserComponent } from './UpdateUserComponent';

// component for listing all users (admin and finance manager only)

interface IUserListComponentProps {
    loggedInUser: User | null,
    updateUser: (u: User) => void,
}

interface IUserListComponentState {
    users: User[],
    currentDisplay: User[],
    filterUserId: number,
    userToUpdate: User | null,
}

export class UsersListComponent extends React.Component<IUserListComponentProps, IUserListComponentState> {

    constructor(props: any) {
        super(props);
        this.state = {
            users: [],
            currentDisplay: [],
            filterUserId: 0,
            userToUpdate: null,
        }
    }

    componentDidMount() {
        this.getUsers();
    }

    getUsers = async () => {
        const newUsers: User[] = await getAllUsers();
        this.setState({
            users: newUsers,
            currentDisplay: newUsers,
        })
    }

    changeUserId = (e: any) => {
        let i: number;
        if(e.currentTarget.value === '' || e.currentTarget.value <= 0) {
            i = 0;
            this.setState({
                filterUserId: 0,
            })
        } else {
            i = parseInt(e.currentTarget.value);
            this.setState({
                filterUserId: parseInt(e.currentTarget.value),
            })
        }
        this.applyFilter(i);
    }

    applyFilter = (i: number) => {
        const newDisplay: User[] = this.state.users.filter((user: User) => {return(
            user.userId === i || i === 0);});
        this.setState({
            currentDisplay: newDisplay,
        });
    }

    toggleModal = (e:any) => {
        this.setState({
            userToUpdate: this.state.currentDisplay[e.currentTarget.value],
        });
    }

    clearUpdate = async() => {
        this.setState({
            userToUpdate: null,
        });
        await this.getUsers();
    }

    render() {
        return(
            <>
            {(this.props.loggedInUser?.role !== 'finance-manager' && this.props.loggedInUser?.role !== 'admin') ?
            <Redirect to='/home'/> : <>
            <Jumbotron>
                <Container>
                    <Row>
                        <Col xs='auto'>
                            <Label for="userInput" style={{fontSize:"24px", fontWeight:'bold'}}>Users</Label>
                        </Col>
                        <Col xs='auto'>
                            <Input type="number" onChange={this.changeUserId} id="userInput" placeholder="Enter a User id"/>
                        </Col>
                    </Row>
                    <ListGroup style={{maxHeight:"500px", overflowY:"auto"}}>
                        {this.state.currentDisplay.map((user: User, i: number) => {
                            return(<ListGroupItem key={i}>
                                    <Row>
                                        {/* Offer update button for admins. This will change the state to create the update modal */}
                                        <Col xs="auto">
                                        {this.props.loggedInUser?.role === 'admin' ? 
                                        <Button color="primary" onClick={this.toggleModal} value={i} size="sm">Update</Button> : ''}
                                        </Col>
                                        <UserListItem user={user}/> {' '}
                                    </Row>
                                   </ListGroupItem>);
                        })}
                    </ListGroup>
                </Container>
            </Jumbotron>
            <Modal isOpen={this.state.userToUpdate !== null}>
                <ModalHeader toggle={this.clearUpdate}>Update User</ModalHeader>
                <ModalBody>
                    {this.state.userToUpdate !== null ? <UpdateUserComponent loggedInUser = {this.props.loggedInUser} userToUpdate={this.state.userToUpdate} updateUser={this.props.updateUser}/> : ''}
                </ModalBody>
            </Modal>
            </>
            }
            </>
        );
    }
}