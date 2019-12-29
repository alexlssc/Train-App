import React, {useState} from 'react'
import TacticsTable from "./TacticsTable";
import AddCircleIcon from '@material-ui/icons/AddCircle';
import {Button, makeStyles} from "@material-ui/core";
import {useDispatch} from "react-redux";
import {snackbarOn} from "../../actions";
import firebase from "firebase";
import { useHistory } from "react-router-dom";



const useStyles = makeStyles({
    button: {
        marginTop: 20,
        float: 'right',
    },
});

const TacticsContent = () => {
    const classes = useStyles();
    const [tactics, setTactics] = useState({tactics: ''});
    const db = firebase.firestore();
    const dispatch = useDispatch();
    let history = useHistory();

    const handleNewTactics = () => {
        db.collection('tactics').add({
            name: 'Sans Nom'
        }).then(docRef => {
            const key = docRef.id;
            history.push('/tactics/' + key)
        }).catch(() => {
            dispatch(snackbarOn('Erreur: Tactique non crée', 'error', new Date()))
        })

    };

    const handleRemoveTactics = key => {
        db.collection('tactics').doc(key).delete()
            .then(() => {
                dispatch(snackbarOn('Tactique supprimée', 'success', new Date()))
            })
            .catch(() => {
                dispatch(snackbarOn('Erreur: Tactique non supprimée', 'error', new Date()))
            })
    };

    const tacticsHandler = () => {
        db.collection('tactics')
            .onSnapshot(querySnapshot => {
                let nextState = {};
                querySnapshot.forEach(doc => {
                    nextState = {...nextState, [doc.id] : doc.data()}
                });
                setTactics({tactics: nextState})
            });
    };

    React.useEffect(() => {
        tacticsHandler();
        // eslint-disable-next-line
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
};

export default TacticsContent;