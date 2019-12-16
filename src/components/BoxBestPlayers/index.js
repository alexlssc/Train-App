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
    const { topic, bestName, bestPerformance, secondName, secondPerformance, thirdName, thirdPerformance} = props
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
