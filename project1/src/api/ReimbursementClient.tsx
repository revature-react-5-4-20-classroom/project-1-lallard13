import axios from 'axios';
import { User } from '../models/User';
import { Reimbursement } from '../models/Reimbursement';
import { FailedLoginError } from '../errors/FailedLoginError';

// Creating a client to connect to my EC2

const reimbursementClient = axios.create({
    baseURL: 'http://ec2-54-151-115-37.us-west-1.compute.amazonaws.com:1313',
    withCredentials: true
})

// log in (POST to '/login')
export async function login(un: string, pw: string) : Promise<User> {
    console.log(un);
    console.log(pw);
    try {
        const response = await reimbursementClient.post('/login',{username: un, password: pw});
        const {userId, username, password, firstName, lastName, email, role} = response.data;
        return new User(userId, username, password, firstName, lastName, email, role);
    } catch(e) {
        console.log(e);
        if(e.response.status === 401) {
            throw new FailedLoginError(e.message, un);
        } else {
            throw e;
        }
    }
}

// get User info (employee/finance manager)
// takes id, returns associated user
export async function getUserById(id: number) : Promise<User> {
    try {
        const response = await reimbursementClient.get(`/users/${id}`);
        const {userId, username, password, firstName, lastName, email, role} = response.data;
        console.log(response.data);
        return new User(userId, username, password, firstName, lastName, email, role);
    } catch(e) {
        // Implement error later
        throw(e)
    }
}

// submit a reimbursement request (employee+)
// takes reimbursement, returns reimbursement
export async function submitReimbursement(reimbRequest: Reimbursement) : Promise<Reimbursement> {
    try {
        const response = await reimbursementClient.post('/reimbursements',reimbRequest);
        const {reimbursementId, author, amount, dateSubmitted, dateResolved, description, resolver, status, type} = response.data;
        return new Reimbursement(reimbursementId, author, amount, dateParser(dateSubmitted), dateParser(dateResolved), description, resolver, status, type);
    } catch(e) {
        throw(e);
    }
}

// get reimbursements by user (employee/finance manager)
// takes id, returns array of reimbursements
export async function getReimbursementsByUserId(id: number | undefined) : Promise<Reimbursement[]> {
    try {
        const response = await reimbursementClient.get(`reimbursements/author/userId/${id}`);
        return response.data.map((reimbObj: any) => {
            console.log(reimbObj);
            const {reimbursementId, author, amount, dateSubmitted, dateResolved, description, resolver, status, type} = reimbObj;
            console.log(reimbursementId);
            return new Reimbursement(reimbursementId, author, amount, dateParser(dateSubmitted), dateParser(dateResolved), description, resolver, status, type);
        })
    } catch(e) {
        throw(e);
    }
}

// get reimbursements by status (employee/finance manager)
// takes status is, returns array of reimbursements
export async function getReimbursementsByStatus(id: number) : Promise<Reimbursement[]> {
    try {
        const response = await reimbursementClient.get(`reimbursements/status/${id}`);
        return response.data.map((reimbObj: any) => {
            const {reimbursementId, author, amount, dateSubmitted, dateResolved, description, resolver, status, type} = reimbObj;
            return new Reimbursement(reimbursementId, author, amount, dateParser(dateSubmitted), dateParser(dateResolved), description, resolver, status, type);
        })
    } catch(e) {
        throw(e);
    }
}

// update reimbursements (finance manager)
// takes update fields, returns updated reimbursement
export async function updateReimbursement(updateFields: any) : Promise<Reimbursement> {
    try {
        const response = await reimbursementClient.patch('/reimbursements',updateFields);
        const {reimbursementId, author, amount, dateSubmitted, dateResolved, description, resolver, status, type} = response.data;
        return new Reimbursement(reimbursementId, author, amount, dateParser(dateSubmitted), dateParser(dateResolved), description, resolver, status, type);
    } catch(e) {
        throw(e);
    }
}

// update user (admin/user)
// takes update fields, returns updated user
export async function updateUser(updateFields: any) : Promise<User> {
    try {
        const response = await reimbursementClient.patch(`/users/`,updateFields);
        const {userId, username, password, firstName, lastName, email, role} = response.data;
        return new User(userId, username, password, firstName, lastName, email, role);
    } catch(e) {
        // Implement error later
        throw(e);
    }
}

// get all users (admin/finance manager)
// returns an array of all users
export async function getAllUsers() : Promise<User[]> {
    try{
        const response = await reimbursementClient.get('/users');
        return response.data.map((reimbObj: any) => {
            const {userId, username, password, firstName, lastName, email, role} = reimbObj;
            return new User(userId, username, password, firstName, lastName, email, role);
        });
    } catch(e) {
        throw(e);
    }
}

// Not a client function: just for parsing incoming dates
function dateParser(date: string) : string {
    if(date !== null) {
        const newDate: string = date.slice(0,10);
        return newDate;
    } else {
        return date;
    }
}
