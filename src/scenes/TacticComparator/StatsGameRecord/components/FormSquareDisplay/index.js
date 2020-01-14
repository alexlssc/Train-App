import React from 'react';
import clsx from 'clsx'
import {makeStyles} from "@material-ui/styles";
import clubData from '../../../../../constants/clubs'


const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: 50,
        height: 50,
        borderRadius: 5
    },
    win: {
        backgroundColor: '#4CAF50',
    },
    draw: {
        backgroundColor: '#FFC107'
    },
    lose: {
        backgroundColor: '#F44336'
    },
    unknown: {
        backgroundColor: '#9E9E9E'
    },
    unknownText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bolder',
    },
    logo: {
        width: 30,
        height: 30,
        filter: 'drop-shadow(0px 0px 3px)'
    }
}));


const FormSquareDisplay = props => {
    const {oneResultData} = props;
    const classes = useStyles();
    const variant = oneResultData != null ? oneResultData.result : 'unknown';
    return (
        <div className={clsx(classes.root, classes[variant])}>
            {oneResultData != null ? <img className={classes.logo} src={clubData[oneResultData.opponent].logo} alt={clubData[oneResultData.opponent].name}/> : <p className={classes.unknownText}>?</p>}
        </div>
    )
};

export default FormSquareDisplay