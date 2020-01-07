import React, {useState} from 'react'
import TacticsEditTable from "./TacticsEditTable";
import {Button, makeStyles} from "@material-ui/core";
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
import AddCircleIcon from '@material-ui/icons/AddCircle';


const useStyles = makeStyles({
    button: {
        marginTop: 20,
        float: 'right',
    },
    nameForm: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: 10,
    },
    textField: {
      width: '40%',
      marginRight: 10,
    },
    form: {
        width: '100%',
        marginBottom: 10,
    },
});

const TacticsInputContent = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const { id } = useParams();
    const db = firebase.firestore();
    const [tactic, setTactic] = useState(null);
    const tacticHandler = () => {
        db.collection('tactics').doc(id)
            .onSnapshot(doc => {
                setTactic({tactic: doc.data()})
            });
    };

    const handleChangeName = e => {
        try{
            const attemptValue = e.target.value;
            setTactic(prevState => ({
                tactic: {
                    ...prevState.tactic,
                    name: attemptValue
                }
            }))
        } catch (e) {
            console.log('Erreur modification de nom')
        }
    };

    const handleUpdateName = () => {
        db.collection('tactics').doc(id).set({
            name: tactic.tactic.name
        }, {merge: true}).then(() => {
            dispatch(snackbarOn('Nom mis à jour', 'success', new Date()));
        })
            .catch(() => {
                dispatch(snackbarOn('Erreur: Nom non mis à jour', 'error', new Date()))
            })
    };

    const nbOfPosition = () => {
        if(tactic.tactic.positions != null){
            let counter = 0;
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
        if(nbOfPosition() < 11){
            try{
                const currentValue = tactic.tactic.positions[attemptValue];
                if(!isNaN(currentValue)){
                    db.collection('tactics').doc(id).set({
                        positions: {
                            [attemptValue]: currentValue + 1
                        }
                    }, {merge: true})
                        .then(() => {
                            dispatch(snackbarOn('Poste ajouté', 'success', new Date()))
                        })
                } else {
                    db.collection('tactics').doc(id).set({
                        positions: {
                            [attemptValue]: 1
                        }
                    }, {merge: true})
                        .then(() => {
                            dispatch(snackbarOn('Poste ajouté', 'success', new Date()))
                        })
                }
            }catch (e) {
                db.collection('tactics').doc(id).set({
                    positions: {
                        [attemptValue]: 1
                    }
                }, {merge: true})
                    .then(() => {
                        dispatch(snackbarOn('Poste ajouté', 'success', new Date()))
                    })
            }
        } else {
            dispatch(snackbarOn('Déjà 11 postes', 'warning', new Date()))
        }

    };

    const handleRemovePosition = position => {
        const currentPositionValue = tactic.tactic.positions[position]
        if(currentPositionValue === 1){
            db.collection('tactics').doc(id).set({
                positions: {
                    [position]: firebase.firestore.FieldValue.delete()
                }
            }, {merge: true})
                .then(() => {
                    dispatch(snackbarOn('Poste enlevé', 'success', new Date()))
                })
                .catch(() => {
                    dispatch(snackbarOn('Erreur: Poste non enlevé', 'error', new Date()))
                })
        } else {
            db.collection('tactics').doc(id).set({
                positions: {
                    [position]: currentPositionValue - 1
                }
            }, {merge: true})
                .then(() => {
                    dispatch(snackbarOn('Poste enlevé', 'success', new Date()))
                })
                .catch(() => {
                    dispatch(snackbarOn('Erreur: Poste non enlevé', 'error', new Date()))
                })
        }
    };


    React.useEffect(() =>{
        tacticHandler();
        // eslint-disable-next-line
    }, []);

    return (
        <div>
            <form className={classes.nameForm} noValidate autoComplete="off">
                <TextField className={classes.textField} id="outlined-basic" label='Nom Formation' value={tactic != null ? tactic.tactic.name : ''} variant="outlined" onChange={e => handleChangeName(e)}/>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddCircleIcon/>}
                    className={classes.buttonDate}
                    //
                    onClick={() => handleUpdateName()}
                >
                    Changer nom
                </Button>
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
            <TacticsEditTable listPositions={tactic != null ? tactic.tactic.positions : []} removePosition={handleRemovePosition}/>
        </div>
    )
}

export default TacticsInputContent;