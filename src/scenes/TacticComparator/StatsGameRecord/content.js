import React from 'react';
import firebase from "firebase";
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select'
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import {makeStyles} from "@material-ui/styles";

const useStyles = makeStyles(theme => ({
    formControl: {
        minWidth: 120,
        width: '50%',
    },
}));

const StatsGameRecord = () => {

    const [allTactics, setAllTactics] = React.useState(null);
    const [selectedTactic, setSelectedTactic] = React.useState('');
    const db = firebase.firestore();
    const classes = useStyles();

    const getTacticList = () => {
        if(allTactics != null) {
            return Object.entries(allTactics).map(([key, value]) => (
                <MenuItem
                    value={key}
                >
                    {value.name}
                </MenuItem>
            ))
        }
    };

    const tacticHandler = () =>{
        db.collection('tactics')
            .onSnapshot(querySnapshot => {
                let nextState = {};
                querySnapshot.forEach(doc => {
                    nextState = {...nextState, [doc.id] : doc.data()}
                });
                setAllTactics(nextState);
                setSelectedTactic(Object.keys(nextState)[0]);
            })
    };



    React.useEffect(() => {
        tacticHandler();
        // eslint-disable-next-line
    }, []);

    return (
        <React.Fragment>
            <FormControl className={classes.formControl}>
                <InputLabel id="tactic-label">Formation</InputLabel>
                <Select
                    labelId="demo-simple-select-outlined-label"
                    id="playerList"
                    value={selectedTactic}
                    onChange={e => setSelectedTactic(e.target.value)}
                >
                    {getTacticList()}
                </Select>
            </FormControl>
        </React.Fragment>
    )
}

export default StatsGameRecord;