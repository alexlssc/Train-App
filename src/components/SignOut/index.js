import React from 'react';
import { withFirebase } from '../Firebase';
import Button from '@material-ui/core/Button';

const style = {
    backgroundColor: 'transparent',
    color: 'white',
    height: 'auto'
}

const SignOutButton = ({ firebase }) => (
    <Button type="button" style={style} onClick={firebase.doSignOut}>
        Déconnexion
    </Button>
);
export default withFirebase(SignOutButton);