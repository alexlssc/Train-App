import React, { useState } from 'react';
import WeekTrainingTable from './WeekTrainingTable';
import { Button, makeStyles } from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import firebase from 'firebase';
import { useDispatch } from 'react-redux';
import { snackbarOn } from '../../../actions';
import WeekMonthSwitch from '../../../components/WeekMonthSwitch';

const useStyles = makeStyles({
  button: {
    marginTop: 20,
    float: 'right',
  },
  switch: {
    float: 'right',
  },
});

const TrainingContent = () => {
  const classes = useStyles();

  const [trainings, setTrainings] = useState({ trainings: '' });
  const [displayWeekTraining, setDisplayWeekTrainings] = useState(true);
  const dispatch = useDispatch();
  const db = firebase.firestore();
  let history = useHistory();

  const getTodayDate = () => {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();
    return dd + '/' + mm + '/' + yyyy;
  };

  // return max date in the past to retrieve training
  const getTargetDate = nbDays => {
    const currentTimestamp = Date.parse(new Date());
    const targetTimestamp = currentTimestamp - 8.64e7 * nbDays;
    return new Date(targetTimestamp).toLocaleString().slice(0, 10);
  };

  // Format date to dd/MM/yyyy
  function rightFormatDate(oldDate) {
    try {
      const dateParts = oldDate.split('/');
      return new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
    } catch (e) {
      return null;
    }
  }

  const handleSwitchChange = () => {
    setDisplayWeekTrainings(!displayWeekTraining);
  };
  const trainingsHandler = () => {
    const targetDays = displayWeekTraining ? 7 : 31;
    db.collection('trainings')
      .where('dateStamp', '>=', rightFormatDate(getTargetDate(targetDays)))
      .onSnapshot(querySnapshot => {
        let nextState = {};
        querySnapshot.forEach(doc => {
          nextState = { ...nextState, [doc.id]: doc.data() };
        });
        setTrainings(prevState => {
          return { trainings: nextState };
        });
      });
  };
  const handleNewTraining = () => {
    db.collection('trainings')
      .add({
        date: getTodayDate(),
        dateStamp: new Date(),
        overallPerformance: 0,
      })
      .then(docRef => {
        const key = docRef.id;
        history.push('/trainings/' + key);
      })
      .catch(() => {
        dispatch(
          snackbarOn('Erreur creation entrainement', 'error', new Date()),
        );
      });
  };

  const handleEditTrainings = key => {
    return (
      <Link
        to={{
          pathname: '/trainings/' + key,
          search: '?sort=name',
          hash: '#the-hash',
          state: { fromDashboard: true },
        }}
      />
    );
  };

  const handleDeleteTrainings = async key => {
    try {
      await Promise.all(
        Object.keys(trainings.trainings[key].playerAttendees).map(
          playerAttendee =>
            db
              .collection('players')
              .doc(playerAttendee)
              .set(
                {
                  trainingsAttended: firebase.firestore.FieldValue.arrayRemove(
                    key,
                  ),
                },
                { merge: true },
              ),
        ),
      );
    } catch (e) {
      console.error('No player attendees');
    }

    await db
      .collection('trainings')
      .doc(key)
      .delete();
  };

  React.useEffect(() => {
    trainingsHandler();
    // eslint-disable-next-line
  }, [displayWeekTraining]);

  return (
    <div>
      <h1>Entraînement ces {displayWeekTraining ? 7 : 31} derniers jours</h1>
      <WeekMonthSwitch
        switchValue={displayWeekTraining}
        handleSwitchChange={handleSwitchChange}
      />
      <WeekTrainingTable
        className={classes.switch}
        trainings={trainings.trainings}
        editHandler={handleEditTrainings}
        deleteHandler={handleDeleteTrainings}
      />
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddCircleIcon />}
        className={classes.button}
        onClick={() => handleNewTraining()}
      >
        Ajouter
      </Button>
    </div>
  );
};

export default TrainingContent;
