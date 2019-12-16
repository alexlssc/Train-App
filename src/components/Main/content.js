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

    const handleGetPlayers = () => {
        dbRefPlayers.once("value").then(snap => {
            Object.entries(snap.val()).map(([playerId, playerObject]) => (
                dbRefPlayers.child(playerId).child('trainingsAttended').limitToLast(7).once("value").then(snap => {
                    try{
                        const individualPlayerPerformance = [];
                        Object.values(snap.val()).map(playerTraining => (
                            individualPlayerPerformance.push(playerTraining.performance)
                        ));
                        setPlayersData(prevState => ({
                            players: {
                                ...prevState.players,
                                [playerId]: {
                                    firstName: playerObject.firstName,
                                    lastName: playerObject.lastName,
                                    positions: playerObject.positions,
                                    performances: individualPlayerPerformance,
                                    avgPerformance:  getAverage(individualPlayerPerformance)

                                }
                            }
                        }))
                    } catch (e) {
                        console.log(e)
                    }
                })
            ))
        })
    };

    const getAverage = allPerformances => {
        let sum = allPerformances.reduce((previous, current) => current += previous);
        let avg = sum / allPerformances.length;
        return Math.round(avg * 10) / 10;
    }

    React.useEffect(() => {
        handleGetPlayers()
        // eslint-disable-next-line
    }, []);
    return (
        <div className={classes.root}>
            <BoxBestPlayer
                topic='Joueur'
                bestName='Alexandre Lissac'
                bestPerformance={3.5}
                secondName='Antoine Grosset'
                secondPerformance={3.15}
                thirdName='Nicolas Bourdin'
                thirdPerformance={2.9}
            />
        </div>
    )
};

export default DashboardContent;