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
}))

const TableTraining = props => {
    return (
        <Paper>
            <Table>
                <TableHead>
                    <TableCell>Nom</TableCell>
                    <TableCell align={'right'}>Performance</TableCell>
                </TableHead>
                <TableBody>
                    {Object.entries(props.playerAttendees.players).map(([key, playerObject]) => (
                        <TableRow key={key}>
                            <TableCell>{playerObject["attendeeName"]}</TableCell>
                            <TableCell align={'right'}>
                                <Select
                                    defaultValue={''}
                                    label="Single select"
                                    options={
                                        RATINGS.RATINGS.map(rating => (
                                            {value: rating, label: rating}
                                        ))
                                    }
                                    onChange={value => props.updatePlayerAttendee(key, value)}
                                />
                            </TableCell>
                            <TableCell align={'right'} style={{width: 50}}>
                                <IconButton aria-label="delete" >
                                    <DeleteIcon />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Paper>
    );
};

export default TableTraining;