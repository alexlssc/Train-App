import React from "react";
import Fab from "@material-ui/core/Fab";
import AddIcon from '@material-ui/icons/Add';
import './style.css'
import Modal from './Modal';

const AddPlayer = () => {

    // handle opening and closing of modal window
    const [open, setOpen] = React.useState(false);

    const handleOpen = (playerObject, key) => {
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
            <Modal open={open} handleOpen={() => handleOpen()} handleClose={() => handleClose()} />
        </div>
    );
};

export default AddPlayer;