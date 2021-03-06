import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core';
import TacticComparatorTable from './components/Table';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { Button } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import firebase from 'firebase';
import { useDispatch } from 'react-redux';
import { snackbarOn } from '../../../actions';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyle = makeStyles({
  button: {
    marginBottom: 20,
  },
  spinner: {
    position: 'absolute',
    left: '50vw',
    top: '50vh',
  }
});

const GameRecords = () => {
  const classes = useStyle();
  const [gameRecords, setGameRecords] = useState(null);
  const [allTactics, setAllTactics] = useState(null);
  let history = useHistory();
  const db = firebase.firestore();
  const dispatch = useDispatch();

  const getTodayDate = () => {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();
    return dd + '/' + mm + '/' + yyyy;
  };

  const gameRecordsHandler = () => {
    db.collection('gameRecords').onSnapshot(querySnapshot => {
      let nextState = {};
      querySnapshot.forEach(doc => {
        nextState = { ...nextState, [doc.id]: doc.data() };
      });
      setGameRecords(nextState);
    });
  };

  // Game record purely scores id of own tactic and opponent tactic
  // Tactic collection is pulled to get all the information for the needed tactics
  const tacticsHandler = () => {
    db.collection('tactics').onSnapshot(querySnapshot => {
      let nextState = {};
      querySnapshot.forEach(doc => {
        nextState = { ...nextState, [doc.id]: doc.data() };
      });
      setAllTactics(nextState);
    });
  };

  const handleNewGameRecord = () => {
    db.collection('gameRecords')
      .add({
        date: getTodayDate(),
        dateStamp: new Date(),
        opponent: null,
        ownTactic: null,
        opponentTactic: null,
        goalScored: 0,
        goalConceded: 0,
      })
      .then(docRef => {
        const key = docRef.id;
        history.push('/new-game-record/' + key);
      })
      .catch(() => {
        dispatch(
          snackbarOn('Erreur creation entrainement', 'error', new Date()),
        );
      });
  };

  const handleDeleteGameRecord = key => {
    db.collection('gameRecords')
      .doc(key)
      .delete()
      .then(() => {
        dispatch(snackbarOn('Match supprimé', 'success', new Date()));
      })
      .catch(() => {
        dispatch(snackbarOn('Erreur: match non supprimé', 'error', new Date()));
      });
  };

  React.useEffect(() => {
    gameRecordsHandler();
    tacticsHandler();
    // eslint-disable-next-line
  }, []);

  return (
    <React.Fragment>
      <Button
          variant="contained"
          color="primary"
          startIcon={<AddCircleIcon />}
          className={classes.button}
          onClick={() => handleNewGameRecord()}
      >
        Ajouter
      </Button>

      {gameRecords != null ? (
          <TacticComparatorTable
              gameRecords={gameRecords}
              deleteHandler={handleDeleteGameRecord}
              allTactics={allTactics}
          />
      ) :  <CircularProgress className={classes.spinner}/>}
    </React.Fragment>
  );
};

export default GameRecords;
