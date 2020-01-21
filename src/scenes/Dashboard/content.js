import React, { useState } from 'react';
import BoxBestPlayer from '../../components/BoxBestPlayers';
import { makeStyles } from '@material-ui/styles';
import firebase from 'firebase';
import * as POSITIONS from '../../constants/positions';
import CircularProgress from '@material-ui/core/CircularProgress';
import WeekMonthSwitch from '../../components/WeekMonthSwitch';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    width: '100%',
  },
  spinner: {
    position: 'absolute',
    left: '50vw',
    top: '50vh',
  },
}));

const DashboardContent = () => {
  const classes = useStyles();
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
    setRankedDone(() => {return false});
  };

  const handlePreparingIncomingData = () => {
    if (rankedDone === false) {
      const allAvgPerformances = getAllPerformancesAvg();
      const playerSorted = Object.keys(allAvgPerformances)
        .sort(function(a, b) {
          return allAvgPerformances[a] - allAvgPerformances[b];
        })
        .reverse();
      setRankedPerformances(playerSorted, console.log('Performance changed :' + playerSorted));
      setAllAvgPerformances(allAvgPerformances, console.log('All Avg Performances changed'));
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

  const displayBoxes = () => {
    let output = [];
    allThreeBest.forEach((oneThreeBest, index) => {
      if (typeof oneThreeBest[0] !== 'undefined') {
        //Display box only if there are players to display
        output.push(
          <BoxBestPlayer
            key={index}
            topic={`MEILLEURS ${POSITIONS.POSITION[index]}`}
            bestPlayer={
              oneThreeBest.length !== 0 ? allPlayers[oneThreeBest[0]] : null
            }
            bestPlayerAvg={
              oneThreeBest.length !== 0
                ? allAvgPerformances[oneThreeBest[0]]
                : null
            }
            secondPlayer={
              oneThreeBest.length !== 0 ? allPlayers[oneThreeBest[1]] : null
            }
            secondPlayerAvg={
              oneThreeBest.length !== 0
                ? allAvgPerformances[oneThreeBest[1]]
                : null
            }
            thirdPlayer={
              oneThreeBest.length !== 0 ? allPlayers[oneThreeBest[2]] : null
            }
            thirdPlayerAvg={
              oneThreeBest.length !== 0
                ? allAvgPerformances[oneThreeBest[2]]
                : null
            }
          />,
        );
      }
    });
    return output;
  };

  React.useEffect(() => {
    handleGetTrainings();
    handleGetPlayers();
    // eslint-disable-next-line
  }, [displayWeekTraining]);

  return (
    <React.Fragment>
      {allPlayers != null && weekTrainings != null
        ? handlePreparingIncomingData()
        : null}
      {rankedPerformances != null && allThreeBest.length !== 0 ? (
        <React.Fragment>
          <h1>Meilleurs performances sur les {displayWeekTraining ? 7 : 31} derniers jours</h1>
          <WeekMonthSwitch
            switchValue={displayWeekTraining}
            handleSwitchChange={handleSwitchChange}
          />
          <div className={classes.root}>
            <BoxBestPlayer
              topic="MEILLEURS PERFORMANCES"
              bestPlayer={
                rankedPerformances != null
                  ? allPlayers[rankedPerformances[0]]
                  : null
              }
              bestPlayerAvg={
                rankedPerformances != null
                  ? allAvgPerformances[rankedPerformances[0]]
                  : null
              }
              secondPlayer={
                rankedPerformances != null
                  ? allPlayers[rankedPerformances[1]]
                  : null
              }
              secondPlayerAvg={
                rankedPerformances != null
                  ? allAvgPerformances[rankedPerformances[1]]
                  : null
              }
              thirdPlayer={
                rankedPerformances != null
                  ? allPlayers[rankedPerformances[2]]
                  : null
              }
              thirdPlayerAvg={
                rankedPerformances != null
                  ? allAvgPerformances[rankedPerformances[2]]
                  : null
              }
            />
            <BoxBestPlayer
              topic="PIRES PERFORMANCES"
              bestPlayer={
                rankedPerformances != null
                  ? allPlayers[
                      rankedPerformances[rankedPerformances.length - 3]
                    ]
                  : null
              }
              bestPlayerAvg={
                rankedPerformances != null
                  ? allAvgPerformances[
                      rankedPerformances[rankedPerformances.length - 3]
                    ]
                  : null
              }
              secondPlayer={
                rankedPerformances != null
                  ? allPlayers[
                      rankedPerformances[rankedPerformances.length - 2]
                    ]
                  : null
              }
              secondPlayerAvg={
                rankedPerformances != null
                  ? allAvgPerformances[
                      rankedPerformances[rankedPerformances.length - 2]
                    ]
                  : null
              }
              thirdPlayer={
                rankedPerformances != null
                  ? allPlayers[
                      rankedPerformances[rankedPerformances.length - 1]
                    ]
                  : null
              }
              thirdPlayerAvg={
                rankedPerformances != null
                  ? allAvgPerformances[
                      rankedPerformances[rankedPerformances.length - 1]
                    ]
                  : null
              }
            />
            {displayBoxes()})
          </div>
        </React.Fragment>
      ) : (
        <CircularProgress className={classes.spinner} />
      )}
    </React.Fragment>
  );
};

export default DashboardContent;
