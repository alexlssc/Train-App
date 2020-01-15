import React from 'react';
import { CardContent } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import { makeStyles } from '@material-ui/styles';
import FormSquareDisplay from '../FormSquareDisplay';

const useStyles = makeStyles(theme => ({
  root: {
    minWidth: 275,
    width: '30%',
    marginBottom: 10,
  },
  title: {
    fontSize: 14,
  },
  number: {
    fontSize: 18,
    fontWeight: 'bolder',
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
  },
}));

const RecentFormWindow = props => {
  const classes = useStyles();
  const { recentFormStats } = props;

  const allRecentForm = () => {
    let output = [];
    for (const key in recentFormStats) {
      if(output.length < 5){
        output.push(<FormSquareDisplay key={key} oneResultData={recentFormStats[key]} />);
      } else {
        break;
      }
    }
    while (output.length < 5) {
      output.push(<FormSquareDisplay oneResultData={null} />);
    }
    return output;
  };

  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography className={classes.title} color="textPrimary" gutterBottom>
          Forme sur les 5 derniers matchs
        </Typography>
        <div className={classes.formContainer}>{allRecentForm()}</div>
      </CardContent>
    </Card>
  );
};

export default RecentFormWindow;
