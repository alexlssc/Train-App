import React from 'react';
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import Paper from "@material-ui/core/Paper";
import {makeStyles} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
import * as POSITIONS from '../../../../constants/positions'

const useStyles = makeStyles({
    root: {
        width: '100%',
        overflowX: 'auto',
    },
    table: {
        minWidth: 650,
    },
});

const TacticsEditTable = props => {
    const classes = useStyles();

    const tacticRow = (position, nb) => {
        const output = [];
        for (var i = 0; i < nb; i++){
            output.push(
                <TableRow>
                    <TableCell>{position}</TableCell>
                    <TableCell align={'right'}>
                        <IconButton aria-label="delete"  onClick={() => props.removePosition(position)}>
                            <DeleteIcon />
                        </IconButton>
                    </TableCell>
                </TableRow>
            )
        }
        return output;
    };

    const tacticBody = () => {
        return (
            POSITIONS.POSITION.map(position => (
                Object.entries(props.listPositions).map(([objectPosition, nb]) => {
                    if(position === objectPosition){
                        return tacticRow(objectPosition, nb);
                    }
                })
            ))
        )
    };

    return (
        <Paper className={classes.root}>
            <Table className={classes.table} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Poste</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {typeof props.listPositions != 'undefined' ? tacticBody() : null}
                </TableBody>
            </Table>
        </Paper>
    );
};

export default TacticsEditTable;