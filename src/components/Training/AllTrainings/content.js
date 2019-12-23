import React, {useState} from 'react';
import WeekTrainingTable from "./WeekTrainingTable";
import {Button, makeStyles} from "@material-ui/core";
import AddCircleIcon from '@material-ui/icons/AddCircle';
import {Link} from "react-router-dom";
import { useHistory } from "react-router-dom";
import firebase from "firebase";
import {useDispatch} from "react-redux";
import {snackbarOn} from "../../../actions";


const useStyles = makeStyles({
    button: {
        marginTop: 20,
        float: 'right',
    }
});

const TrainingContent = () => {
    const classes = useStyles();

    const [trainings, setTrainings] = useState({trainings: ''});
    const dispatch = useDispatch()
    const db = firebase.firestore()
    let history = useHistory();

    const getTodayDate = () => {
        let today = new Date();
        let dd = String(today.getDate()).padStart(2, '0');
        let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        let yyyy = today.getFullYear();
        return dd + '/' + mm + '/' + yyyy;
    };

    const trainingsHandler = () => {
        db.collection('trainings')
            .onSnapshot(querySnapshot => {
                let nextState = {};
                querySnapshot.forEach(doc => {
                    nextState = {...nextState, [doc.id] : doc.data()}
                });
                setTrainings({trainings: nextState})
            });
    };


    React.useEffect(() => {
        trainingsHandler();
        // eslint-disable-next-line
    }, []);

    const handleNewTraining = () => {
        db.collection('trainings').add({
            date: getTodayDate(),
            dateStamp: new Date(),
            overallPerformance: 0,
        }).then(docRef => {
            const key = docRef.id;
            history.push('/trainings/' + key)
        }).catch(() => {
            dispatch(snackbarOn('Erreur creation entrainement', 'error', new Date()))
        })
    };

    const handleEditTrainings = key => {
        return (
            <Link
                to={{
                    pathname: "/trainings/" + key,
                    search: "?sort=name",
                    hash: "#the-hash",
                    state: { fromDashboard: true }
                }}
            />
        )
    };

    const handleDeleteTrainings = async key => {
        await Promise.all(
            Object.keys(trainings.trainings[key].playerAttendees).map(playerAttendee => (
                db.collection('players').doc(playerAttendee).set({
                    trainingsAttended: firebase.firestore.FieldValue.arrayRemove(key)
                }, {merge: true})
            ))
        );

        await db.collection('trainings').doc(key).delete()
    };

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