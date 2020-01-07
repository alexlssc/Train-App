import React from 'react';
import clubData from "../../../constants/clubs.json";
import { useParams } from "react-router-dom";
import firebase from "firebase";
import {makeStyles} from "@material-ui/styles";
import TeamTacticDisplay from "./components/TeamTacticDisplay";
import ScoreDisplay from "./components/ScoreDisplay";
import {useDispatch} from "react-redux";
import {snackbarOn} from "../../../actions";
import DatePicker from "../../../components/DatePicker";

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        justifyContent: 'space-between'
    }
}));

const InputGameRecords = () => {
    const { id } = useParams();
    const classes = useStyles();
    const [gameRecord, setGameRecord] = React.useState(null);
    const [allTactics, setAllTactics] = React.useState(null);
    const [ownSelectedTactic, setOwnSelectedTactic] = React.useState(null);
    const [opponentSelectedTactic, setOpponentSelectedTactic] = React.useState(null);
    const [opponentTeam, setOpponentTeam] = React.useState(null);
    const [goalScored, setGoalScored] = React.useState(0);
    const [goalConceded, setGoalConceded] = React.useState(0);
    const [isLoaded, setIsLoaded] = React.useState(false);
    const dispatch = useDispatch();
    const db = firebase.firestore();

    // Deal with special case of data initially loaded
    const prepareIncomingData = () => {
        if(!isLoaded){
            if(gameRecord.ownTactic != null){
                setOwnSelectedTactic(gameRecord.ownTactic)
            }
            if(gameRecord.opponentTactic != null){
                setOpponentSelectedTactic(gameRecord.opponentTactic)
            }
            if(gameRecord.opponent != null){
                setOpponentTeam(clubData[gameRecord.opponent.id])
            }
            if(gameRecord.goalScored != null){
                setGoalScored(gameRecord.goalScored)
            }
            if(gameRecord.goalConceded != null){
                setGoalConceded(gameRecord.goalConceded)
            }
            setIsLoaded(true);
        }

    };

    const gameRecordHandler = () => {
        db.collection('gameRecords').doc(id)
            .onSnapshot(doc => {
                setGameRecord(doc.data())
            });
    };

    const tacticHandler = () =>{
        db.collection('tactics')
            .onSnapshot(querySnapshot => {
                let nextState = {};
                querySnapshot.forEach(doc => {
                    nextState = {...nextState, [doc.id] : doc.data()}
                });
                setAllTactics(nextState)
            })
    };

    const handleChangeOpponent = event => {
        const tempValue = event.target.value;
        db.collection('gameRecords').doc(id).set({
           opponent: {
               id: tempValue,
               name: clubData[tempValue].name
           }
        }, {merge: true})
            .then(() => {
                setOpponentTeam(clubData[tempValue]);
                dispatch(snackbarOn('Adversaire modifié', 'success', new Date()))
            })
            .catch(() => {
                dispatch(snackbarOn('Erreur: Adversaire non modifié', 'error', new Date()))
            })
    };

    const handleChangeSelectedTactic = (event, opponentCard) => {
        try{
            const targetTactic = event.target.value;
            if(!opponentCard){
                db.collection('gameRecords').doc(id).set({
                    ownTactic: targetTactic
                }, {merge: true})
                    .then(() => {
                        setOwnSelectedTactic(targetTactic);
                        dispatch(snackbarOn('Tactique modifié', 'success', new Date()))
                    })
                    .catch(() => {
                        dispatch(snackbarOn('Erreur: Tactique non modifié', 'error', new Date()))
                    })
            } else {
                db.collection('gameRecords').doc(id).set({
                    opponentTactic: targetTactic
                }, {merge: true})
                    .then(() => {
                        setOpponentSelectedTactic(targetTactic)
                        dispatch(snackbarOn('Tactique modifié', 'success', new Date()))
                    })
                    .catch(() => {
                        dispatch(snackbarOn('Erreur: Tactique non modifié', 'error', new Date()))
                    })
            }
        } catch (e) {
            console.error("Error: Selected tactic not changed")
        }
    };

    const handleChangeGoalScored = event => {
        const tempValue = event.target.value
        db.collection('gameRecords').doc(id).set({
            goalScored: tempValue
        }, {merge: true})
            .then(() => {
            setGoalScored(tempValue);
            dispatch(snackbarOn('But marqué modifié', 'success', new Date()))
        })
            .catch(() => {
                dispatch(snackbarOn('Erreur: But marqué non modifié', 'success', new Date()))
            })

    };

    const handleChangeGoalConceded = event => {
        const tempValue = event.target.value;
        db.collection('gameRecords').doc(id).set({
            goalConceded: tempValue
        }, {merge: true})
            .then(() => {
                setGoalConceded(tempValue);
                dispatch(snackbarOn('But concédé modifié', 'success', new Date()))
            })
            .catch(() => {
                dispatch(snackbarOn('Erreur: But concédé non modifié', 'success', new Date()))
            })

    };

    const handleOnChangeDatePicker = date => {
        setGameRecord(prevState=> ({
            ...prevState,
            date: date != null ? date.toLocaleString().slice(0,10) : ''
        }))
    };

    // REGEX
    function hasNumber(myString) {
        return /\d/.test(myString);
    }

    // Format date to dd/MM/yyyy
    function rightFormatDate(oldDate){
        try{
            const dateParts = oldDate.split('/');
            return new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
        } catch (e) {
            return null
        }
    }

    const handleUpdateDate = () => {
        try{
            if(hasNumber(gameRecord.date)){ // Check if date format valid
                db.collection('gameRecords').doc(id).set({
                    date: gameRecord.date,
                    dateStamp: rightFormatDate(gameRecord.date)
                }, {merge : true})
                    .then(() => {
                        dispatch(snackbarOn('Date mis à jour', 'success', new Date()))
                    })
                    .catch(() => {
                        dispatch(snackbarOn('Erreur: Date non mis à jour', 'error', new Date()))
                    })
            } else {
                dispatch(snackbarOn('Format date invalide', 'error', new Date()))
            }
        } catch (e) {
            dispatch(snackbarOn('Erreur avec date', 'error', new Date()))
        }
    };

    React.useEffect(() => {
        gameRecordHandler();
        tacticHandler();
        // eslint-disable-next-line
    }, []);

    return(
        <React.Fragment>
            <DatePicker
                datePickerPropsValue={gameRecord != null ? gameRecord.date : null}
                datePickerOnChange={handleOnChangeDatePicker}
                datePickerOnClick={handleUpdateDate}
            />
            <div className={classes.root}>
                {gameRecord != null && allTactics != null ? prepareIncomingData() : null}
                <TeamTacticDisplay
                    allTactics={allTactics}
                    opponentCard={false}
                    handleChangeSelectedTactic={handleChangeSelectedTactic}
                    targetTeam={clubData["5"]}
                    targetTeamSelectedTactic={ownSelectedTactic}
                />
                <ScoreDisplay
                    goalScored={goalScored}
                    goalConceded={goalConceded}
                    handleChangeGoalScored={handleChangeGoalScored}
                    handleChangeGoalConceded={handleChangeGoalConceded}
                />
                <TeamTacticDisplay
                    allTactics={allTactics}
                    allClubs={clubData}
                    opponentCard={true}
                    handleChangeSelectedTactic={handleChangeSelectedTactic}
                    handleChangeOpponent={handleChangeOpponent}
                    targetTeam={opponentTeam}
                    targetTeamSelectedTactic={opponentSelectedTactic}
                />
            </div>
        </React.Fragment>

    )
};

export default InputGameRecords;