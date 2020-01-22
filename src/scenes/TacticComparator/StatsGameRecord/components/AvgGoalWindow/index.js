import React from 'react';
import { CardContent } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Card from '@material-ui/core/Card';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(theme => ({
  root: {
    minWidth: 275,
    width: '20%',
    marginBottom: 10,
  },
  title: {
    fontSize: 14,
  },
  number: {
    fontSize: 18,
    fontWeight: 'bolder',
  },
  goalScored: {
    color: '#4CAF50',
  },
  goalConceded: {
    color: '#F44336',
  },
  nbGames: {
    color: '#757575',
    fontSize: 12,
  }
}));

const AvgGoalWindow = props => {
  const classes = useStyles();
  // AvgGoalStats = [avgGoalScored, avgGoalConceded]
  const { avgGoalStats, nbGames } = props;

  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography className={classes.title} color="textPrimary" gutterBottom>
          Moyenne buts marqués / concédés
          <span className={classes.nbGames}>
            {' (' + nbGames + ' matchs joué(s))'}
          </span>
        </Typography>
        <div>
          <p className={classes.goalScored}>
            <span className={classes.number}>{avgGoalStats[0].toFixed(2)}</span>{' '}
            buts/match marqué
          </p>
        </div>
        <Divider />
        <div>
          <p className={classes.goalConceded}>
            <span className={classes.number}>{avgGoalStats[1].toFixed(2)}</span>{' '}
            buts/match concédé
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AvgGoalWindow;
