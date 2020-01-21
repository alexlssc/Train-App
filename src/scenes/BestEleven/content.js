import React, { useState } from 'react';
import TableBestEleven from './TableBestEleven';
import firebase from 'firebase';
import * as POSITIONS from '../../constants/positions';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { Paper } from 'material-ui';
import { makeStyles } from '@material-ui/styles';
import { useDispatch } from 'react-redux';
import { snackbarOn } from '../../actions';
import CircularProgress from '@material-ui/core/CircularProgress';
import WeekMonthSwitch from "../../components/WeekMonthSwitch";

const useStyles = makeStyles({
  form: {
    width: '100%',
    clear: 'both'
  },
  select: {
    width: '100%',
  },
  paperForm: {
    clear: 'both'
  },
  spinner: {
    position: 'absolute',
    left: '50%',
    top: '50vh',
  },
});

const BestElevenContent = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [allTactics, setAllTactics] = useState(null);
  const [selectedTactic, setSelectedTactic] = useState(null);
  const [weekTrainings, setWeekTrainings] = useState(null);
  const [allPlayers, setAllPlayers] = useState(null);
  const [allAvgPerformances, setAllAvgPerformances] = useState(null);
  const [rankedPerformances, setRankedPerformances] = useState(null);
  const [rankedDone, setRankedDone] = useState(false);
  const [displayWeekTraining, setDisplayWeekTrainings] = useState(true);
  const db = firebase.firestore();
  let allThreeBest = [];

  // Format date to dd/MM/yyyy
  function rightFormatDate(oldDate) {
    try {
      const dateParts = oldDate.split('/');
      return new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
    } catch (e) {
      return null;
    }
  }

  // return max date in the past to retrieve training
  const getTargetDate = nbDays => {
    const currentTimestamp = Date.parse(new Date());
    const targetTimestamp = currentTimestamp - 8.64e7 * nbDays;
    return new Date(targetTimestamp).toLocaleString().slice(0, 10);
  };

  const getAverage = allPerformances => {
    let sum = allPerformances.reduce(
      (previous, current) => (current += previous),
    );
    let avg = sum / allPerformances.length;
    return Math.round(avg * 10) / 10;
  };

  const handleSwitchChange = () => {
    setDisplayWeekTrainings(() => {return !displayWeekTraining});
    setAllPlayers(null);
    setWeekTrainings(null);
    setAllAvgPerformances(null);
    setRankedDone(false);
  };

  const handlePreparingIncomingData = () => {
    if (rankedDone === false) {
      const allAvgPerformances = getAllPerformancesAvg();
      const playerSorted = Object.keys(allAvgPerformances)
        .sort(function(a, b) {
          return allAvgPerformances[a] - allAvgPerformances[b];
        })
        .reverse();
      setRankedPerformances(playerSorted);
      setAllAvgPerformances(allAvgPerformances);
      setRankedDone(true);
    } else {
      for (let position of POSITIONS.POSITION) {
        allThreeBest.push(sortPlayerPerPositionPerPerformance(position));
      }
    }
  };

  const sortPlayerPerPositionPerPerformance = targetPosition => {
    let threeBestPlayer = Array(3);
    let count = 0;
    for (let playerId of rankedPerformances) {
      const tempPlayer = allPlayers[playerId];
      if (tempPlayer.positions.includes(targetPosition)) {
        threeBestPlayer[count] = playerId;
        count++;
        if (count === 3) {
          return threeBestPlayer;
        }
      }
    }
    return threeBestPlayer;
  };

  const getAllPerformancesAvg = () => {
    let nextAllPerformance = {};
    for (let trainingID in weekTrainings) {
      for (let playerID in weekTrainings[trainingID].playerAttendees) {
        const performance =
          weekTrainings[trainingID].playerAttendees[playerID].performance;
        try {
          if (!isNaN(nextAllPerformance[playerID])) {
            const currentAverage = getAverage([
              nextAllPerformance[playerID],
              performance,
            ]);
            nextAllPerformance = {
              ...nextAllPerformance,
              [playerID]: currentAverage,
            };
          } else {
            nextAllPerformance = {
              ...nextAllPerformance,
              [playerID]: performance,
            };
          }
        } catch (e) {
          nextAllPerformance = {
            ...nextAllPerformance,
            [playerID]: [performance],
          };
        }
      }
    }

    return nextAllPerformance;
  };

  const handleGetPlayers = async () => {
    const querySnapshot = await db.collection('players').get();
    try {
      let nextState = {};
      querySnapshot.forEach(doc => {
        nextState = { ...nextState, [doc.id]: doc.data() };
      });
      setAllPlayers(nextState);
    } catch (e) {
      console.log(e);
    }
  };

  const handleGetTrainings = async () => {
    const targetDays = displayWeekTraining ? 7 : 31;
    const querySnapshot = await db
      .collection('trainings')
      .where('dateStamp', '>=', rightFormatDate(getTargetDate(targetDays)))
      .get();
    try {
      let nextState = {};
      querySnapshot.forEach(doc => {
        nextState = { ...nextState, [doc.id]: doc.data() };
      });
      setWeekTrainings(nextState);
    } catch (e) {
      console.log(e);
    }
  };

  const handleGetTactics = async () => {
    const querySnapshot = await db.collection('tactics').get();
    try {
      let nextState = {};
      querySnapshot.forEach(doc => {
        nextState = { ...nextState, [doc.id]: doc.data() };
      });
      setAllTactics(nextState);
      setSelectedTactic(nextState[Object.keys(nextState)[0]]);
    } catch (e) {
      console.error('Error retrieving tactics');
    }
  };

  const handleChangeTactic = e => {
    try {
      setSelectedTactic(e.target.value);
      dispatch(
        snackbarOn('Nouvelle tactique selectionné', 'success', new Date()),
      );
    } catch (e) {
      dispatch(
        snackbarOn('Nouvelle tactique selectionné', 'success', new Date()),
      );
    }
  };

  const handleGetAllData = async () => {
    await handleGetPlayers();
    await handleGetTrainings();
    await handleGetTactics();
  };

  React.useEffect(() => {
    handleGetAllData();
    // eslint-disable-next-line
  }, [displayWeekTraining]);

  return (
    <div>
      {allPlayers != null && weekTrainings != null
        ? handlePreparingIncomingData()
        : null}
      {selectedTactic != null &&
      allThreeBest != null &&
      allPlayers != null &&
      allAvgPerformances != null ? (
        <React.Fragment>
          <h1>Meilleurs performances sur les {displayWeekTraining ? 7 : 31} derniers jours</h1>
          <div>
            <WeekMonthSwitch
                switchValue={displayWeekTraining}
                handleSwitchChange={handleSwitchChange}
            />
          </div>
          <Paper className={classes.paperForm}>
            <FormControl variant="outlined" className={classes.form}>
              <InputLabel id="demo-simple-select-outlined-label">
                Choisissez une formation
              </InputLabel>
              <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                value={selectedTactic !== null ? selectedTactic : ''}
                onChange={e => handleChangeTactic(e)}
              >
                {allTactics !== null
                  ? Object.values(allTactics).map(oneTactic => (
                      <MenuItem key={oneTactic.name} value={oneTactic}>
                        {oneTactic.name}
                      </MenuItem>
                    ))
                  : ''}
              </Select>
            </FormControl>
          </Paper>
          <TableBestEleven
            selectedTactic={selectedTactic !== null ? selectedTactic : null}
            allThreeBest={allThreeBest.length !== 0 ? allThreeBest : null}
            allPlayers={allPlayers != null ? allPlayers : null}
            allAvgPerformance={
              allAvgPerformances != null ? allAvgPerformances : null
            }
          />
        </React.Fragment>
      ) : (
        <CircularProgress className={classes.spinner} />
      )}
    </div>
  );
};

export default BestElevenContent;
