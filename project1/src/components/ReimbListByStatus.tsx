import React from 'react';
import { User } from '../models/User';
import { Reimbursement } from '../models/Reimbursement';
import { getReimbursementsByStatus } from '../api/ReimbursementClient';
import { Redirect } from 'react-router';
import { Jumbotron, Container, Row, Col, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Button, Modal, ModalHeader, ModalBody, ListGroup, ListGroupItem } from 'reactstrap';
import { ReimbListItem } from './ReimbListItem';
import { UpdateReimbComponent } from './UpdateReimbComponent';

// component for listing reimbursements by status (had some trouble incorporating this one in the regular list)

interface IReimbListByStatusProps {
    loggedInUser: User | null,
}

interface IReimbListByStatusState {
    statusId: number,
    reimbDisplay: Reimbursement[],
    statusDisplay: string,
    reimbToUpdate: Reimbursement | null,
}

export class ReimbListByStatus extends React.Component<IReimbListByStatusProps, IReimbListByStatusState> {

    constructor(props: any) {
        super(props);
        this.state = {
            statusId: 1,
            reimbDisplay: [],
            statusDisplay: 'Pending',
            reimbToUpdate: null,
        }
    }

    componentDidMount() {
        this.getReimbursements();
    }

    getReimbursements = async () => {
        console.log(this.state.statusId);
        const newReimbs: Reimbursement[] = await getReimbursementsByStatus(this.state.statusId);
        console.log(newReimbs);
        this.setState({
            reimbDisplay: newReimbs,
        });
        console.log("Set the new reimbs!")
    }

    changeStatusId = async (e: any) => {
        const newId = parseInt(e.currentTarget.value);
        let newStatus: string;
        switch(newId) {
            case 1: { newStatus = 'Pending'; break; }
            case 2: { newStatus = 'Denied'; break; }
            case 3: { newStatus = 'Approved'; break }
            default: {newStatus = '';}
        };
        this.setState({
            statusId: newId,
            statusDisplay: newStatus,
        }, this.getReimbursements);
    }

    toggleModal = (e:any) => {
        this.setState({
            reimbToUpdate: this.state.reimbDisplay[e.currentTarget.value],
        })
    }

    clearUpdate = async () => {
        this.setState({
            reimbToUpdate: null,
        })
        await this.getReimbursements();
    }

    render() {
        return(
            <>
            {(this.props.loggedInUser?.role !== 'finance-manager') ?
            <Redirect to='/home'/> : <>
            <Jumbotron>
                <Container>
                    <Row>
                        <Col xs='auto'>
                            <h2>Reimbursements for status: {this.state.statusDisplay}</h2>
                        </Col>
                        <Col xs='auto'>
                            <UncontrolledDropdown>
                                <DropdownToggle caret>
                                    Status Type: {this.state.statusDisplay}
                                </DropdownToggle>
                                <DropdownMenu>
                                    <DropdownItem id="Pending" value="1" onClick={this.changeStatusId}>Pending</DropdownItem>
                                    <DropdownItem id="Denied" value="2" onClick={this.changeStatusId}>Denied</DropdownItem>
                                    <DropdownItem id="Approved" value="3" onClick={this.changeStatusId}>Approved</DropdownItem>
                                </DropdownMenu>
                            </UncontrolledDropdown>
                        </Col>
                    </Row>
                    <ListGroup style={{maxHeight:"500px", overflowY:"auto"}}>
                        {this.state.reimbDisplay.map((reimb: Reimbursement, i: number) => {
                            return(<ListGroupItem key={i}>
                                    <Row>
                                        {/* Offer update button for finance managers. This will change the state to create the update modal */}
                                        <Col xs="auto">
                                        {this.props.loggedInUser?.role === 'finance-manager' ? 
                                        <Button onClick={this.toggleModal} value={i}>Update</Button> : ''}
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
            }
            </>
        );
    }
}