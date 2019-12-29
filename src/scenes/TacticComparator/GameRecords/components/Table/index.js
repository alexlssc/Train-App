import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Paper from "@material-ui/core/Paper";
import PropTypes from "prop-types";
import Table from "@material-ui/core/Table";


const useStyles = makeStyles({

});

const TacticComparatorTable = props => {
    const classes = useStyles();

    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('lastName');

    const handleRequestSort = (event, property) => {
        const isDesc = orderBy === property && order === 'desc';
        setOrder(isDesc ? 'asc' : 'desc');
        setOrderBy(property);
    };


    return (
        <Paper>
            <Table className={classes.table} aria-label="tactic comparator table">
                <EnhancedTableHead classes={classes} onRequestSort={handleRequestSort}  order={order} orderBy={orderBy}/>
            </Table>
        </Paper>
    );

    function EnhancedTableHead(props) {
        const { classes, order, orderBy, onRequestSort } = props;

        const createSortHandler = property => event => {
            onRequestSort(event, property);
        };

        return (
            <TableHead>
                <TableRow>
                    <TableCell key='date' sortDirection={orderBy ===  'date' ? order : false}>
                        <TableSortLabel
                            active={orderBy === 'date'}
                            direction={order}
                            onClick={createSortHandler('date')}
                        >
                            {'Date'}
                            {orderBy === 'date' ? (
                                <span className={classes.visuallyHidden}>
                                {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                            </span>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                    <TableCell align={"right"} key='opponent' sortDirection={orderBy ===  'opponent' ? order : false}>
                        <TableSortLabel
                            active={orderBy === 'opponent'}
                            direction={order}
                            onClick={createSortHandler('opponent')}
                        >
                            {'Adversaire'}
                            {orderBy === 'opponent' ? (
                                <span className={classes.visuallyHidden}>
                                {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                            </span>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                    <TableCell align={"right"} key='teamFormation' sortDirection={orderBy ===  'teamFormation' ? order : false}>
                        <TableSortLabel
                            active={orderBy === 'teamFormation'}
                            direction={order}
                            onClick={createSortHandler('teamFormation')}
                        >
                            {'Notre dispositif'}
                            {orderBy === 'teamFormation' ? (
                                <span className={classes.visuallyHidden}>
                                {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                            </span>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                    <TableCell align={"right"} key='opponentFormation' sortDirection={orderBy ===  'opponentFormation' ? order : false}>
                        <TableSortLabel
                            active={orderBy === 'opponentFormation'}
                            direction={order}
                            onClick={createSortHandler('opponentFormation')}
                        >
                            {'Dispositif adversaire'}
                            {orderBy === 'opponentFormation' ? (
                                <span className={classes.visuallyHidden}>
                                {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                            </span>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                    <TableCell align={"right"}>Score</TableCell>
                </TableRow>
            </TableHead>
        );
    }

    EnhancedTableHead.propTypes = {
        classes: PropTypes.object.isRequired,
        onRequestSort: PropTypes.func.isRequired,
        order: PropTypes.oneOf(['asc', 'desc']).isRequired,
        orderBy: PropTypes.string.isRequired,
    };
};

export default TacticComparatorTable;