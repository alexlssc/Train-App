import React from 'react';
import WeekTrainingTable from "./WeekTrainingTable";
import {Button, makeStyles} from "@material-ui/core";
import AddCircleIcon from '@material-ui/icons/AddCircle';
import {Link} from "react-router-dom";
import { useHistory } from "react-router-dom";
import * as ROUTES from "../../../constants/routes";
import firebase from "firebase";


const useStyles = makeStyles({
    button: {
        marginTop: 20,
        float: 'right',
    }
});


const TrainingContent = () => {
    const classes = useStyles();
    const dbRef = firebase.database().ref('trainings');
    let history = useHistory();

    const handleNewTraining = () => {
        dbRef.push({
            date: '22/05/2020',
            overallPerformance: 0,
            playerAttendees: '',
        }).then((snap) => {
            const key = snap.key;
            history.push('/trainings/' + key)
        })
    };

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
                //
                onClick={() => handleNewTraining()}
            >
                Ajouter
            </Button>
        </div>
    )
};

export default TrainingContent;