import React from 'react'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Select from "react-select";
import DeleteIcon from '@material-ui/icons/Delete'
import IconButton from '@material-ui/core/IconButton';
import {makeStyles} from "@material-ui/styles";
import * as RATINGS from '../../../../constants/ratings';

const useStyle = () => (makeStyles({
}));




const TableTraining = props => {

    function displayAttendeesRows(){
        if(typeof props.playerAttendees != "undefined"){
            const output = Object.entries(props.playerAttendees).map(([key, playerObject]) => (
                <TableRow key={key}>
                    <TableCell>{playerObject["lastName"] + ' ' + playerObject["firstName"]}</TableCell>
                    <TableCell align={'right'}>
                        <Select
                            defaultValue={RATINGS.RATINGS[playerObject['performance'] - 1]}
                            value={RATINGS.RATINGS[playerObject['performance'] - 1]}
                            label="Single select"
                            options={
                                RATINGS.RATINGS.map(rating => (
                                    rating
                                ))
                            }
                            onChange={value => props.updatePlayerAttendee(key, value)}
                        />
                    </TableCell>
                    <TableCell align={'right'} style={{width: 50}}>
                        <IconButton aria-label="delete" onClick={() => props.deletePlayerAttendee(key)} >
                            <DeleteIcon />
                        </IconButton>
                    </TableCell>
                </TableRow>
            ))
            return output;
        }
    }

    return (
        <Paper>
            <Table>
                <TableHead>
                    <TableCell>Nom</TableCell>
                    <TableCell align={'right'}>Performance</TableCell>
                </TableHead>
                <TableBody>
                    {displayAttendeesRows()}
                    {console.log(props.playerAttendees)}
                </TableBody>
            </Table>
        </Paper>
    );
};

export default TableTraining;