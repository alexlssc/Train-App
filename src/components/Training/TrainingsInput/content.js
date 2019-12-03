import React, {useState} from "react";
import firebase from "firebase";
import SearchBar from "../../SearchBar";

const TrainingsInputContent = () => {
    const [listPlayers, setListPlayers] = useState('');

    const dbRef = firebase.database().ref('/players');

    const listPlayersHandler = () => {
        const handlePlayers = snap => {
            if (snap.val()) setListPlayers({player: snap.val()});
        };
        dbRef.orderByChild('uid/lastName').once('value', handlePlayers)
    };

    React.useState(() => {
        listPlayersHandler()
    }, []);

    return (
        <div>
            <h1>Ajouter un entraînement</h1>
            <SearchBar/>
        </div>
    )
};

export default TrainingsInputContent;

