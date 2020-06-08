import React from 'react'
import { User } from '../models/User';
import { updateUser } from '../api/ReimbursementClient';
import { UserListItem } from '../components/UserListItem'
import { Form, FormGroup, Label, Input, Button, Toast, ToastHeader, ToastBody, Jumbotron, Container, Row } from 'reactstrap';

// This is where the admin will be able to update a user
// (or a logged in user can update their own profile)

// TODO: incorporate this into a user list

interface IUpdateUserComponentProps {
    loggedInUser: User | null,
    userToUpdate: User,
    updateUser: (u: User) => void,
}

interface IUpdateUserComponentState {
    newUsername: string,
    newPassword: string,
    confirmPassword: string,
    newFirstName: string,
    newLastName: string,
    newEmail: string,
    newRole: string,
    userDisplay: User | null,
    isError: boolean,
    errorMessage: string,
}

export class UpdateUserComponent extends React.Component<IUpdateUserComponentProps,IUpdateUserComponentState> {

    constructor(props:any) {
        super(props);
        this.state = {
            newUsername: '',
            newPassword: '',
            confirmPassword: '',
            newFirstName: '',
            newLastName: '',
            newEmail: '',
            newRole: '',
            userDisplay: null,
            isError: false,
            errorMessage: '',
        }
    }

    componentDidMount() {
        const u: User = this.props.userToUpdate;
        this.setState({
            newUsername: u.username,
            newPassword: u.password,
            newFirstName: u.firstName,
            newLastName: u.lastName,
            newEmail: u.email,
            newRole: u.role
        });
    }

    handleChange = (e: any) => {
        // @ts-ignore
        this.setState({
            [e.currentTarget.name]: e.currentTarget.value,
        });
    }

    clearError = () => {
        this.setState({
            isError: false,
            errorMessage: '',
        })
    }

    submitForm = async(e:any) => {
        e.preventDefault();
        // applying all edits: unedited fields will not change
        const fieldsToUpdate = {
            userId: this.props.userToUpdate.userId,
            username: this.state.newUsername,
            password: this.state.newPassword,
            firstName: this.state.newFirstName,
            lastName: this.state.newLastName,
            email: this.state.newEmail,
            role: this.state.newRole,
        }
        try{
            if(fieldsToUpdate.password !== this.state.confirmPassword){
                throw new Error('Password does not match!')
            }
            for(let key in fieldsToUpdate) {
                // @ts-ignore
                if(fieldsToUpdate[key] === '') {
                    throw new Error('Please include all fields');
                }
            }
            const updatedUser : User = await updateUser(fieldsToUpdate);
            this.setState({
                userDisplay: updatedUser,
            });
            // For changing the logged in profile
            if(this.props.loggedInUser?.userId === updatedUser.userId) {
                this.props.updateUser(updatedUser);
            }
        } catch(e) {
            console.log(e.message);
            this.setState({
                confirmPassword: '',
                isError: true,
                errorMessage: e.message,
            })
        }
    }

    render() {
        // only the admin can change a role, and only the logged in user can change their own profile
        if((this.props.loggedInUser?.role === 'admin' && this.props.loggedInUser?.userId !== this.props.userToUpdate.userId) && !this.state.userDisplay) {
            return(
                <div>
                    <h1>Edit role for user: {this.props.userToUpdate.username}</h1>
                    <Form onSubmit={this.submitForm}>
                        <FormGroup tag="fieldset">
                            <legend>Update Role</legend>
                            <FormGroup check>
                            <Label check>
                                <Input onChange={this.handleChange} name="newRole" value={'employee'} type="radio" defaultChecked={this.props.userToUpdate.role==='employee'} />{' '}
                                Employee
                            </Label>
                            </FormGroup>
                            <FormGroup check>
                            <Label check>
                                <Input onChange={this.handleChange} name="newRole" value={'finance-manager'} type="radio" defaultChecked={this.props.userToUpdate.role==='finance-manager'} />{' '}
                                Finance Manager
                            </Label>
                            </FormGroup>
                            <FormGroup check>
                            <Label check>
                                <Input onChange={this.handleChange} name="newRole" value={'admin'} type="radio" defaultChecked={this.props.userToUpdate.role==='admin'} />{' '}
                                Admin
                            </Label>
                            </FormGroup>
                        </FormGroup>
                        <Button color="primary">Submit</Button>
                        <Toast isOpen={this.state.isError}>
                            <ToastHeader icon="danger" toggle={this.clearError}>Submission Error:</ToastHeader>
                            <ToastBody>{this.state.errorMessage}</ToastBody>
                        </Toast>
                    </Form>
                </div>
            );
        } else if(this.props.loggedInUser?.userId === this.props.userToUpdate.userId && !this.state.userDisplay) {
            return(
                <div>
                    <h1>Update Profile</h1>
                    <Form onSubmit={this.submitForm}>
                        <FormGroup>
                            <Label for="Username">Username</Label>
                            <Input onChange={this.handleChange} id="Username" name="newUsername" value={this.state.newUsername} type="text" placeholder="Enter a username"/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="Password">Password</Label>
                            <Input onChange={this.handleChange} id="Password" name="newPassword" value={this.state.newPassword} type="password" placeholder="Enter a password"/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="ConfirmPassword">Re-enter Password</Label>
                            <Input onChange={this.handleChange} id="ConfirmPassword" name="confirmPassword" value={this.state.confirmPassword} type="password" placeholder="Re-enter password"/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="FirstName">First Name</Label>
                            <Input onChange={this.handleChange} id="FirstName" name="newFirstName" value={this.state.newFirstName} type="text" placeholder="Enter your first name"/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="LastName">Last Name</Label>
                            <Input onChange={this.handleChange} id="LastName" name="newLastName" value={this.state.newLastName} type="text" placeholder="Enter your last name"/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="email">Email</Label>
                            <Input onChange={this.handleChange} id="Email" name="newEmail" value={this.state.newEmail} type="text" placeholder="Enter your email"/>
                        </FormGroup>

                        {this.props.loggedInUser?.role==='admin' ? 
                        <FormGroup tag="fieldset">
                            <legend>Update Role</legend>
                            <FormGroup check>
                            <Label check>
                                <Input onChange={this.handleChange} name="newRole" value={'employee'} type="radio" defaultChecked={this.props.userToUpdate.role==='employee'} />{' '}
                                Employee
                            </Label>
                            </FormGroup>
                            <FormGroup check>
                            <Label check>
                                <Input onChange={this.handleChange} name="newRole" value={'finance-manager'} type="radio" defaultChecked={this.props.userToUpdate.role==='finance-manager'} />{' '}
                                Finance Manager
                            </Label>
                            </FormGroup>
                            <FormGroup check>
                            <Label check>
                                <Input onChange={this.handleChange} name="newRole" value={'admin'} type="radio" defaultChecked={this.props.userToUpdate.role==='admin'} />{' '}
                                Admin
                            </Label>
                            </FormGroup>
                        </FormGroup> : ''}

                        <Button color="primary">Submit</Button>
                        <Toast isOpen={this.state.isError}>
                            <ToastHeader icon="danger" toggle={this.clearError}>Submission Error:</ToastHeader>
                            <ToastBody>{this.state.errorMessage}</ToastBody>
                        </Toast>
                    </Form>
                </div>
            );
        } else if(this.state.userDisplay) {
            return(
                <Jumbotron>
                    <Container>
                        <Row>
                            <h1>User profile successfully updated!</h1>
                        </Row>
                        <Row>
                            <UserListItem user={this.state.userDisplay}/>
                        </Row>
                    </Container>
                </Jumbotron>
            );
        } else {
            return(
                <>
                    Unauthorized Access
                </>
            );
        }
    }
}