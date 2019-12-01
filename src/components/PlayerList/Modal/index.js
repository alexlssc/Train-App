import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import TextField from "@material-ui/core/TextField";
import {KeyboardDatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import DeleteIcon from '@material-ui/icons/Delete';
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import * as POSITION from "../../../constants/positions";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import firebase from "firebase";

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

const TransitionsModal = props => {
    const classes = useStyles();

    const [firstName, setFirstName] = React.useState('');
    const [lastName, setLastName] = React.useState('');
    const [DOB, setDOB] = React.useState(new Date());
    const [positions, setPositions] = React.useState([]);

    const db = firebase.database();

    const handlePosition = e => {
        const attemptValue =  e.target.value;
        const currentPositions = [...positions];

        // Check if position already set
        if(!currentPositions.includes(attemptValue)){
            const newPositions = [...positions, attemptValue];
            setPositions(newPositions);
        }
    };

    // Format date to dd/MM/yyyy
    function rightFormatDate(oldDate){
        if(oldDate){
            const dateParts = oldDate.split('/');
            return new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
        }
    }

    // Set input with selected edited player if in edit mode
    React.useEffect(() => {
        if(props.playerEdit){
            setFirstName(props.playerEdit['firstName']);
            setLastName(props.playerEdit['lastName']);
            setDOB(rightFormatDate(props.playerEdit['dob']));
            setPositions([].concat(props.playerEdit['positions']));
        }
    }, [props.playerEdit]);

    // Remove one selected position from list
    const deletePosition = e => {
        const newPositions = [...positions];
        newPositions.splice(e.target.index, 1);
        setPositions(newPositions);
    };

    // Clear all input
    const handleClear = () => {
        setFirstName('');
        setLastName('');
        setDOB(new Date());
        setPositions([]);
    };

    // Add new player to db
    async function pushNewPlayer(e){
        e.preventDefault();
        db.ref('players').push({
                firstName: firstName,
                lastName: lastName,
                dob: DOB.toLocaleString().slice(0,10),
                positions: positions
            }
            ,
            function(error) {
                if (error)
                    console.log('Error has occured during saving process');
                else
                    handleClear();
                    props.handleClose();
            })
    }


    // Update player in db
    async function updatePlayer(e){
        e.preventDefault();
        db.ref('players').child(props.playerKey).update({
                firstName: firstName,
                lastName: lastName,
                dob: DOB.toLocaleString().slice(0,10),
                positions: positions
            }
            ,
            function(error) {
                if (error)
                    console.log('Error has occured during saving process');
                else
                    handleClear();
                props.handleClose();
            })
    }

    // Clear current state of next use and close
    const handleModalClose = () => {
        handleClear();
        props.handleClose();
    }



    return (
        <div>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={props.open}
                onClose={() => handleModalClose()}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 300,
                }}
            >
                <Fade in={props.open}>
                    <div className={classes.paper}>
                        <h2 id="transition-modal-title">{props.playerEdit ? 'Editer le joueur' : 'Ajouter un joueur'}</h2>
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
                                    onChange={date => setDOB(date)}
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
                                <Button variant="contained" size="large" color="primary" styles={classes.Button} onClick={props.playerEdit ? updatePlayer : pushNewPlayer}>
                                    {props.playerEdit ? 'Editer joueur' : 'Ajouter joueur'}
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
};

export default TransitionsModal;