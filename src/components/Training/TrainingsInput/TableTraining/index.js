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
                    {props.playerAttendees.map(playerAttendee => (
                        <TableRow key={playerAttendee.attendeeKey}>
                            <TableCell>{playerAttendee.attendeeName}</TableCell>
                            <TableCell align={'right'}>{playerAttendee.performance}</TableCell>
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