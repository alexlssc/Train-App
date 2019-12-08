import React, {useState} from 'react';
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

    const [trainings, setTrainings] = useState({trainings: ''})

    const dbRef = firebase.database().ref('trainings');
    let history = useHistory();

    const getTodayDate = () => {
        let today = new Date();
        let dd = String(today.getDate()).padStart(2, '0');
        let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        let yyyy = today.getFullYear();
        return dd + '/' + mm + '/' + yyyy;
    };

    const trainingsHandler = () => {
        const handleNewTrainings = snap => {
            if (snap.val()) setTrainings({trainings: snap.val()});
        };
        dbRef.on('value', handleNewTrainings);
        return () => {
            dbRef.off('value', handleNewTrainings);
        };
    };


    React.useEffect(() => {
        trainingsHandler();
        // eslint-disable-next-line
    }, []);

    const handleNewTraining = () => {
        dbRef.push({
            date: getTodayDate(),
            overallPerformance: 0,
            playerAttendees: '',
        }).then((snap) => {
            const key = snap.key;
            history.push('/trainings/' + key)
        })
    };

    const handleEditTrainings = key => {
        if(key){
            history.push('/trainings/' + key)
        }
    };

    const handleDeleteTrainings = key => {
        dbRef.child(key).remove();
    }

    return (
        <div>
            <h1>Entraînement</h1>
            <h2>Entraînement cette semaine</h2>
            <WeekTrainingTable trainings={trainings.trainings} editHandler={handleEditTrainings} deleteHandler={handleDeleteTrainings}/>
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