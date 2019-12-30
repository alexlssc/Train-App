import React from 'react';
import clubData from "../../../constants/clubs.json";
import { useParams } from "react-router-dom";
import firebase from "firebase";

const InputGameRecords = () => {
    const { id } = useParams();
    const [gameRecord, setGameRecord] = React.useState(null)
    const db = firebase.firestore();

    const gameRecordHandler = () => {
        db.collection('gameRecords').doc(id)
            .onSnapshot(doc => {
                setGameRecord(doc.data())
            });
    };

    React.useEffect(() => {
        gameRecordHandler();
    }, [])

    return(
        <React.Fragment>
            <h1>Club Data</h1>
            {console.log(clubData)}
        </React.Fragment>
    )
}

export default InputGameRecords