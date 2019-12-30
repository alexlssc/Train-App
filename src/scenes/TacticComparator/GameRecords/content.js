import React from 'react';
import {makeStyles} from "@material-ui/core";
import TacticComparatorTable from "./components/Table";
import AddCircleIcon from '@material-ui/icons/AddCircle';
import {Button} from "@material-ui/core";
import clubData from "../../../constants/clubs.json";

const useStyle = makeStyles({
    button: {
        marginTop: 20,
        float: 'right',
    }
});

const GameRecords = () => {
    const classes = useStyle();
    return (
        <React.Fragment>
            {console.log(clubData)}
            <TacticComparatorTable/>
            <Button
                variant="contained"
                color="primary"
                startIcon={<AddCircleIcon/>}
                className={classes.button}
            >
                Ajouter
            </Button>
        </React.Fragment>
    )
};

export default GameRecords;