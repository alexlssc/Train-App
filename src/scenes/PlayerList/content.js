import React from 'react';
import PlayerTable from './components/PlayerTable';
import AddButton from './components/AddButton';
import firebase from 'firebase';
import { snackbarOn } from '../../actions';
import { useDispatch } from 'react-redux';
import Modal from './components/Modal';
import CircularProgress from '@material-ui/core/CircularProgress';
import {makeStyles} from "@material-ui/styles";
import Fade from '@material-ui/core/Fade';

const useStyles = makeStyles(theme => ({
    spinner: {
        position: 'absolute',
        left: '50vw',
        top: '50vh',
    }
}))

const PlayerList = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const initial_state = { player: '' };
  const [listPlayers, setListPlayers] = React.useState(initial_state);
  const [playerEdit, setPlayerEdit] = React.useState({ player: '' });
  const [keyPlayerEdit, setKeyPlayerEdit] = React.useState('');

  const db = firebase.firestore();

  // handle opening and closing of modal window
  const [open, setOpen] = React.useState(false);

  const handleOpen = (playerObject, key) => {
    setPlayerEdit(playerObject);
    setKeyPlayerEdit(key);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setPlayerEdit('');
    setKeyPlayerEdit('');
  };

  const handleRemovePlayer = async key => {
    try {
      await listPlayers.player[key].trainingsAttended.forEach(trainingId => {
        db.collection('trainings')
          .doc(trainingId)
          .set(
            {
              playerAttendees: {
                [key]: firebase.firestore.FieldValue.delete(),
              },
            },
            { merge: true },
          );
      });
    } catch (e) {
      console.log(e);
    }
    await db
      .collection('players')
      .doc(key)
      .delete()
      .then(dispatch(snackbarOn('Joueur enlevé', 'success', new Date())))
      .catch(err => {
        dispatch(snackbarOn('Erreur: ' + err, 'error', new Date()));
      });
  };

  const playerHandler = () => {
    db.collection('players').onSnapshot(querySnapshot => {
      let nextState = {};
      querySnapshot.forEach(doc => {
        nextState = { ...nextState, [doc.id]: doc.data() };
      });
      setListPlayers(prevState => ({
        player: nextState,
      }));
    });
  };

  React.useEffect(() => {
    playerHandler();
    // eslint-disable-next-line
  }, []);

  return (
    <div>
        {listPlayers.player !== '' ? (
            <React.Fragment>
                <PlayerTable
                    listPlayers={listPlayers}
                    handleOpen={handleOpen}
                    handleRemovePlayer={handleRemovePlayer}
                />
                <AddButton />
            </React.Fragment>
        ) : <CircularProgress className={classes.spinner}/>}
      <Modal
        open={open}
        handleOpen={() => handleOpen()}
        handleClose={() => handleClose()}
        playerEdit={playerEdit}
        playerKey={keyPlayerEdit}
      />

    </div>
  );
};

export default PlayerList;
