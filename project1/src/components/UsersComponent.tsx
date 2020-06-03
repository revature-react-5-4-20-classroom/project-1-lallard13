import React from 'react';
import { UpdateUserComponent } from './UpdateUserComponent';
// This is where admin can update users and finance manager can view all users. Finance managers can navigate to user reimbursements from here

// take logged in user as prop

export class UsersComponent extends React.Component<any,any> {

    render() {
        return(
            <>
                <h1>This is the users page!</h1>
                <UpdateUserComponent />
            </>
        );
    }
}