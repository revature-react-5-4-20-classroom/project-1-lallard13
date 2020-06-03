import React from 'react';
import { User } from '../models/User';
import { Form, FormGroup, Label, Col, Input, Button, Toast, ToastHeader, ToastBody } from 'reactstrap';
import { login } from '../api/ReimbursementClient';
 
interface ILoginComponentProps {
  updateUser: (user:User) => void;
  history: any;
  match: any;
}

interface ILoginComponentState {
  username: string;
  password: string;
  isError: boolean;
  errorMessage: string;
}

export class LoginComponent extends React.Component<ILoginComponentProps, ILoginComponentState> {

  constructor(props: ILoginComponentProps) {
    super(props);
    this.state = {
      username: '',
      password: '',
      isError: false,
      errorMessage: '',
    }
  }

  // Functions for modifying our state
  setUsername = (unEntry: any) => {
    this.setState({
      username: unEntry.currentTarget.value,
    })
  }

  setPassword = (pwEntry: any) => {
    this.setState({
      password: pwEntry.currentTarget.value,
    })
  }

  clearError = () => {
    this.setState({
      errorMessage: '',
      isError: false,
    })
  }

  attemptLogin = async (event: any) => {
    event.preventDefault();
    console.log(event);
    try {
      const loggedInUser : User | undefined = await login(this.state.username, this.state.password);
      this.props.updateUser(loggedInUser);
      this.setState({
        username: '',
        password: '',
      });
      this.props.history.push('/home');
    } catch (error) {
      this.setState({
        password: '',
        isError: true,
        errorMessage: error.message,
      })
    }
  }

  render() {
    return (
      <div>
      <Form onSubmit={this.attemptLogin}>
        <FormGroup row>
          <Label for="username" sm={2}>Username</Label>
          <Col sm={6}>
            {/* onChange lets Input change state, value lets Input display state */}
            <Input onChange={this.setUsername} value={this.state.username} type="text" name="username" id="username" placeholder="Username" />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for="password" sm={2}>Password</Label>
          <Col sm={6}>
            <Input onChange={this.setPassword} value={this.state.password} type="password" name="password" id="password" required />
          </Col>
        </FormGroup>
        <Button color="info">Submit</Button>
      </Form>
      <Toast isOpen={this.state.isError}>
        <ToastHeader icon="danger" toggle={this.clearError}>
          Error!
        </ToastHeader>
        <ToastBody>
          {this.state.errorMessage}
        </ToastBody>

      </Toast>
      </div>
    );
  }

}