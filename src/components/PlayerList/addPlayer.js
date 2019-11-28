import React, {useEffect} from "react";
import Fab from "@material-ui/core/Fab";
import AddIcon from '@material-ui/icons/Add';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import './style.css'
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import DeleteIcon from '@material-ui/icons/Delete';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import DateFnsUtils from '@date-io/date-fns';
import * as POSITION from '../../constants/positions';
import firebase from "firebase";

import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import FirebaseContext from "../Firebase/context";


const useStyles = makeStyles(theme => ({

    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        backgroundColor: theme.palette.background.paper,
        borderRadius: 15,
        outline: 'none',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
        width: "80%",
        maxWidth: 600,
    },

    form: {
        width: '70%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
    },

    textField: {
        width: '100%',
        marginTop: 10,
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
        width: '100%',
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
    buttonContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      width: '100%',
    },
}));

const AddPlayer = () => {

    const classes = useStyles();
    const [open, setOpen] = React.useState(false);


    const [firstName, setFirstName] = React.useState('');
    const [lastName, setLastName] = React.useState('');
    const [DOB, setDOB] = React.useState('01/02/2018');
    const [positions, setPositions] = React.useState([]);
    const db = firebase.database()

    const handlePosition = e => {
        const attemptValue =  e.target.value;
        const currentPositions = [...positions];

        // Check if position already set
        if(!currentPositions.includes(attemptValue)){
            const newPositions = [...positions, attemptValue];
            setPositions(newPositions);
        }
    }

    const deletePosition = e => {
        const newPositions = [...positions];
        newPositions.splice(e.target.index, 1);
        setPositions(newPositions);
    }

    const handleClear = () => {
        setFirstName('');
        setLastName('');
        setDOB('01/02/2018')
        setPositions([])
    }

    // Handle open and closing of Modal
    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    async function pushNewPlayer(e){
        e.preventDefault();
        db.ref('players').push({
                firstName: firstName,
                lastName: lastName,
                dob: DOB,
                positions: positions
            }
            ,
            function(error) {
            if (error)
                console.log('Error has occured during saving process')
            else
                handleClear()
                handleClose()
        })
    }

    return (
        <div>
            <Fab id="addPlayerButton" color="primary" onClick={handleOpen} aria-label="add">
                <AddIcon />
            </Fab>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={open}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={open}>
                    <div className={classes.paper}>
                        <h2 id="transition-modal-title">Ajouter un joueur</h2>
                        <form className={classes.form} noValidate autoComplete="off">
                            <TextField className={classes.textField} id="playerFirstName" name="firstname" label= "Prénom" floatingLabelText="Prénom" variant="outlined" value={firstName} onChange={e => setFirstName(e.target.value)}/>
                            <TextField className={classes.textField} id="playerSecondName" name="secondName" label= "Nom de famille" floatingLabelText="Nom de famille" variant="outlined" value={lastName} onChange={e => setLastName(e.target.value)}/>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <KeyboardDatePicker
                                    disableToolbar
                                    variant="inline"
                                    format="dd/MM/yyyy"
                                    margin="normal"
                                    id="date-picker-inline"
                                    label="Date picker inline"
                                    value={DOB}
                                    disableFuture='true'
                                    onChange={(_, newValue) => setDOB(newValue)}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change date',
                                    }}
                                />
                            </MuiPickersUtilsProvider>
                            <h2>Ses postes</h2>
                            <List>
                                {positions.map((position, index) => (
                                    <ListItem key={index} value={position}>
                                        {position}
                                        <ListItemIcon key={index} onClick={deletePosition} style={{cursor: 'pointer'}}><DeleteIcon /></ListItemIcon>
                                    </ListItem>
                                ))}
                            </List>
                            <FormControl variant="outlined" className={classes.formControl}>
                                <InputLabel id="demo-simple-select-outlined-label">
                                    Ajouter poste
                                </InputLabel>
                                <Select
                                    labelId="demo-simple-select-outlined-label"
                                    id="demo-simple-select-outlined"
                                    onChange={handlePosition}
                                >
                                    {/* Get all positions from constants file */}
                                    {POSITION.POSITION.map((position, index) => (
                                        <MenuItem key={index} value={position}>{position}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <div className={classes.buttonContainer}>
                                <Button variant="contained" size="large" color="primary" styles={classes.Button} onClick={pushNewPlayer}>
                                    Ajouter joueur
                                </Button>
                                <Button variant="contained" size="large" color="secondary" styles={classes.Button} onClick={handleClear}>
                                    Effacer
                                </Button>
                            </div>
                        </form>
                    </div>
                </Fade>
            </Modal>
        </div>
    );
}

export default AddPlayer;