import React from 'react';
import firebase from 'firebase';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/styles';
import { useDispatch } from 'react-redux';
import { snackbarOn } from '../../../actions';

const useStyles = makeStyles(theme => ({
  formControl: {
    minWidth: 120,
    width: '50%',
  },
}));

const StatsGameRecord = () => {
  const [allTactics, setAllTactics] = React.useState(null);
  const [selectedTactic, setSelectedTactic] = React.useState('');
  const [gameRecords, setGameRecords] = React.useState(null);
  const db = firebase.firestore();
  const classes = useStyles();
  const dispatch = useDispatch();

  const getTacticList = () => {
    if (allTactics != null) {
      return Object.entries(allTactics).map(([key, value]) => (
        <MenuItem value={key}>{value.name}</MenuItem>
      ));
    }
  };

  const tacticHandler = () => {
    db.collection('tactics').onSnapshot(querySnapshot => {
      let nextState = {};
      querySnapshot.forEach(doc => {
        nextState = { ...nextState, [doc.id]: doc.data() };
      });
      setAllTactics(nextState);
    });
  };

  const selectTacticOnChange = e => {
    setSelectedTactic(e.target.value);
    handleGameRecords();
  };

  const handleGameRecords = () => {
    db.collection('gameRecords')
      .where('ownTactic', '==', selectedTactic)
      .get()
      .then(querySnapshot => {
        let nextState = {};
        querySnapshot.forEach(doc => {
          nextState = { ...nextState, [doc.id]: doc.data() };
        });
        setGameRecords(nextState);
      })
      .catch(() => {
        dispatch(
          snackbarOn('Erreur: Data match introuvable', 'error', new Date()),
        );
      });
  };

  const winLoseStats = () => {
    if (gameRecords != null) {
      const recordTrack = [0, 0, 0]; // Win, Draw, Lose
      for (const key in gameRecords) {
        const goalConceded = gameRecords[key].goalConceded;
        const goalScored = gameRecords[key].goalScored;
        if (goalScored > goalConceded) {
          // Game won
          recordTrack[0] += 1;
        } else if (goalScored < goalConceded) {
          // Game lost
          recordTrack[2] += 1;
        } else {
          // Draw
          recordTrack[1] += 1;
        }
      }
      return recordTrack
    }
  };

  React.useEffect(() => {
    tacticHandler();
    // eslint-disable-next-line
  }, []);

  return (
    <React.Fragment>
      <FormControl variant="outlined" className={classes.formControl}>
        <InputLabel id="tactic-label">Formation</InputLabel>
        <Select
          labelId="demo-simple-select-outlined-label"
          id="playerList"
          value={selectedTactic}
          onChange={selectTacticOnChange}
        >
          {getTacticList()}
        </Select>
      </FormControl>
    </React.Fragment>
  );
};

export default StatsGameRecord;
