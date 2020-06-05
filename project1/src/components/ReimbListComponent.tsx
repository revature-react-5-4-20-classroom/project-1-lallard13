import React from 'react';
import { User } from '../models/User';
import { Reimbursement } from '../models/Reimbursement';
import { Jumbotron, Container, Col, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Row } from 'reactstrap';
import { ReimbListItem } from './ReimbListItem';
import { getReimbursementsByUserId } from '../api/ReimbursementClient';

// Creating a scrollable, updatable list for reimbursements. Calls the Reimbursement client to fetch Reimbursements by user
// For the finance manager, there will be another option to show other Reimbursements - will add this functionality later

interface IReimbListComponentProps {
    loggedInUser: User | null,
}

interface IReimbListComponentState {
    userReimbursements: Reimbursement[],
    currentDisplay: Reimbursement[],
    byType: string,
    byStatus: string,

}

export class ReimbListComponent extends React.Component<IReimbListComponentProps,IReimbListComponentState> {
    
    constructor(props: IReimbListComponentProps) {
        super(props);
        this.state = {
            userReimbursements: [],
            currentDisplay: [],
            byType: '(none)',
            byStatus: '(none)'
        }
    }

    componentDidMount = async () => {
        const reimbList = await getReimbursementsByUserId(this.props.loggedInUser?.userId);
        this.setState({
            userReimbursements: reimbList,
            currentDisplay: reimbList
        });
    }

    changeTypeFilter = (e: any) => {
        const newType: string = e.currentTarget.id;
        this.setState({
            byType: newType,
        } );
        this.applyFilters(newType, this.state.byStatus);
    }

    changeStatusFilter = (e: any) => {
        const newStatus: string = e.currentTarget.id;
        this.setState({
            byStatus: e.currentTarget.id,
        });
        this.applyFilters(this.state.byType, newStatus);
    }

    applyFilters = (type: string, status: string) => {
        // TODO: make this applicable to any user
        const filteredByType : Reimbursement[] = this.state.userReimbursements.filter((reimb: Reimbursement) => {
            if(type !== '(none)') {
                return (reimb.type === type);
            } else {
                return true;
            }
        });

        const filteredByStatus : Reimbursement[] = filteredByType.filter((reimb: Reimbursement) => {
            if(status !== '(none)') {
                return (reimb.status === status);
            } else {
                return true;
            }
        })

        this.setState({
            currentDisplay: filteredByStatus,
        })
    }

    render() {
        return(
            <Jumbotron>
                <Container>
                    <Row>
                        <Col xs='auto'>
                            <h1>Reimbursements for {this.props.loggedInUser?.firstName + ' ' + this.props.loggedInUser?.lastName}</h1>
                        </Col>
                        <Col xs='auto'>
                            <UncontrolledDropdown>
                                <DropdownToggle caret>
                                    Status Filter: {this.state.byStatus}
                                </DropdownToggle>
                                <DropdownMenu>
                                    <DropdownItem id="(none)" onClick={this.changeStatusFilter} >(none)</DropdownItem>
                                    <DropdownItem id="Pending" onClick={this.changeStatusFilter}>Pending</DropdownItem>
                                    <DropdownItem id="Approved" onClick={this.changeStatusFilter}>Approved</DropdownItem>
                                    <DropdownItem id="Denied" onClick={this.changeStatusFilter}>Denied</DropdownItem>
                                </DropdownMenu>
                            </UncontrolledDropdown>
                        </Col>
                        <Col xs='auto'>
                        <UncontrolledDropdown>
                                <DropdownToggle caret>
                                    Type Filter: {this.state.byType}
                                </DropdownToggle>
                                <DropdownMenu>
                                    <DropdownItem id="(none)" onClick={this.changeTypeFilter} >(none)</DropdownItem>
                                    <DropdownItem id="Food" onClick={this.changeTypeFilter}>Food</DropdownItem>
                                    <DropdownItem id="Travel" onClick={this.changeTypeFilter}>Travel</DropdownItem>
                                    <DropdownItem id="Other" onClick={this.changeTypeFilter}>Other</DropdownItem>
                                </DropdownMenu>
                            </UncontrolledDropdown>
                        </Col>
                    </Row>
                    <ul>
                        {this.state.currentDisplay.map((reimb: Reimbursement) => {
                            return <ReimbListItem reimbursement={reimb}/>
                        })}
                    </ul>
                </Container>


            </Jumbotron>
        );
    }
}