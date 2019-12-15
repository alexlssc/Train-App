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
import {useDispatch} from "react-redux";
import {snackbarOn} from "../../../actions";


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
    const dispatch = useDispatch();
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
        }).then(() => {
            //setStatus({ msg: 'Nom mis à jour', date: new Date(), type: 'success' })
            dispatch(snackbarOn('Nom mis à jour', 'success', new Date()));
        })
    };

    const nbOfPosition = () => {
        if(typeof tactic.tactic.positions !== 'undefined'){
            var counter = 0;
            Object.values(tactic.tactic.positions).map(nb => (
                counter += nb
            ));
            return counter
        } else {
            return 0
        }
    };

    const handleAddPosition = e => {
        const attemptValue = e.target.value;
        if(nbOfPosition() < 11){ // Make sure there can't be more than 11 positions
            try { // Executed if position is already in the positions list
                const currentValue = tactic.tactic.positions[attemptValue];
                dbRefTactics.child('positions').update({
                    [e.target.value]: currentValue + 1
                }).then(() => {
                    dispatch(snackbarOn('Poste ajouté', 'success', new Date()));
                })
            } catch (e) { // Executed if position is not already in the position list
                dbRefTactics.child('positions').update({
                    [attemptValue]: 1
                }).then(() => {
                    dispatch(snackbarOn('Poste ajouté', 'success', new Date()));
                })
            }
        } else {
            dispatch(snackbarOn('Déjà 11 positions', 'warning', new Date()))
        }
    };

    const handleRemovePosition = position => {
        if(tactic.tactic.positions[position] === 1) {
            dbRefTactics.child('positions').child(position).remove().then(() => {
                   // setStatus({ msg: 'Poste enlevé', date: new Date(), type: 'success' })
                dispatch(snackbarOn('Poste enlevé', 'success', new Date()));
                }
            );
        } else{
            const currentValue = tactic.tactic.positions[position];
            dbRefTactics.child('positions').update({
                [position]: currentValue - 1
            }).then(() => {
                dispatch(snackbarOn('Poste enlevé', 'success', new Date()));
                }
            )
        }
    };


    React.useEffect(() =>{
        tacticHandler();
        // eslint-disable-next-line
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