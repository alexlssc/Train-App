import React from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        width: 30,
        height: 30,
        borderRadius: 5,
    },
    great: {
        backgroundColor: '#4CAF50'
    },
    good: {
        backgroundColor: '#8BC34A'
    },
    average: {
        backgroundColor: '#CDDC39'
    },
    belowAverage: {
        backgroundColor: '#FFC107'
    },
    bad: {
        backgroundColor: '#FF5722'
    },
    terrible: {
        backgroundColor: '#D50000'
    },
    text: {
        fontWeight: 'bold'
    }
}));

const ColouredNumber = props => {
    const { performance } = props;
    const classes = useStyles();
    let variant;
    if(performance <= 4 && performance > 3.5){
        variant = 'great';
    } else if (performance <= 3.5 && performance > 3){
        variant = 'good';
    } else if (performance <= 3 && performance > 2.5){
        variant = 'average';
    } else if (performance <= 2.5 && performance > 2){
        variant = 'belowAverage'
    } else if (performance <= 2 && performance > 1.5){
        variant = 'bad';
    } else if (performance <= 1.5 && performance >= 1){
        variant = 'terrible';
    }

    return(
        <div className={`${classes.root} ${classes[variant]}`}>
            <p className={classes.text}>{performance}</p>
        </div>
    )
};

export default ColouredNumber;