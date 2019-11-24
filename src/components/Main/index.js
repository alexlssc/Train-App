import React from 'react'
import SignOutButton from '../SignOut'
import { withAuthorization } from '../Session'

const MainPage = () => (
    <div>
        <h1>Main Page</h1>
        <h2>{process.env.REACT_APP_SECRET_VALUE}</h2>
        <SignOutButton />
    </div>
);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(MainPage);