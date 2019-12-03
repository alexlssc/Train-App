import React from 'react'
import { withAuthorization } from '../../Session'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Skeleton from "../../DisplaySkeleton";
import TrainingContent from "./content";


const MainPage = () => (
    <div>
        <MuiThemeProvider>
            <Skeleton content={<TrainingContent/>}/>
        </MuiThemeProvider>
    </div>
);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(MainPage);