import React from "react";
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
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import DateFnsUtils from '@date-io/date-fns';
import * as POSITION from '../../constants/positions'
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';

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
}));

function AddPlayer(){

    const classes = useStyles();
    const [open, setOpen] = React.useState(false);


    const [firstName, setFirstName] = React.useState('');
    const [secondName, setSecondName] = React.useState('');
    const [DOB, setDOB] = React.useState('01/02/2018');
    const [positions, setPositions] = React.useState([
        {
            position: 'GB'
        },
        {
            position: 'DC'
        },
        {
            position: 'AG'
        }
    ]);

    const handlePosition = e => {
        const newPositions = [...positions, {position: e.target.value}];
        setPositions(newPositions);
    }

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };


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
                            <TextField className={classes.textField} id="playerSecondName" name="secondName" label= "Nom de famille" floatingLabelText="Nom de famille" variant="outlined" value={secondName} onChange={e => setSecondName(e.target.value)}/>
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
                                    <ListItem key={index} value={position.position}>{position.position}</ListItem>
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
                                    {POSITION.POSITION.map((position, index) => (
                                        <ListItem key={index} value={position}>{position}</ListItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </form>
                    </div>
                </Fade>
            </Modal>
        </div>
    );
}

export default AddPlayer;