import React from 'react';
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({

    root: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        width: 40,
        height: 30,
        borderRadius: 5,
        float: 'right'
    },

    win: {
        backgroundColor: '#4CAF50'
    },
    draw: {
        backgroundColor: '#FFC107'
    },
    lose: {
        backgroundColor: '#D50000'
    },
}));

const ColouredScore = props => {
    const classes = useStyles();
    const {goalScored, goalConceded} = props;
    let variant;
    if(goalScored > goalConceded){
        variant = 'win';
    } else if (goalScored < goalConceded){
        variant = 'lose';
    } else {
        variant = 'draw';
    }

    return(
        <div className={`${classes.root} ${classes[variant]}`}>
            <p className={classes.text}>{`${goalScored} - ${goalConceded}`}</p>
        </div>
    )

};

export default ColouredScore;