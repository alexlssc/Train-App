import React from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Switch from '@material-ui/core/Switch';
import {makeStyles} from "@material-ui/styles";

const useStyles = makeStyles(theme => ({
    root:{
        float: 'right'
    }
}))

const WeekMonthSwitch = props => {
  const { switchValue, handleSwitchChange } = props;
  const classes = useStyles();
  return (
    <Typography component="div">
      <Grid className={classes.root} component="label" container xs={3} alignItems="center" justify="flex-end" spacing={1}>
        <Grid item>Mois</Grid>
        <Grid item>
          <Switch
            checked={switchValue}
            onChange={() => handleSwitchChange()}
            value="switchValue"
            color="primary"
            inputProps={{ 'aria-label': 'primary checkbox' }}
          />
        </Grid>
        <Grid item>Semaine</Grid>
      </Grid>
    </Typography>
  );
};

export default WeekMonthSwitch;
