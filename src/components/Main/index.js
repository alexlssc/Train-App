import React from 'react'
import { withAuthorization } from '../Session'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import TopBar from "../AppBar";


const MainPage = () => (
    <div>
        <MuiThemeProvider>
            <TopBar/>
        </MuiThemeProvider>
    </div>
);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(MainPage);