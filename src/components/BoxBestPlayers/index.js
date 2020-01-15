import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import ColouredNumber from '../ColouredNumber';

const useStyles = makeStyles(theme => ({
  card: {
    minWidth: 275,
    width: '20%',
    marginBottom: 10,
  },
  player: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 14,
  },
}));

const BoxBestPlayer = props => {
  const classes = useStyles();
  const {
    topic,
    bestPlayer,
    bestPlayerAvg,
    secondPlayer,
    secondPlayerAvg,
    thirdPlayer,
    thirdPlayerAvg,
  } = props;
  let bestName,
    bestPerformance,
    secondName,
    secondPerformance,
    thirdName,
    thirdPerformance;
  try {
    bestName = bestPlayer.lastName + ' ' + bestPlayer.firstName;
    bestPerformance = bestPlayerAvg;
  } catch (e) {
    bestName = 'NaN';
    bestPerformance = 'NaN';
  }
  try {
    secondName = secondPlayer.lastName + ' ' + secondPlayer.firstName;
    secondPerformance = secondPlayerAvg;
  } catch (e) {
    secondName = 'NaN';
    secondPerformance = 'NaN';
  }
  try {
    thirdName = thirdPlayer.lastName + ' ' + thirdPlayer.firstName;
    thirdPerformance = thirdPlayerAvg;
  } catch (e) {
    thirdName = 'NaN';
    thirdPerformance = 'NaN';
  }

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography className={classes.title} color="textPrimary" gutterBottom>
          {topic}
        </Typography>
        <Divider />
        <div className={classes.player}>
          <p>{bestName}</p>
          <ColouredNumber performance={bestPerformance} />
        </div>
        <Divider />
        <div className={classes.player}>
          <p>{secondName}</p>
          <ColouredNumber performance={secondPerformance} />
        </div>
        <Divider />
        <div className={classes.player}>
          <p>{thirdName}</p>
          <ColouredNumber performance={thirdPerformance} />
        </div>
        <Divider />
      </CardContent>
    </Card>
  );
};

export default BoxBestPlayer;
