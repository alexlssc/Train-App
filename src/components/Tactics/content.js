import React, {useEffect, useState} from 'react'
import TacticsTable from "./TacticsTable";
import AddCircleIcon from '@material-ui/icons/AddCircle';
import {Button, makeStyles} from "@material-ui/core";
import firebase from "firebase";
import { useHistory } from "react-router-dom";
import TextField from '@material-ui/core/TextField';



const useStyles = makeStyles({
    button: {
        marginTop: 20,
        float: 'right',
    },
});

const TacticsContent = () => {
    const classes = useStyles();
    const dbRefTactics = firebase.database().ref('tactics');
    const [tactics, setTactics] = useState({tactics: ''});
    let history = useHistory();

    const handleNewTactics = () => {
        dbRefTactics.push({
            name: 'Sans Nom',
        }).then((snap) => {
            const key = snap.key;
            history.push('/tactics/' + key)
        })
    };

    const handleRemoveTactics = key => {
        dbRefTactics.child(key).remove()
    }

    const tacticsHandler = () => {
        const handleNewTactics = snap => {
            if (snap.val()) setTactics({tactics: snap.val()});
        };
        dbRefTactics.on('value', handleNewTactics);
        return () => {
            dbRefTactics.off('value', handleNewTactics);
        };
    };

    React.useEffect(() => {
        tacticsHandler();
    }, []);

    return (
        <div>
            <TacticsTable tactics={tactics.tactics} deleteTactic={handleRemoveTactics}/>
            <Button
                variant="contained"
                color="primary"
                startIcon={<AddCircleIcon/>}
                className={classes.button}
                onClick={() => handleNewTactics()}
            >
                Ajouter
            </Button>
        </div>
    )
}

export default TacticsContent;