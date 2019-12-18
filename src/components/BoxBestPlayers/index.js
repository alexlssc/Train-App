import React from 'react';
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography"
import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import ColouredNumber from "../ColouredNumber";

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
    let bestName, bestPerformance, secondName, secondPerformance, thirdName, thirdPerformance;
    try{
        bestName = bestPlayer.lastName + ' ' + bestPlayer.firstName;
        bestPerformance = bestPlayer.avgPerformance;
    } catch (e) {
        bestName = 'NaN';
        bestPerformance = 'NaN'
    }
    try{
        secondName = secondPlayer.lastName + ' ' + secondPlayer.firstName;
        secondPerformance = secondPlayer.avgPerformance;
    } catch (e) {
        secondName = 'NaN';
        secondPerformance = 'NaN';
    }
    try{
        thirdName = thirdPlayer.lastName + ' ' + thirdPlayer.firstName;
        thirdPerformance = thirdPlayer.avgPerformance;
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
               <Divider/>
               <div className={classes.player}>
                   <p>{bestName}</p>
                   <ColouredNumber performance={bestPerformance}/>
               </div>
               <Divider/>
               <div className={classes.player}>
                   <p>{secondName}</p>
                   <ColouredNumber performance={secondPerformance}/>
               </div>
               <Divider/>
               <div className={classes.player}>
                   <p>{thirdName}</p>
                   <ColouredNumber performance={thirdPerformance}/>
               </div>
               <Divider/>
           </CardContent>
       </Card>
   )
};

export default BoxBestPlayer;
