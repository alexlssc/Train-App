import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import DeleteIcon from '@material-ui/icons/Delete'
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import {Link} from "react-router-dom";

const useStyles = makeStyles({
    root: {
        width: '100%',
        overflowX: 'auto',
    },
    table: {
        minWidth: 650,
    },
});

const WeekTrainingTable = props => {
    const classes = useStyles();
    return (
        <Paper className={classes.root}>
            <Table className={classes.table} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell align="right">Performance moyenne</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {Object.entries(props.trainings).map(([key, trainingObject]) => (
                        <TableRow key={key}>
                            <TableCell>{trainingObject['date']}</TableCell>
                            <TableCell align={"right"}>{trainingObject['overallPerformance']}</TableCell>
                            <TableCell align={'right'} style={{width: 50}}>
                                <Link
                                    to={'trainings/' + key}
                                >
                                    <IconButton aria-label="edit">
                                        <EditIcon />
                                    </IconButton>
                                </Link>
                            </TableCell>
                            <TableCell align={'right'} style={{width: 50}}>
                                <IconButton aria-label="delete" onClick={() => props.deleteHandler(key)} >
                                    <DeleteIcon />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Paper>
    )
}

export default WeekTrainingTable;