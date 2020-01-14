import React from "react";
import Card from "@material-ui/core/Card";
import {makeStyles} from "@material-ui/styles";
import {CardContent} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";

const useStyles = makeStyles(theme => ({
    root: {
        minWidth: 275,
        width: '20%',
        marginBottom: 10,
    },
    title: {
        fontSize: 14
    },
    number: {
        fontSize: 18,
        fontWeight: 'bolder',
    },
    victoryText: {
        color: '#4CAF50',
    },
    drawText: {
        color: '#FFC107'
    },
    loseText: {
        color: '#F44336'
    }
}));

const WinLoseDrawWindow = props => {
    const {winLoseStats} = props;
    const classes = useStyles();
    const totalNbOfMatch = winLoseStats[0] + winLoseStats[1] + winLoseStats[2];

    return (
        <Card className={classes.root}>
            <CardContent>
                <Typography className={classes.title} color="textPrimary" gutterBottom>
                    Victoire / Nul / Défaite
                </Typography>
                <div>
                    <p className={classes.victoryText}>
                        <span className={classes.number}>{winLoseStats[0] / totalNbOfMatch * 100}</span> % de victoire
                    </p>
                </div>
                <Divider/>
                <div>
                    <p className={classes.drawText}>
                        <span className={classes.number}>{winLoseStats[1] / totalNbOfMatch * 100}</span> % de nul
                    </p>
                </div>
                <Divider/>
                <div>
                    <p className={classes.loseText}>
                        <span className={classes.number}>{winLoseStats[2] / totalNbOfMatch * 100}</span> % de défaite
                    </p>
                </div>
                <Divider/>
            </CardContent>
        </Card>
    )
};

export default WinLoseDrawWindow;