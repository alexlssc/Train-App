import React, {useState} from 'react'
import TacticsEditTable from "./TacticsEditTable";
import {makeStyles} from "@material-ui/core";
import firebase from "firebase";
import { useParams } from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import * as POSITION from '../../../constants/positions'
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";


const useStyles = makeStyles({
    button: {
        marginTop: 20,
        float: 'right',
    },
    textField: {
        '& > *': {
            width: '50%',
            marginBottom: 10,
        },
    },
    form: {
        width: '100%',
        marginBottom: 10,
    }
});

const TacticsInputContent = () => {
    const classes = useStyles();
    const { id } = useParams();
    const dbRefTactics = firebase.database().ref('tactics').child(id);
    const [tactic, setTactic] = useState({
        tactic: {
            name: ''
        }
    });

    const tacticHandler = () => {
        const handleNewTactic = snap => {
            if (snap.val()) setTactic({tactic: snap.val()});
        };
        dbRefTactics.on('value', handleNewTactic);
        return () => {
            dbRefTactics.off('value', handleNewTactic);
        };
    };

    const handleChangeName = e => {
        dbRefTactics.update({
            name: e.target.value
        })
    };

    const handleAddPosition = e => {
        const attemptValue = e.target.value;
        console.log(typeof tactic.tactic.positions[attemptValue] === 'undefined')
        if(typeof tactic.tactic.positions[attemptValue] === 'undefined'){
            dbRefTactics.child('positions').update({
                [e.target.value]: 1
            })
        } else {
            const currentValue = tactic.tactic.positions[attemptValue];
            dbRefTactics.child('positions').update({
                [e.target.value]: currentValue + 1
            })
        }

    };

    const handleRemovePosition = position => {
        if(tactic.tactic.positions[position] === 1) {
            dbRefTactics.child('positions').child(position).remove();
        } else{
            const currentValue = tactic.tactic.positions[position];
            dbRefTactics.child('positions').update({
                [position]: currentValue - 1
            })
        }
    }

    React.useEffect(() =>{
        tacticHandler();
    }, []);


    return (
        <div>
            <form className={classes.textField} noValidate autoComplete="off">
                <TextField id="outlined-basic" label='Nom Formation' value={tactic.tactic.name} variant="outlined" onChange={e => handleChangeName(e)}/>
            </form>
            <FormControl variant="outlined" className={classes.form}>
                <InputLabel id="demo-simple-select-outlined-label">
                    Ajouter un poste
                </InputLabel>
                <Select
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    value={''}
                    onChange={handleAddPosition}
                >
                    {/* Get all positions from constants file */}
                    {POSITION.POSITION.map((position, index) => (
                        <MenuItem key={index} value={position}>{position}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            <TacticsEditTable listPositions={tactic.tactic.positions} removePosition={handleRemovePosition}/>
        </div>
    )
}

export default TacticsInputContent;