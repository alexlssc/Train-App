import React, {useState} from "react";
import {makeStyles} from "@material-ui/styles";
import firebase from "firebase";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import {Paper} from "material-ui";
import TableTraining from "./TableTraining";

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

const TrainingsInputContent = () => {
    const [listPlayers, setListPlayers] = useState({player: ''});
    const [playerAttendees, setPlayerAttendees] = useState([]);

    const dbRef = firebase.database().ref('/players');
    const classes = useStyles();

    const listPlayersHandler = () => {
        const handlePlayers = snap => {
            if (snap.val()) setListPlayers({player: snap.val()});
        };
        dbRef.once('value', handlePlayers)
    };

    React.useState(() => {
        listPlayersHandler();
    }, []);

    const handleAddAttendee = e => {
        const attempt = e.target.value;
        const attemptItems = attempt.split('/');
        let currentAttendees = []
        playerAttendees.map(playerAttendee => (
            currentAttendees.push(playerAttendee.attendeeKey)
        ));
        if(!currentAttendees.includes(attemptItems[1])){
            setPlayerAttendees([...playerAttendees, {attendeeKey: attemptItems[1], attendeeName: attemptItems[0], performance: 'UNKNOWN'}])
        }
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
                            <MenuItem value={playerObject['lastName'] + ' ' + playerObject['firstName']+'/'+key}>{playerObject['lastName'] + ' ' + playerObject['firstName']}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Paper>
            <br/>
            <TableTraining playerAttendees={playerAttendees}/>
        </div>
    )
};

export default TrainingsInputContent;

