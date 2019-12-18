import React, {useState} from 'react';
import BoxBestPlayer from "../BoxBestPlayers";
import {makeStyles} from "@material-ui/styles";
import firebase from "firebase";

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        justifyContent: 'center'
    }
}));

const DashboardContent  = () => {
    const classes = useStyles();
    const dbRefPlayers = firebase.database().ref('/players');

    const [playersData, setPlayersData] = useState({players: ''});
    const [loadingFinish, setLoadingFinish] = useState(false);
    const [playersCount, setPlayersCount] = useState(0);
    const [rankedPerformance, setRankedPerformances] = useState();


    const handleGetPlayers = async () => {
        const allPlayersSnapshot = await dbRefPlayers.once("value");
        try{
            const allPlayersData = allPlayersSnapshot.val();
            setPlayersCount(Object.keys(allPlayersData).length);
            await Promise.all(Object.entries(allPlayersData).map(async ([playerId, playerObject]) => {
                const playerTrainingDataSnapshot = await dbRefPlayers.child(playerId).child('trainingsAttended').limitToLast(7).once('value');
                try{
                    const playerTrainingData = playerTrainingDataSnapshot.val();
                    const individualPlayerPerformance = Object.values(playerTrainingData).map(singleTrainingData => (
                        singleTrainingData.performance
                    ));
                    setPlayersData(prevState => ({
                        players: {
                            ...prevState.players,
                            [playerId]: {
                                firstName: playerObject.firstName,
                                lastName: playerObject.lastName,
                                positions: playerObject.positions,
                                performances: individualPlayerPerformance,
                                avgPerformance: getAverage(individualPlayerPerformance)
                            }
                        }
                    }))
                } catch (e) {
                    console.log(e)
                }
            }));
            setLoadingFinish(true)
        }catch (e) {
            console.log(e)
        }
    };

    const getAverage = allPerformances => {
        let sum = allPerformances.reduce((previous, current) => current += previous);
        let avg = sum / allPerformances.length;
        return Math.round(avg * 10) / 10;
    };

    const getBest3Players = () => {
        try {
           if(loadingFinish){
               const playerSorted = Object.keys(playersData.players).sort(function(a,b){return playersData.players[a].avgPerformance - playersData.players[b].avgPerformance}).reverse();
               setRankedPerformances(playerSorted);
           }
        } catch (e) {
            console.log(e)
        }
    };

    React.useEffect(() => {
        handleGetPlayers()
        // eslint-disable-next-line
    }, []);
    return (
        <div className={classes.root}>
            {getBest3Players()}
            <BoxBestPlayer
                topic='Joueur'
                bestPlayer={typeof rankedPerformance !== 'undefined' ? playersData.players[rankedPerformance[0]] : null}
                secondPlayer={typeof rankedPerformance !== 'undefined' ? playersData.players[rankedPerformance[1]] : null}
                thirdPlayer={typeof rankedPerformance !== 'undefined' ? playersData.players[rankedPerformance[2]] : null}
            />
        </div>
    )
};

export default DashboardContent;