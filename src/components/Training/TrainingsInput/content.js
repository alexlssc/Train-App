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

    const dbRefPlayers = firebase.database().ref('/players');
    const dbRefTraining = firebase.database().ref('trainings').child(id);
    const classes = useStyles();

    const listPlayersHandler = () => {
        const handlePlayers = snap => {
            if (snap.val()) setListPlayers({player: snap.val()});
        };
        dbRefPlayers.once('value', handlePlayers)
    };

    const trainingHandler = () => {
        const handleNewTrainings = snap => {
            if (snap.val()) setTrainingData({training: snap.val()});
        };
        dbRefTraining.on('value', handleNewTrainings);
        return () => {
            dbRefTraining.off('value', handleNewTrainings);
        };
    };


    React.useEffect(() => {
        listPlayersHandler();
        trainingHandler();
        // eslint-disable-next-line
    }, []);

    function checkIfUserExists(key) {
        return trainingData.training.playerAttendees[key] != null;
    }

    const handleAddAttendee = e => {
        e.preventDefault();
        const playerKey = e.target.value[1];
        if(!checkIfUserExists(playerKey)){
            dbRefTraining.child('playerAttendees').child(playerKey).set({
                firstName: e.target.value[0].firstName,
                lastName: e.target.value[0].lastName,
                performance: 0
            }).then(() => {
                dispatch(snackbarOn('Joueur ajouté', 'success', new Date()));
            })
        } else {
            dispatch(snackbarOn('Joueur déjà présent', 'warning', new Date()));
        }
    };

    const handleAddAllPlayers = () => {
        for(let [playerKey, playerObject] of Object.entries(listPlayers.player)){
            if(!checkIfUserExists(playerKey)){
                dbRefTraining.child('playerAttendees').child(playerKey).set({
                    firstName: playerObject.firstName,
                    lastName: playerObject.lastName,
                    performance: 0
                })
            }
        }
    };


    // Update player attendee performance and update new overall performance
    const handleUpdatePlayerAttendee = async (key, value) => {
        await dbRefTraining.child('playerAttendees').child(key).update({
            performance: value.value
        });
        const newOverallPerformance = await updateOverallPerformance().then(result => {
            return result
        });

        await dbRefTraining.update({
            overallPerformance: newOverallPerformance
        });

        dbRefPlayers.child(key).child('trainingsAttended').child(id).update({
            performance: value.value,
            date: trainingData.training.date
        })

    };

    // Get value from each player training performance and return the average
    const updateOverallPerformance = async() => {
        let allPerformances = await dbRefTraining.child('playerAttendees').once('value').then(snap => {
            return Object.values(snap.val()).map(playerValues => (
                playerValues['performance']
            ));
        });
        let sum = allPerformances.reduce((previous, current) => current += previous);
        let avg = sum / allPerformances.length;
        return Math.round(avg * 10) / 10;
    };

    const handleDeletePlayer = key => {
        // Remove player from training's data
        dbRefTraining.child('playerAttendees').child(key).remove();
        // Remove training from player's data
        dbRefPlayers.child(key).child('trainingsAttended').child(id).remove();
    };

    const handleUpdateDate = () => {
        try{
            let promises = [];
            if(hasNumber(trainingData.training.date)){ // Check if date format valid
                promises.push( // Attempt on updating training date
                    dbRefTraining.update({
                        date: trainingData.training.date
                    })
                );
                // Attempt on updating training date stored in every players' data
                for(let playerKey of Object.keys(trainingData.training.playerAttendees)){
                    promises.push(
                        dbRefPlayers.child(playerKey).child('trainingsAttended').child(id).update({
                            date: trainingData.training.date
                        })
                    );
                }
                Promise.all(promises)
                    .then( // Output success message if all update done correctly
                        dispatch(snackbarOn('Date mis à jour', 'success', new Date()))
                    )
                    .catch(function (err) { // Output error message if error is caught
                        dispatch(snackbarOn('Erreur mis à jour date', 'error', new Date()))
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

    return (
        <div>
            <div className={classes.dateContainer}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                        disableToolbar
                        variant="inline"
                        format="dd/MM/yyyy"
                        margin="normal"
                        id="date-picker-inline"
                        label="Changer la date"
                        value={rightFormatDate(trainingData.training.date)}
                        disableFuture='true'
                        KeyboardButtonProps={{
                            'aria-label': 'change date',
                        }}
                        onChange={date => setTrainingData(prevState => ({
                            training:{
                                ...prevState.training,
                                date: date != null ? date.toLocaleString().slice(0,10) : ''
                            }
                        }))}
                        autoOk={true}
                    />
                </MuiPickersUtilsProvider>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddCircleIcon/>}
                    className={classes.buttonDate}
                    //
                    onClick={() => handleUpdateDate()}
                >
                    Changer date
                </Button>

            </div>
            <h1>Ajouter un entraînement</h1>
            <Paper>
                <FormControl variant="outlined" className={classes.form}>
                    <InputLabel id="demo-simple-select-outlined-label">
                        Ajouter un joueur
                    </InputLabel>
                    <Select
                        labelId="demo-simple-select-outlined-label"
                        id="demo-simple-select-outlined"
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
                playerAttendees={typeof trainingData.training.playerAttendees != "undefined" ? trainingData.training.playerAttendees : 'Waiting'}
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
        </div>
    )
};

export default TrainingsInputContent;

