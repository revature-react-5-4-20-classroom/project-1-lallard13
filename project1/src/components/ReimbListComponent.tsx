import React from 'react';
import { User } from '../models/User';
import { Reimbursement } from '../models/Reimbursement';
import { Jumbotron } from 'reactstrap';

// Creating a scrollable, updatable list for reimbursements. Calls the Reimbursement client to fetch Reimbursements by user
// For the finance manager, there will be another option to show other Reimbursements - will add this functionality later

interface IReimbListComponentProps {
    loggedInUser: User,
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

    changeTypeFilter = (e: any) => {
        this.setState({
            byType: e.currentTarget.value,
        } );
        this.applyFilters();
    }

    changeStatusFilter = (e: any) => {
        this.setState({
            byStatus: e.currentTarget.value,
        });
        this.applyFilters();
    }

    applyFilters = () => {
        const filteredByType : Reimbursement[] = this.state.currentDisplay.filter((reimb: Reimbursement) => {
            if(this.state.byType !== '(none)') {
                return (reimb.type === this.state.byType);
            } else {
                return true;
            }
        });

        const filteredByStatus : Reimbursement[] = filteredByType.filter((reimb: Reimbursement) => {
            if(this.state.byStatus !== '(none)') {
                return (reimb.status === this.state.byStatus);
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
                {/* TODO: add dropdown functionality to change filter */}


            </Jumbotron>
        );
    }
}