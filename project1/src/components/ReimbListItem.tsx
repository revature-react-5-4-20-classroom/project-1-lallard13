import React from 'react'
import { Reimbursement } from '../models/Reimbursement';
import { Row, Collapse, Card, CardBody } from 'reactstrap';

// Simple component for expanding a reimbursement list item

interface IReimbListProps {
    reimbursement: Reimbursement
}

interface IReimbListState {
    isOpen: boolean
}

export class ReimbListItem extends React.Component<IReimbListProps,IReimbListState>{

    constructor(props: IReimbListProps) {
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
                <Row onClick={this.toggle}>Reimbursement id: {this.props.reimbursement.reimbursementId}, Date Submitted: {this.props.reimbursement.dateSubmitted}, Date Resolved: {this.props.reimbursement.dateResolved}...</Row>
                <Collapse isOpen={this.state.isOpen}>
                    <Card color="info">
                        <CardBody>
                            Reimbursement id: {this.props.reimbursement.reimbursementId} <br/>
                            Author: {this.props.reimbursement.author} <br/>
                            Amount: ${this.props.reimbursement.amount} <br/>
                            Date Submitted: {this.props.reimbursement.dateSubmitted} <br/>
                            Date Resolved: {this.props.reimbursement.dateResolved} <br/>
                            Description: {this.props.reimbursement.description} <br/>
                            Resolver: {this.props.reimbursement.resolver} <br/>
                            Status: {this.props.reimbursement.status} <br/>
                            Type: {this.props.reimbursement.type} <br/>
                        </CardBody>
                    </Card>
                </Collapse>
            </div>
        );
    }

}