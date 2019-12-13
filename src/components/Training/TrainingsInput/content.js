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
    }
});


const TrainingsInputContent = props => {
    const { id } = useParams();
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


    React.useState(() => {
        listPlayersHandler();
        trainingHandler();
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
            })
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
            performance: value.value
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
        return avg
    };

    const handleDeletePlayer = key => {
        // Remove player from training's data
        dbRefTraining.child('playerAttendees').child(key).remove();
        // Remove training from player's data
        dbRefPlayers.child(key).child('trainingsAttended').child(id).remove();
    };

    return (
        <div>
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
        </div>
    )
};

export default TrainingsInputContent;

