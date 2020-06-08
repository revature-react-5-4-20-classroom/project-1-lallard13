import React from 'react';
import { User } from '../models/User';
import { Reimbursement } from '../models/Reimbursement';
import { Jumbotron, Container, Col, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Row, Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Form, ListGroupItem, ListGroup } from 'reactstrap';
import { ReimbListItem } from './ReimbListItem';
import { getReimbursementsByUserId } from '../api/ReimbursementClient';
import { Switch, Route } from 'react-router';
import { UpdateReimbComponent } from './UpdateReimbComponent';

// Creating a scrollable, updatable list for reimbursements. Calls the Reimbursement client to fetch Reimbursements by user
// For the finance manager, there will be another option to show other Reimbursements - will add this functionality later

interface IReimbListComponentProps {
    loggedInUser: User | null,
    history: any,
}

interface IReimbListComponentState {
    fetchedReimbursements: Reimbursement[],
    currentDisplay: Reimbursement[],
    byType: string,
    byStatus: string,
    reimbToUpdate: Reimbursement | null,
    getByStatus: number,
    idInput: any,
}

export class ReimbListComponent extends React.Component<IReimbListComponentProps,IReimbListComponentState> {
    
    constructor(props: IReimbListComponentProps) {
        super(props);
        this.state = {
            fetchedReimbursements: [],
            currentDisplay: [],
            byType: '(none)',
            byStatus: '(none)',
            reimbToUpdate: null,
            getByStatus: 0,
            idInput: 0,
        }
    }

    componentDidMount = async () => {
        const reimbList = await getReimbursementsByUserId(this.props.loggedInUser?.userId);
        this.setState({
            fetchedReimbursements: reimbList,
            currentDisplay: reimbList,
            idInput: this.props.loggedInUser?.userId,
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

    changeIdInput = (e: any) => {
        this.setState({
            idInput: e.currentTarget.value,
        })
    }

    applyFilters = (type: string, status: string) => {
        const filteredByType : Reimbursement[] = this.state.fetchedReimbursements.filter((reimb: Reimbursement) => {
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

    toggleModal = (e:any) => {
        this.setState({
            reimbToUpdate: this.state.currentDisplay[e.currentTarget.value],
        })
    }

    clearUpdate = async () => {
        this.setState({
            reimbToUpdate: null,
        })
        const reimbList = await getReimbursementsByUserId(this.state.idInput);
        this.setState({
            fetchedReimbursements: reimbList,
            currentDisplay: reimbList,
            byType: '(none)',
            byStatus: '(none)',
        });
    }

    getByUserId = async (e: any) => {
        e.preventDefault();
        try{
            const newReimbs: Reimbursement[] = await getReimbursementsByUserId(this.state.idInput);
            console.log(newReimbs);
            this.setState({
                fetchedReimbursements: newReimbs,
            })
        } catch {
            this.setState({
                fetchedReimbursements: [],
            })
        } finally {
            this.applyFilters(this.state.byType, this.state.byStatus);
        }
    }

    render() {
        return(
            <>
            <Jumbotron>
                <Container>
                    <Row>
                        <Col xs='auto'>
                            <h2>Reimbursements for {
                                this.props.loggedInUser?.role !== 'finance-manager' ? this.props.loggedInUser?.firstName + ' ' + this.props.loggedInUser?.lastName :
                                'User Id ' + this.state.idInput}
                            </h2>
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
                        {this.props.loggedInUser?.role==='finance-manager' ? 
                        <Col xs='auto'>
                                <Input type="number" value={this.state.idInput} placeholder="User Id" onChange={this.changeIdInput} />
                                <Button color="info" onClick={this.getByUserId}>OK</Button>
                        </Col> : ''}
                    </Row>
                    <ListGroup style={{maxHeight:"500px", overflowY:"auto"}}>
                        {this.state.currentDisplay.map((reimb: Reimbursement, i: number) => {
                            return(<ListGroupItem key={i}>
                                    <Row>
                                        {/* Offer update button for finance managers. This will change the state to create the update modal */}
                                        <Col xs="auto">
                                        {this.props.loggedInUser?.role === 'finance-manager' ? 
                                        <Button color="primary" onClick={this.toggleModal} value={i} size="sm">Update</Button> : ''}
                                        </Col>
                                        <ReimbListItem reimbursement={reimb}/>{' '}
                                    </Row>
                                    </ListGroupItem>);
                        })}
                    </ListGroup>
                </Container>
            </Jumbotron>
            <Modal isOpen={this.state.reimbToUpdate !== null}>
                <ModalHeader toggle={this.clearUpdate}>Update Reimbursement</ModalHeader>
                <ModalBody>
                    <UpdateReimbComponent loggedInUser = {this.props.loggedInUser} reimbToUpdate={this.state.reimbToUpdate}/>
                </ModalBody>
            </Modal>
            </>
        );
    }
}