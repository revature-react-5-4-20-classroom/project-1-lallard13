import React from 'react'
import { User } from '../models/User';
import { Reimbursement } from '../models/Reimbursement';
import { updateReimbursement } from '../api/ReimbursementClient';
import { Redirect } from 'react-router';
import { Form, FormGroup, Label, Input, Button, Toast, ToastHeader, ToastBody, Jumbotron, Container, Row } from 'reactstrap';
import { ReimbListItem } from './ReimbListItem';

// This is where the finance manager will be able to update a component

interface IUpdateReimbComponentProps {
    loggedInUser: User | null,
    reimbToUpdate: any,
}

interface IUpdateReimbComponentState {
    newDescription: string,
    newStatus: string,
    reimbDisplay: Reimbursement | null,
    isError: boolean,
    errorMessage: string,
}

export class UpdateReimbComponent extends React.Component<IUpdateReimbComponentProps,IUpdateReimbComponentState> {

    constructor(props: IUpdateReimbComponentProps) {
        super(props);
        this.state = {
            newDescription: '',
            newStatus: 'Pending',
            reimbDisplay: null,
            isError: false,
            errorMessage: '',
        }
    }

    // Not sure if this is necessary, but it felt odd using props to directly set the state
    componentDidMount() {
        this.setState({
            newDescription: this.props.reimbToUpdate.description,
            newStatus: this.props.reimbToUpdate.status,
        })
    }

    setDescription = (e: any) => {
        this.setState({
            newDescription: e.currentTarget.value,
        })
    }

    setStatus = (e: any) => {
        this.setState({
            newStatus: e.currentTarget.value,
        })
    }

    clearError = () => {
        this.setState({
            isError: false,
            errorMessage: '',
        })
    }

    submitForm = async (e:any) => {
        e.preventDefault();
        // applying edits and adding new fields automatically
        const todaysDate = new Date();
        const resolver = this.props.loggedInUser?.username;
        const fieldsToUpdate = {
            reimbursementId: this.props.reimbToUpdate.reimbursementId,
            dateResolved: todaysDate,
            description: this.state.newDescription,
            resolver: resolver,
            status: this.state.newStatus,
        }
        try{
            const updatedReimbursement : Reimbursement = await updateReimbursement(fieldsToUpdate);
            this.setState({
                reimbDisplay: updatedReimbursement,
            });
        } catch(e) {
            console.log(e.message);
            this.setState({
                isError: true,
                errorMessage: e.message
            })
        }

    }

    render() {
        // Only the finance manager can access this page
        if(this.props.loggedInUser?.role !== 'finance-manager') {
            return (<Redirect to='/home/reimbursements' />);
        } else if(!this.state.reimbDisplay) {
            return(
                <div>
                    <h1>Reimbursement Update Page (Finance Manager)</h1>
                    <Form onSubmit={this.submitForm}>
                        <FormGroup>
                            <Label for="Description">Description</Label>
                            <Input onChange={this.setDescription} value={this.state.newDescription} id="Description" type="textarea" placeholder="Enter a description" />
                        </FormGroup>
                        <FormGroup tag="fieldset">
                            <legend>Update Status</legend>
                            <FormGroup check>
                            <Label check>
                                <Input onChange={this.setStatus} value={'Pending'} type="radio" name="radio1" defaultChecked/>{' '}
                                Pending
                            </Label>
                            </FormGroup>
                            <FormGroup check>
                            <Label check>
                                <Input onChange={this.setStatus} value={'Denied'} type="radio" name="radio1" />{' '}
                                Denied
                            </Label>
                            </FormGroup>
                            <FormGroup check>
                            <Label check>
                                <Input onChange={this.setStatus} value={'Approved'} type="radio" name="radio1"/>{' '}
                                Approved
                            </Label>
                            </FormGroup>
                        </FormGroup>
                        <Button color="primary">Update Reimbursement</Button>
                        <Toast isOpen={this.state.isError}>
                            <ToastHeader icon="danger" toggle={this.clearError}>Submission Error:</ToastHeader>
                            <ToastBody>{this.state.errorMessage}</ToastBody>
                        </Toast>
                    </Form>
                </div>
            );
        } else {
            return(
                <Jumbotron>
                    <Container>
                        <Row>
                            <h1>Reimbursement successfully updated!</h1>
                        </Row>
                        <Row>
                            <ReimbListItem reimbursement={this.state.reimbDisplay}/>
                        </Row>
                    </Container>
                </Jumbotron>
            );
        }
    }
}