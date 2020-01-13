import React from 'react';
import firebase from 'firebase';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/styles';
import { useDispatch } from 'react-redux';
import { snackbarOn } from '../../../actions';
import WinLoseDrawWindow from "./components/WinLoseDrawWindow";

const useStyles = makeStyles(theme => ({
  formControl: {
    minWidth: 120,
    width: '50%',
    marginBottom: 20,
  },
  boxesContainer: {
    display: 'flex',
  }
}));

const StatsGameRecord = () => {
  const [allTactics, setAllTactics] = React.useState(null);
  const [selectedTactic, setSelectedTactic] = React.useState('');
  const [gameRecords, setGameRecords] = React.useState(null);
  const [newGameRecordLoaded, setNewGameRecordLoaded] = React.useState(false);
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
    handleGameRecords(e.target.value);
  };

  const handleGameRecords = async (tacticTarget) => {
    setNewGameRecordLoaded(false);
    await db.collection('gameRecords')
      .where('ownTactic', '==', tacticTarget)
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
      let winLoseRecord = [0,0,0];
      for (const key in gameRecords) {
        const goalConceded = gameRecords[key].goalConceded;
        const goalScored = gameRecords[key].goalScored;
        if (goalScored > goalConceded) {
          // Game won
          winLoseRecord[0] += 1;
        } else if (goalScored < goalConceded) {
          // Game lost
          winLoseRecord[2] += 1;
        } else {
          // Draw
          winLoseRecord[1] += 1;
        }
      }
      return winLoseRecord
    } else {
      return [0,0,0]
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
      <div>
        {gameRecords != null ? <WinLoseDrawWindow winLoseStats={winLoseStats()} /> : null}
      </div>
    </React.Fragment>
  );
};

export default StatsGameRecord;
