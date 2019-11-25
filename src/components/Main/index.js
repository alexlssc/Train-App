import React from 'react'
import SignOutButton from '../SignOut'
import { withAuthorization } from '../Session'
import AppBar from 'material-ui/AppBar';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

const MainPage = () => (
    <div>
        <MuiThemeProvider>
            <AppBar display="flex" title="Train App">
                <SignOutButton/>
            </AppBar>
        </MuiThemeProvider>
    </div>
);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(MainPage);