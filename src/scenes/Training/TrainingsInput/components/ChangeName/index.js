import React from 'react'
import {makeStyles} from "@material-ui/styles";
import TextField from "@material-ui/core/TextField";
import AddCircleIcon from '@material-ui/icons/AddCircle';
import {Button} from "@material-ui/core";

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: 30,
    },
    textField: {
      width: '40%'
    },
    buttonDate:{
        marginLeft: 10
    },
}));

const ChangeName = props => {
    const {name, handleChangeName, pushChangeName} = props;
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <TextField
                id="change-name-outlined"
                className={classes.textField}
                label="Titre"
                value={name}
                onChange={e => handleChangeName(e)}
            />
            <Button
                variant="contained"
                color="primary"
                startIcon={<AddCircleIcon/>}
                className={classes.buttonDate}
                //
                onClick={() => pushChangeName()}
            >
                Changer Titre
            </Button>
        </div>
    )
};

export default ChangeName;