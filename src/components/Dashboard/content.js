import React, {useState} from 'react';
import BoxBestPlayer from "../BoxBestPlayers";
import {makeStyles} from "@material-ui/styles";
import firebase from "firebase";
import * as POSITIONS from '../../constants/positions'

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
    }
}));

const DashboardContent  = () => {
    const classes = useStyles();
    const dbRefPlayers = firebase.database().ref('/players');

    const [playersData, setPlayersData] = useState({players: ''});
    const [loadingFinish, setLoadingFinish] = useState(false);
    const [rankedDone, setRankedDone] = useState(false);
    const [rankedPerformances, setRankedPerformances] = useState();
    let allThreeBest = [];

    const handleGetPlayers = async () => {
        const allPlayersSnapshot = await dbRefPlayers.once("value");
        try{
            const allPlayersData = allPlayersSnapshot.val();
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

    const sortPlayerPerPerformance = function(){
        try {
           if(loadingFinish === true && rankedDone === false){
               const playerSorted = Object.keys(playersData.players).sort(function(a,b){return playersData.players[a].avgPerformance - playersData.players[b].avgPerformance}).reverse();
               setRankedPerformances(playerSorted);
               setRankedDone(true);
           }
           if(loadingFinish === true && rankedDone === true){
               // Find three best player per position and add it to array
               for(let position of POSITIONS.POSITION){
                   allThreeBest.push(sortPlayerPerPositionPerPerformance(position))
               }
           }
        } catch (e) {
            console.log(e)
        }
    };

    const displayBoxes = () => {
        let output = [];
        allThreeBest.forEach((oneThreeBest, index) => {
            if(typeof oneThreeBest[0] !== 'undefined'){ //Display box only if there are players to display
                output.push(
                    <BoxBestPlayer
                    topic={`MEILLEURS ${POSITIONS.POSITION[index]}`}
                    bestPlayer={oneThreeBest.length !== 0 ? playersData.players[oneThreeBest[0]] : null}
                    secondPlayer={oneThreeBest.length !== 0 ? playersData.players[oneThreeBest[1]] : null}
                    thirdPlayer={oneThreeBest.length !== 0 ? playersData.players[oneThreeBest[2]] : null}
                    />)
            }
        });
        return output;
    }

    const sortPlayerPerPositionPerPerformance = targetPosition => {
        let threeBestPlayer = Array(3);
        let count = 0;
        for(let playerId of rankedPerformances){
            const tempPlayer = playersData.players[playerId];
            if(tempPlayer.positions.includes(targetPosition)){
                threeBestPlayer[count] = playerId;
                count++;
                if(count === 3){
                    return threeBestPlayer;
                }
            }
        }
        return threeBestPlayer;
    };

    React.useEffect(() => {
        handleGetPlayers();
        // eslint-disable-next-line
    }, []);
    return (
        <div className={classes.root}>
            {loadingFinish === true ? sortPlayerPerPerformance() : null}
            <BoxBestPlayer
                topic='MEILLEURS PERFORMANCES'
                bestPlayer={typeof rankedPerformances !== 'undefined' ? playersData.players[rankedPerformances[0]] : null}
                secondPlayer={typeof rankedPerformances !== 'undefined' ? playersData.players[rankedPerformances[1]] : null}
                thirdPlayer={typeof rankedPerformances !== 'undefined' ? playersData.players[rankedPerformances[2]] : null}
            />
            <BoxBestPlayer
                topic='PIRES PERFORMANCES'
                bestPlayer={typeof rankedPerformances !== 'undefined' ? playersData.players[rankedPerformances[rankedPerformances.length - 3]] : null}
                secondPlayer={typeof rankedPerformances !== 'undefined' ? playersData.players[rankedPerformances[rankedPerformances.length - 2]] : null}
                thirdPlayer={typeof rankedPerformances !== 'undefined' ? playersData.players[rankedPerformances[rankedPerformances.length - 1]] : null}
            />
            {allThreeBest.length !==0 ? displayBoxes() : null}
        </div>
    )
};

export default DashboardContent;