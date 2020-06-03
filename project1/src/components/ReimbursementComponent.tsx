import React from 'react';
import { SubmitComponent } from './SubmitComponent';
import { UpdateReimbComponent } from './UpdateReimbComponent';
import { User } from '../models/User';
// This is where the user can view their own reimbursements and submit new ones. The finance manager will have some additional options
// may create a seperate component page just for displaying the "list"

interface IReimbursementComponentProps {
    loggedInUser: User | null,
}
export class ReimbursementComponent extends React.Component<IReimbursementComponentProps,any> {

    constructor(props: IReimbursementComponentProps) {
        super(props);
    }

    render() {
        return(
            <>
                <h1>This is the reimbursement page!</h1>
                {/* May make submission a new path */}
                <SubmitComponent />
                <UpdateReimbComponent />
            </>
        );
    }
}