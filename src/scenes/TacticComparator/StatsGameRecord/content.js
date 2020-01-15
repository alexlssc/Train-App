import React from 'react';
import firebase from 'firebase';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { useDispatch } from 'react-redux';
import { snackbarOn } from '../../../actions';
import WinLoseDrawWindow from './components/WinLoseDrawWindow';
import AvgGoalWindow from './components/AvgGoalWindow';
import RecentFormWindow from './components/RecentFormWindow';

const useStyles = makeStyles(theme => ({
  formControl: {
    minWidth: 120,
    width: '50%',
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  topForm: {
    marginBottom: 30,
  },
  boxesContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
}));

const StatsGameRecord = () => {
  const [allTactics, setAllTactics] = React.useState(null);
  const [selectedTactic, setSelectedTactic] = React.useState('');
  const [opponentSelectedTactic, setOpponentSelectedTactic] = React.useState(
    '',
  );
  const [gameRecords, setGameRecords] = React.useState(null);
  const [opponentGameRecords, setOpponentGameRecords] = React.useState(null);
  const db = firebase.firestore();
  const classes = useStyles();
  const dispatch = useDispatch();

  // Format date to dd/MM/yyyy
  function rightFormatDate(oldDate) {
    try {
      const dateParts = oldDate.split('/');
      return new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
    } catch (e) {
      return null;
    }
  }

  const getTacticList = () => {
    if (allTactics != null) {
      return Object.entries(allTactics).map(([key, value]) => (
        <MenuItem key={key} value={key}>{value.name}</MenuItem>
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
    setOpponentGameRecords(null)
    handleGameRecords(e.target.value);
  };

  const selectOpponentTacticOnChange = e => {
    setOpponentSelectedTactic(e.target.value);
    handleOpponentGameRecords(e.target.value);
  };

  const handleGameRecords = async tacticTarget => {
    await db
      .collection('gameRecords')
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

  const handleOpponentGameRecords = async tacticTarget => {
    await db
      .collection('gameRecords')
      .where('opponentTactic', '==', tacticTarget)
      .where('ownTactic', '==', selectedTactic)
      .get()
      .then(querySnapshot => {
        let nextState = {};
        querySnapshot.forEach(doc => {
          nextState = { ...nextState, [doc.id]: doc.data() };
        });
        setOpponentGameRecords(nextState);
      })
      .catch(() => {
        dispatch(
          snackbarOn('Erreur: Data match introuvable', 'error', new Date()),
        );
      });
  };

  const winLoseStats = () => {
    if (gameRecords != null) {
      let winLoseRecord = [0, 0, 0];
      for (let key in gameRecords) {
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
      return winLoseRecord;
    } else {
      return [0, 0, 0];
    }
  };

  const opponentWinLoseStats = () => {
    if (gameRecords != null) {
      let winLoseRecord = [0, 0, 0];
      for (let key in opponentGameRecords) {
        const goalConceded = opponentGameRecords[key].goalConceded;
        const goalScored = opponentGameRecords[key].goalScored;
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
      return winLoseRecord;
    } else {
      return [0, 0, 0];
    }
  };

  const avgGoalStats = () => {
    if (gameRecords != null) {
      let overallGoalScored = 0;
      let overallGoalConceded = 0;
      let gameCounter = 0;
      for (let key in gameRecords) {
        overallGoalConceded += Number(gameRecords[key].goalConceded);
        overallGoalScored += Number(gameRecords[key].goalScored);
        gameCounter += 1;
      }
      return [
        overallGoalScored / gameCounter,
        overallGoalConceded / gameCounter,
      ];
    }
  };

  const opponentAvgGoalStats = () => {
    if (opponentGameRecords != null) {
      let overallGoalScored = 0;
      let overallGoalConceded = 0;
      let gameCounter = 0;
      for (let key in opponentGameRecords) {
        overallGoalConceded += Number(opponentGameRecords[key].goalConceded);
        overallGoalScored += Number(opponentGameRecords[key].goalScored);
        gameCounter += 1;
      }
      return [
        overallGoalScored / gameCounter,
        overallGoalConceded / gameCounter,
      ];
    }
  };

  const recentFormStats = () => {
    let output = [];
    if (gameRecords != null) {
      const sortedList = Object.keys(gameRecords).sort((a,b) => {
        return new Date(rightFormatDate(gameRecords[b]['date'])) - new Date(rightFormatDate(gameRecords[a]['date']))
      });

      for (let key of sortedList) {
        const goalScored = gameRecords[key].goalScored;
        const goalConceded = gameRecords[key].goalConceded;
        const opponent = gameRecords[key].opponent.id;
        let result = '';
        if (goalScored > goalConceded) {
          result = 'win';
        } else if (goalScored < goalConceded) {
          result = 'lose';
        } else {
          result = 'draw';
        }
        output.push({ result: result, opponent: opponent });
      }
    }
    return output;
  };

  React.useEffect(() => {
    tacticHandler();
    // eslint-disable-next-line
  }, []);

  return (
    <React.Fragment>
      <FormControl variant="outlined" className={clsx(classes.formControl)}>
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

      <div className={classes.boxesContainer}>
        {gameRecords != null ? (
          <WinLoseDrawWindow winLoseStats={winLoseStats()} />
        ) : null}
        {gameRecords != null ? (
          <AvgGoalWindow avgGoalStats={avgGoalStats()} />
        ) : null}
        {gameRecords != null ? (
          <RecentFormWindow recentFormStats={recentFormStats()} />
        ) : null}
      </div>
      {gameRecords != null ? (
        <React.Fragment>
          <FormControl
            variant="outlined"
            className={clsx(classes.formControl, classes.topForm)}
          >
            <InputLabel id="opponent-tactic-label">
              Formation Adversaire
            </InputLabel>
            <Select
              labelId="demo-simple-select-outlined-label"
              id="opponentPlayerList"
              value={opponentSelectedTactic}
              onChange={selectOpponentTacticOnChange}
            >
              {getTacticList()}
            </Select>
          </FormControl>
          <div className={classes.boxesContainer}>
            {opponentGameRecords != null ? (
              <WinLoseDrawWindow winLoseStats={opponentWinLoseStats()} />
            ) : null}
            {opponentGameRecords != null ? (
              <AvgGoalWindow avgGoalStats={opponentAvgGoalStats()} />
            ) : null}
          </div>
        </React.Fragment>
      ) : null}
    </React.Fragment>
  );
};

export default StatsGameRecord;
