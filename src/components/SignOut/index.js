import React from 'react';
import { withFirebase } from '../Firebase';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';


const SignOutButton = ({ firebase }) => (
    <ListItem button key="deconnexion" onClick={firebase.doSignOut}>
        <ListItemIcon><ExitToAppIcon/></ListItemIcon>
        <ListItemText primary="Déconnexion" />
    </ListItem>
);
export default withFirebase(SignOutButton);