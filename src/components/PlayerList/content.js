import React from 'react';
import PlayerTable from "./table";
import Fab from "@material-ui/core/Fab";
import AddIcon from '@material-ui/icons/Add';
import './style.css'

class MainContent extends React.Component{

    render() {
        return (
            <div>
                <PlayerTable/>
                <Fab id="addPlayerButton" color="primary" aria-label="add">
                    <AddIcon />
                </Fab>
            </div>
        );
    }
}

export default MainContent;