import React from 'react';
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography"
import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';

const useStyles = makeStyles(theme => ({
    card: {
        minWidth: 275,
        width: '20%'

    },
    player: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    }
}));

const BoxBestPlayer = props => {
    const classes = useStyles();
    const { topic, bestPlayer, secondPlayer, thirdPlayer} = props;

    const bestName = bestPlayer !== null ? bestPlayer.lastName + ' ' + bestPlayer.firstName : 'NaN';
    const bestPerformance = bestPlayer !== null ? bestPlayer.avgPerformance : 'NaN';
    const secondName = secondPlayer !== null ? secondPlayer.lastName + ' ' + secondPlayer.firstName : 'NaN';
    const secondPerformance = secondPlayer !== null ? secondPlayer.avgPerformance : 'NaN';
    const thirdName = thirdPlayer !== null ? thirdPlayer.lastName + ' ' + thirdPlayer.firstName : 'NaN';
    const thirdPerformance = thirdPlayer !== null ? thirdPlayer.avgPerformance : 'NaN';


   return (
       <Card className={classes.card}>
           <CardContent>
               <Typography className={classes.title} color="textPrimary" gutterBottom>
                   Meilleur {topic}
               </Typography>
               <Divider/>
               <div className={classes.player}>
                   <p>{bestName}</p>
                   <p>{bestPerformance}</p>
               </div>
               <Divider/>
               <div className={classes.player}>
                   <p>{secondName}</p>
                   <p>{secondPerformance}</p>
               </div>
               <Divider/>
               <div className={classes.player}>
                   <p>{thirdName}</p>
                   <p>{thirdPerformance}</p>
               </div>
               <Divider/>
           </CardContent>
       </Card>
   )
};

export default BoxBestPlayer;
