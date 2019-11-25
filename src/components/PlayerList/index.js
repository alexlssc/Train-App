import React from 'react'
import { withAuthorization } from '../Session'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import TopBar from "../AppBar";
import MainContentDashboard from "./content";


const MainPage = () => (
    <div>
        <MuiThemeProvider>
            <TopBar content={<MainContentDashboard/>}/>
        </MuiThemeProvider>
    </div>
);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(MainPage);