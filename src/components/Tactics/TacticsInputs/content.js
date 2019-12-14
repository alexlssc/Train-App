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
import CustomisedSnackBar from "../../SnackBarContent";


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
    const [status, setStatus] = useState('')
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

    const nbOfPosition = () => {
        var counter = 0;
        Object.values(tactic.tactic.positions).map(nb => (
            counter += nb
        ));
        return counter
    };

    const handleAddPosition = e => {
        const attemptValue = e.target.value;
        if(nbOfPosition() < 11){ // Make sure there can be more than 11 positions
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
        } else {
            setStatus({ msg: 'Deja 11 positions', date: new Date(), type: 'warning' })
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
    };

    const handleCloseSnack = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setStatus('')
    };

    // const customisedSnakeBar = () => {
    //     return (
    //         <Snackbar
    //             anchorOrigin={{
    //                 vertical: 'bottom',
    //                 horizontal: 'left',
    //             }}
    //             open={status.msg !== null}
    //             autoHideDuration={2000}
    //             onClose={handleCloseSnack}
    //         >
    //             <SnackBarContent
    //                 variant="error"
    //                 className={classes.margin}
    //                 message={status.msg}
    //             />
    //         </Snackbar>
    //     )
    // }

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
            {status ? <CustomisedSnackBar variant={status.type} open={status.msg !== null} onClose={handleCloseSnack} message={status.msg} /> : null}
        </div>
    )
}

export default TacticsInputContent;