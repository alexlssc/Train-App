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
    const [playerAttendees, setPlayerAttendees] = useState({players: ''});
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
        dbRefTraining.child('playerAttendees').once('value', function(snapshot) {
            return snapshot.hasChild(key);
        });
    }

    const handleAddAttendee = e => {
        e.preventDefault();
        const playerKey = e.target.value[1];
        console.log(checkIfUserExists(playerKey))
        if(!checkIfUserExists(playerKey)){
            dbRefTraining.child('playerAttendees').child(playerKey).set({
                firstName: e.target.value[0].firstName,
                lastName: e.target.value[0].lastName,
                performance: 0
            })
        }

    };


    const handleUpdatePlayerAttendee = (key, value) => {
        console.log(key, value);
        dbRefTraining.child('playerAttendees').child(key).update({
            performance: value.value
        })
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
            <TableTraining playerAttendees={typeof trainingData.training.playerAttendees != "undefined" ? trainingData.training.playerAttendees : 'Waiting'} updatePlayerAttendee={handleUpdatePlayerAttendee}/>
        </div>
    )
};

export default TrainingsInputContent;

