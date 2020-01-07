import React from 'react';
import {makeStyles} from "@material-ui/styles";
import {Paper} from "@material-ui/core";
import {TextField} from "@material-ui/core";

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        padding: 5,
        width: '20%',
        height: 150,
        alignItems: 'center'
    },
    separator: {
        marginLeft: '15%',
        marginRight: '15%'
    },
    scoreBox: {
      display: 'flex',
        alignItems: 'center',
        width: 60,
        textAlign: 'center'

    },
    scoreContainer: {
        display: 'flex',
        justifyContent: 'center'
    },
    scoreInput:{
        fontSize: 30,
    }
}));

const ScoreDisplay = props => {
    const {goalScored, goalConceded, handleChangeGoalScored, handleChangeGoalConceded} = props;
    const classes = useStyles();

    return(
        <Paper className={classes.root}>
            <h2>Score</h2>
            <div className={classes.scoreContainer}>
                <TextField
                    value={goalScored}
                    className={classes.scoreBox}
                    onChange={e => handleChangeGoalScored(e)}
                    type={'number'}
                    InputProps={{
                        className: classes.scoreInput,
                    }}
                />
                <p className={classes.separator}>-</p>
                <TextField
                    value={goalConceded}
                    className={classes.scoreBox}
                    onChange={e => handleChangeGoalConceded(e)}
                    type={'number'}
                    InputProps={{
                        className: classes.scoreInput,
                    }}
                />
            </div>
        </Paper>
    )
};

export default ScoreDisplay;