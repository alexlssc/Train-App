import React, {useState} from "react";
import TableBestEleven from "./TableBestEleven";
import firebase from "firebase";
import * as POSITIONS from "../../constants/positions";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import {Paper} from "material-ui";
import {makeStyles} from "@material-ui/styles";
import {useDispatch} from "react-redux";
import {snackbarOn} from "../../actions";

const useStyles = makeStyles({
    form: {
        width: '100%',
    },
    select: {
        width: '100%',
    }
});

const BestElevenContent = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const [selectedTactic, setSelectedTactic] = useState(null);
    const [playersData, setPlayersData] = useState({players: ''});
    const [allTactics, setAllTactics] = useState(null)
    const [loadingFinish, setLoadingFinish] = useState(false);
    const [rankedDone, setRankedDone] = useState(false);
    const [rankedPerformances, setRankedPerformances] = useState();

    const dbRefTactic = firebase.database().ref('tactics');
    const dbRefPlayers = firebase.database().ref('/players');

    let allThreeBest = [];

    const handleGetTactics = async() => {
        const tacticSnapshot = await dbRefTactic.once('value');
        try{
            const tacticsData = tacticSnapshot.val();
            setAllTactics(tacticsData);
            // Set first tactic as default
            setSelectedTactic(tacticsData[Object.keys(tacticsData)[0]])

        }catch (e) {
            console.log("Can't extract data from database");
        }

    };

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

    const sortPlayerPerPositionPerPerformance = targetPosition => {
        let threeBestPlayer = Array(3);
        let count = 0;
        for(let playerId of rankedPerformances){
            const tempPlayer = playersData.players[playerId];
            if(tempPlayer.positions.includes(targetPosition)){
                threeBestPlayer[count] = tempPlayer;
                count++;
                if(count === 3){
                    return threeBestPlayer;
                }
            }
        }
        return threeBestPlayer;
    };
    const handleChangeTactic = e => {
        try{
            setSelectedTactic(e.target.value)
            dispatch(snackbarOn('Nouvelle tactique selectionné', 'success', new Date()));
        } catch (e) {
            dispatch(snackbarOn('Nouvelle tactique selectionné', 'success', new Date()));
        }

    };

    React.useEffect(() => {
        handleGetTactics();
        handleGetPlayers();
        // eslint-disable-next-line
    }, []);

    return (
        <div>
            {loadingFinish === true ? sortPlayerPerPerformance() : null}
            <Paper>
                <FormControl variant="outlined" className={classes.form}>
                    <InputLabel id="demo-simple-select-outlined-label">
                        Choisissez une formation
                    </InputLabel>
                    <Select
                        labelId="demo-simple-select-outlined-label"
                        id="demo-simple-select-outlined"
                        value={selectedTactic !== null ? selectedTactic : ''}
                        onChange={e => handleChangeTactic(e)}
                    >
                        {allTactics !== null ? Object.values(allTactics).map(oneTactic => (<MenuItem key={oneTactic.name} value={oneTactic}>{oneTactic.name}</MenuItem>)) : ''}
                    </Select>
                </FormControl>
            </Paper>
            <TableBestEleven
                selectedTactic={selectedTactic !== null ? selectedTactic : null}
                allThreeBest={allThreeBest.length !== 0 ? allThreeBest : null}
            />
        </div>
    )
};

export default BestElevenContent;