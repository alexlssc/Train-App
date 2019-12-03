import React from 'react';
import WeekTrainingTable from "./WeekTrainingTable";
import {Button, makeStyles} from "@material-ui/core";
import AddCircleIcon from '@material-ui/icons/AddCircle';
import {Link} from "react-router-dom";
import * as ROUTES from "../../../constants/routes";

const useStyles = makeStyles({
    button: {
        marginTop: 20,
        float: 'right',
    }
});


const TrainingContent = () => {
    const classes = useStyles();
    return (
        <div>
            <h1>Entraînement</h1>
            <h2>Entraînement cette semaine</h2>
            <WeekTrainingTable/>
            <Button
                variant="contained"
                color="primary"
                startIcon={<AddCircleIcon/>}
                className={classes.button}
                component={Link} to={ROUTES.INPUTTRAININGS}
            >
                Ajouter
            </Button>
        </div>
    )
};

export default TrainingContent;