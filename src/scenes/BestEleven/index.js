import React from 'react'
import { withAuthorization } from '../../components/Session'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Skeleton from "../DisplaySkeleton";
import BestElevenContent from "./content";


const MainPage = () => (
    <div>
        <MuiThemeProvider>
            <Skeleton content={<BestElevenContent/>}/>
        </MuiThemeProvider>
    </div>
);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(MainPage);