import React from 'react'
import { Reimbursement } from '../models/Reimbursement';
import { submitReimbursement } from '../api/ReimbursementClient';
import { Form, FormGroup, Label, Input, Button, FormFeedback, Modal, Toast, ToastHeader, ToastBody } from 'reactstrap';
import { ReimbListItem } from './ReimbListItem';
import { User } from '../models/User';

// This is where users will be able to submit a component. I don't know if I want it to be a seperate path or part of the page itself

// Don't need passed in user or username, because that's automatically handled on the back end
// TODO: add loggedInUser - should fix logout issue

interface ISubmitComponentProps {
    loggedInUser: User | null,
    history: any,
    match: any,
}

interface ISubmitComponentState {
    amount: number | null,
    description: string,
    type: string,
    submitted: boolean,
    amountWarning: string | null,
    reimbursement: Reimbursement | null,
    isError: boolean,
    errorMessage: string,
}

export class SubmitComponent extends React.Component<any,ISubmitComponentState> {

    constructor(props: any) {
        super(props);
        this.state = {
            amount: null,
            description: '',
            type: 'Other',
            submitted: false,
            amountWarning: null,
            reimbursement: null,
            isError: false,
            errorMessage: "",
        };
    }

    // set methods for when new values are typed / selected
    setAmount = (e: any) => {
        const newAmount: number = e.currentTarget.value;
        if(newAmount > 0) {
            this.setState({
                amountWarning: null,
                amount: newAmount,
            })
        } else {
            this.setState({
                amountWarning: 'Amount must be greater than zero!',
                amount: newAmount
            })
        }
    }

    setDescription = (e: any) => {
        const newDesc: string = e.currentTarget.value;
        this.setState({
            description: newDesc,
        });
    }

    setType = (e: any) => {
        const newType: string = e.currentTarget.value;
        this.setState({
            type: newType,
        });
    }

    submitForm = async (submitEvent: any) => {
        submitEvent.preventDefault();
        try{
            console.log('In submitForm')
            if(this.state.amount === null || this.state.amount <= 0 ) {
                console.log("In if statement");
                this.setState ({
                    amount: null,
                })
                throw new Error('Submission must contain Amount that is greater than 0!');
            } else {
                const reimbToSubmit: Reimbursement = new Reimbursement(0,"placeholder",this.state.amount,"placeholder","placeholder",this.state.description,"placeholder","placeholder",this.state.type);
                const submittedReimbursement: Reimbursement = await submitReimbursement(reimbToSubmit);
                console.log('Just got the new reimbursement');
                this.setState({
                    submitted: true,
                    reimbursement: submittedReimbursement,
                });
                console.log('Set the state');
            }
        } catch(e) {
            console.log(e.message);
            this.setState({
                isError: true,
                errorMessage: e.message,
            });
        }
    }

    clearError = () => {
        if(this.state.isError) {
            this.setState({
                isError: false,
                errorMessage: "",
            })
        }
    }
    
    clearAll = () => {
        console.log('In clearAll');
        this.setState({
            amount: null,
            description: '',
            type: 'Other',
            submitted: false,
            amountWarning: null,
            reimbursement: null,
            isError: false,
            errorMessage: "",
        });
    }

    goHome = () => {
        console.log('In goHome');
        this.props.history.push('/home');
    }

    render() {

        return(
            <div>
                <h1>Reimbursement Submission Page</h1>
                <Form onSubmit={this.submitForm}>
                    <FormGroup>
                        <Label for="Amount">Amount</Label>
                        <Input onChange={this.setAmount} value={this.state.amount ? this.state.amount : ""} type="number" id="amount" name="amount" placeholder="Enter any value above 0" invalid={this.state.amountWarning === ""} />
                        {this.state.amountWarning ? <FormFeedback>{this.state.amountWarning}</FormFeedback> : ''}
                    </FormGroup>
                    <FormGroup>
                        <Label for="Description">Description</Label>
                        <Input onChange={this.setDescription} value={this.state.description} id="Description" type="textarea" placeholder="Enter a description for your reimbursement" />
                    </FormGroup>
                    <FormGroup tag="fieldset">
                        <legend>Reimbursement Type</legend>
                        <FormGroup check>
                        <Label check>
                            <Input onChange={this.setType} value={'Food'} type="radio" name="radio1" />{' '}
                            Food
                        </Label>
                        </FormGroup>
                        <FormGroup check>
                        <Label check>
                            <Input onChange={this.setType} value={'Travel'} type="radio" name="radio1" />{' '}
                            Travel
                        </Label>
                        </FormGroup>
                        <FormGroup check>
                        <Label check>
                            <Input onChange={this.setType} value={'Other'} type="radio" name="radio1" defaultChecked/>{' '}
                            Other
                        </Label>
                        </FormGroup>
                    </FormGroup>
                    <Button>Submit Reimbursement Request</Button>
                    <Toast isOpen={this.state.isError}>
                        <ToastHeader icon="danger" toggle={this.clearError}>Submission Error:</ToastHeader>
                        <ToastBody>{this.state.errorMessage}</ToastBody>
                    </Toast>
                    <Toast isOpen={this.state.submitted}>
                        <ToastHeader toggle={this.clearAll}>Reimbursement Request Submitted!</ToastHeader>
                        <ToastBody>
                            {this.state.reimbursement ? <ReimbListItem reimbursement={this.state.reimbursement}/> : ''}
                        </ToastBody>
                    </Toast>
                </Form>
            </div>
        );
    }
}