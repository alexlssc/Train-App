import React from 'react';
import clubData from "../../../constants/clubs.json";
import { useParams } from "react-router-dom";
import firebase from "firebase";
import {makeStyles} from "@material-ui/styles";
import TeamTacticDisplay from "./components/TeamTacticDisplay";
import {useDispatch} from "react-redux";
import {snackbarOn} from "../../../actions";

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
    const [opponentTeam, setOpponentTeam] = React.useState(null)
    const [isLoaded, setIsLoaded] = React.useState(false)
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
    }

    React.useEffect(() => {
        gameRecordHandler();
        tacticHandler();
        // eslint-disable-next-line
    }, []);

    return(
        <div className={classes.root}>
            {gameRecord != null && allTactics != null ? prepareIncomingData() : null}
            <TeamTacticDisplay
                allTactics={allTactics}
                opponentCard={false}
                handleChangeSelectedTactic={handleChangeSelectedTactic}
                targetTeam={clubData["5"]}
                targetTeamSelectedTactic={ownSelectedTactic}
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
    )
};

export default InputGameRecords;