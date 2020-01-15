import React from "react";
import Fab from "@material-ui/core/Fab";
import AddIcon from '@material-ui/icons/Add';
import Modal from '../Modal';
import {makeStyles} from "@material-ui/styles";

const useStyles = makeStyles(theme => ({
    root: {
        float: 'right',
        marginTop: 15
    }
}))

const AddButton = () => {
    const classes = useStyles();

    // handle opening and closing of modal window
    const [open, setOpen] = React.useState(false);

    const handleOpen = (playerObject, key) => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <React.Fragment>
            <Fab className={classes.root} id="addPlayerButton" color="primary" onClick={handleOpen} aria-label="add">
                <AddIcon />
            </Fab>
            <Modal open={open} handleOpen={() => handleOpen()} handleClose={() => handleClose()} />
        </React.Fragment>
    );
};

export default AddButton;