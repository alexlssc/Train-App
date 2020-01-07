import React, {useState} from "react";
import {makeStyles} from "@material-ui/styles";
import firebase from "firebase";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import {Paper} from "material-ui";
import TableTraining from "./TableTraining";
import { useParams } from "react-router-dom";
import {snackbarOn} from "../../../actions";
import{useDispatch} from "react-redux";
import AddCircleIcon from '@material-ui/icons/AddCircle';
import {Button} from "@material-ui/core";
import DateFnsUtils from "@date-io/date-fns";
import {KeyboardDatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import DatePicker from "../../../components/DatePicker";

const useStyles = makeStyles({
    root: {
        width: '100%',
        padding: 5,
    },
    form: {
        width: '100%',
    },
    select: {
        width: '100%',
    },
    button: {
        marginTop: 20,
        float: 'right',
    },
    buttonDate:{
        marginLeft: 20
    },
    dateContainer:{
        display: 'flex',
        alignItems: 'center'
    }
});


const TrainingsInputContent = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const [listPlayers, setListPlayers] = useState({player: ''});
    const [trainingData, setTrainingData] = useState({training: ''});

    const db = firebase.firestore();
    const classes = useStyles();

    const listPlayersHandler = () => {
        db.collection('players').get()
            .then(querySnapshot => {
                let nextState = {};
                querySnapshot.forEach(doc => {
                    nextState = {...nextState, [doc.id] : doc.data()}
                });
                setListPlayers(prevState => ({
                    player: nextState
                }))
            });
    };

    const trainingHandler = () => {
        db.collection('trainings').doc(id)
            .onSnapshot(doc => {
                setTrainingData(prevState => ({
                    training: {
                        [doc.id]: doc.data()
                    }
                }))
            });
    };


    React.useEffect(() => {
        listPlayersHandler();
        trainingHandler();
        // eslint-disable-next-line
    }, []);

    function checkIfUserExists(key) {
        try{
            return trainingData.training[id].playerAttendees[key] != null
        } catch (e) {
            return false
        }
    }

    const handleAddAttendee = e => {
        e.preventDefault();
        const playerKey = e.target.value[1];
        if(!checkIfUserExists(playerKey)){
            db.collection('trainings').doc(id).set({
                playerAttendees: {
                    [playerKey]: {
                        firstName: e.target.value[0].firstName,
                        lastName: e.target.value[0].lastName,
                        performance: 0
                    },
                }
            }, {merge: true}).then(() => {
                dispatch(snackbarOn('Joueur ajouté', 'success', new Date()));
            }).catch(() => {
                dispatch(snackbarOn('Erreur: Joueur non ajouté', 'error', new Date()));
            })
        } else {
            dispatch(snackbarOn('Joueur déjà présent', 'warning', new Date()));
        }
    };

    const handleAddAllPlayers = () => {
        for(let [playerKey, playerObject] of Object.entries(listPlayers.player)){
            if(!checkIfUserExists(playerKey)){
                db.collection('trainings').doc(id).set({
                    playerAttendees: {
                        [playerKey]:{
                            firstName: playerObject.firstName,
                            lastName: playerObject.lastName,
                            performance: 0
                        }
                    }
                }, {merge: true})
            }
        }
    };


    // Update player attendee performance and update new overall performance
    const handleUpdatePlayerAttendee = async (key, value) => {
        await db.collection('trainings').doc(id).set({
            playerAttendees: {
                [key]: {
                    performance: value.value
                }
            }
        }, {merge: true});
        const newOverallPerformance = await updateOverallPerformance().then(result => {
            return result
        });

        // Keep track of overall performance
        await db.collection('trainings').doc(id).set({
            overallPerformance: newOverallPerformance
        }, {merge: true});

        // Each players keeps an array of trainings they're attending
        db.collection('players').doc(key).set({
            trainingsAttended: firebase.firestore.FieldValue.arrayUnion(id)
        }, {merge: true});

    };

    // Get value from each player training performance and return the average
    const updateOverallPerformance = async() => {
        let output;
        let trainingDoc = await db.collection('trainings').doc(id).get();
        let allPerformances = Object.keys(trainingDoc.data().playerAttendees).map(playerValues => (
            trainingDoc.data().playerAttendees[playerValues].performance
        ));
        if(allPerformances.length !== 0){
            let sum = allPerformances.reduce((previous, current) => current += previous);
            let avg = sum / allPerformances.length;
            output =  Math.round(avg * 10) / 10;
        } else {
            output = 0
        }
        return output
    };

    const handleDeletePlayer = async key => {
        // Remove player from training's data
        let promises = [];
        promises.push(
            db.collection('trainings').doc(id).update({
                [`playerAttendees.${key}`] : firebase.firestore.FieldValue.delete()
            })
        );
        // Remove training from player's data
        promises.push(
            db.collection('players').doc(key).update({
                trainingsAttended: firebase.firestore.FieldValue.arrayRemove(id)
            })
        );
        await Promise.all(promises)
            .then(() => {
                dispatch(snackbarOn('Joueur supprimé', 'success', new Date()))
            }).catch(() => {
               dispatch(snackbarOn('Erreur: Joueur non supprimé', 'error', new Date()))
            })
;
        const newOverallPerformance = await updateOverallPerformance();

        try{
            // Keep track of overall performance
            db.collection('trainings').doc(id).set({
                overallPerformance: newOverallPerformance
            }, {merge: true});
        } catch (e) {
            console.log(e)
        }

    };

    const handleUpdateDate = () => {
        try{
            if(hasNumber(trainingData.training[id].date)){ // Check if date format valid
                db.collection('trainings').doc(id).set({
                    date: trainingData.training[id].date,
                    dateStamp: rightFormatDate(trainingData.training[id].date)
                }, {merge : true})
                    .then(() => {
                        dispatch(snackbarOn('Date mis à jour', 'success', new Date()))
                    })
                    .catch(() => {
                        dispatch(snackbarOn('Erreur: Date non mis à jour', 'error', new Date()))
                    })
            } else {
                dispatch(snackbarOn('Format date invalide', 'error', new Date()))
            }
        } catch (e) {
            dispatch(snackbarOn('Erreur avec date', 'error', new Date()))
        }
    };

    // Format date to dd/MM/yyyy
    function rightFormatDate(oldDate){
        try{
            const dateParts = oldDate.split('/');
            return new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
        } catch (e) {
            return null
        }
    }

    // REGEX
    function hasNumber(myString) {
        return /\d/.test(myString);
    }

    const handleDateOnChange = date => {
        setTrainingData(prevState => ({
            training:{
                [id]: {
                    ...prevState.training[id],
                    date: date != null ? date.toLocaleString().slice(0,10) : ''
                }
            }}));
    };

    return (
        <React.Fragment>
            <DatePicker
                datePickerPropsValue={trainingData.training[id] != null ?  trainingData.training[id].date : null}
                datePickerOnChange={handleDateOnChange}
                datePickerOnClick={handleUpdateDate}
            />
            <h1>Ajouter un entraînement</h1>
            <Paper>
                <FormControl variant="outlined" className={classes.form}>
                    <InputLabel id="demo-simple-select-outlined-label">
                        Ajouter un joueur
                    </InputLabel>
                    <Select
                        labelId="demo-simple-select-outlined-label"
                        id="playerList"
                        value={''}
                        onChange={handleAddAttendee}
                    >
                        {/* Get all positions from constants file */}
                        {Object.entries(listPlayers.player).map(([key, playerObject]) => (
                            <MenuItem key={key} value={[playerObject, key]}>{playerObject['lastName'] + ' ' + playerObject['firstName']}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Paper>
            <br/>
            <TableTraining
                playerAttendees={trainingData.training[id] != null ? trainingData.training[id].playerAttendees : 'Waiting'}
                updatePlayerAttendee={handleUpdatePlayerAttendee}
                deletePlayerAttendee={handleDeletePlayer}
            />
            <Button
                variant="contained"
                color="primary"
                startIcon={<AddCircleIcon/>}
                className={classes.button}
                //
                onClick={() => handleAddAllPlayers()}
            >
                 Ajouter tous les joueurs
            </Button>
        </React.Fragment>
    )
};

export default TrainingsInputContent;

