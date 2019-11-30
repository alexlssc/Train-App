import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import firebase from "firebase";

const useStyles = makeStyles({
    root: {
        width: '100%',
        overflowX: 'auto',
    },
    table: {
        minWidth: 650,
    },
});

const PlayerTable = () => {
    const classes = useStyles();
    const initial_state = {player: ''};

    const [listPlayers, setListPlayers] = React.useState(initial_state);
    const dbRef = firebase.database().ref('players');

    const fetchPlayers = async () => {
        const snap = await dbRef.once('value')
        const newValue = {uid: snap.key, values: snap.val()};
        setListPlayers({...listPlayers, player: snap.val()})
    }

    React.useEffect(() => {
        fetchPlayers()
    }, []);

    return (
        <Paper className={classes.root}>
            <Table className={classes.table} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell >Nom</TableCell>
                        <TableCell align="right">Prénom</TableCell>
                        <TableCell align="right">Age</TableCell>
                        <TableCell align="right">Positions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {Object.entries(listPlayers.player).map(([key, playerObject]) => (
                        <TableRow key={key}>
                            <TableCell >{playerObject["lastName"]}</TableCell>
                            <TableCell align="right">{playerObject["firstName"]}</TableCell>
                            <TableCell align="right">{playerObject["dob"]}</TableCell>
                            <TableCell align="right">{playerObject["positions"]}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Paper>
    );
};



export default PlayerTable;