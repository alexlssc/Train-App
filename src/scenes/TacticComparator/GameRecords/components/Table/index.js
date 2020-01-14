import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import TableBody from '@material-ui/core/TableBody';
import Paper from '@material-ui/core/Paper';
import PropTypes from 'prop-types';
import Table from '@material-ui/core/Table';
import { Link } from 'react-router-dom';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import ColouredScore from '../../../../../components/ColouredScore';

const useStyles = makeStyles({
  root: {
    width: '100%',
    overflowX: 'auto',
  },
  table: {
    minWidth: 650,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
});

const TacticComparatorTable = props => {
  const classes = useStyles();
  const { gameRecords, deleteHandler, allTactics } = props;
  const [order, setOrder] = React.useState('desc');
  const [orderBy, setOrderBy] = React.useState('date');

  const handleRequestSort = (event, property) => {
    const isDesc = orderBy === property && order === 'desc';
    setOrder(isDesc ? 'asc' : 'desc');
    setOrderBy(property);
  };

    // Format date to dd/MM/yyyy
    function rightFormatDate(oldDate){
        try{
            const dateParts = oldDate.split('/');
            return new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
        } catch (e) {
            return null
        }
    }

  const displayRows = () => {
    if (gameRecords != null && allTactics != null) {
      const output = Object.entries(gameRecords)
          .sort((a, b) => {
              if(order === 'asc'){
                  if(orderBy === 'opponent'){
                      return a[1][orderBy]['name'].localeCompare(b[1][orderBy]['name'])
                  }
                  else if (orderBy === 'ownTactic' || orderBy === 'opponentTactic'){
                      return allTactics[a[1][orderBy]]['name'].localeCompare(allTactics[b[1][orderBy]]['name'])
                  }
                  else {
                      return new Date(rightFormatDate(a[1][orderBy])) - new Date(rightFormatDate(b[1][orderBy]));
                  }
              } else {
                  if(orderBy === 'opponent'){
                      return b[1][orderBy]['name'].localeCompare(a[1][orderBy]['name'])
                  }
                  else if (orderBy === 'ownTactic' || orderBy === 'opponentTactic'){
                      return allTactics[b[1][orderBy]]['name'].localeCompare(allTactics[a[1][orderBy]]['name'])
                  }
                  else {
                      return new Date(rightFormatDate(b[1][orderBy])) - new Date(rightFormatDate(a[1][orderBy]));
                  }
              }
          })
          .map(([key, object]) => (
        <TableRow key={key}>
          <TableCell>{object.date}</TableCell>
          <TableCell align={'right'}>
            {object.opponent != null ? object.opponent.name : 'NaN'}
          </TableCell>
          <TableCell align={'right'}>
            {allTactics[object.ownTactic] != null
              ? allTactics[object.ownTactic].name
              : 'NaN'}
          </TableCell>
          <TableCell align={'right'}>
            {allTactics[object.opponentTactic] != null
              ? allTactics[object.opponentTactic].name
              : 'NaN'}
          </TableCell>
          <TableCell align={'right'}>
            <ColouredScore
              goalScored={object.goalScored}
              goalConceded={object.goalConceded}
            />
          </TableCell>
          <TableCell align={'right'} style={{ width: 50 }}>
            <Link to={'/new-game-record/' + key}>
              <IconButton aria-label="edit">
                <EditIcon />
              </IconButton>
            </Link>
          </TableCell>
          <TableCell align={'right'} style={{ width: 50 }}>
            <IconButton
              aria-label="delete"
              onClick={() => {
                if (window.confirm('Voulez-vous vraiment supprimer ce match?'))
                  deleteHandler(key);
              }}
            >
              <DeleteIcon />
            </IconButton>
          </TableCell>
        </TableRow>
      ));
      return output;
    }
  };

  return (
    <Paper>
      <Table className={classes.table} aria-label="tactic comparator table">
        <EnhancedTableHead
          classes={classes}
          onRequestSort={handleRequestSort}
          order={order}
          orderBy={orderBy}
        />
        <TableBody>{displayRows()}</TableBody>
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
          <TableCell
            key="date"
            sortDirection={orderBy === 'date' ? order : false}
          >
            <TableSortLabel
              active={orderBy === 'date'}
              direction={order}
              onClick={createSortHandler('date')}
            >
              {'Date'}
              {orderBy === 'date' ? (
                <span className={classes.visuallyHidden}>
                  {order === 'date' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
          <TableCell
            align={'right'}
            key="opponent"
            sortDirection={orderBy === 'opponent' ? order : false}
          >
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
          <TableCell
            align={'right'}
            key="ownTactic"
            sortDirection={orderBy === 'ownTactic' ? order : false}
          >
            <TableSortLabel
              active={orderBy === 'ownTactic'}
              direction={order}
              onClick={createSortHandler('ownTactic')}
            >
              {'Notre dispositif'}
              {orderBy === 'ownTactic' ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
          <TableCell
            align={'right'}
            key="opponentTactic"
            sortDirection={orderBy === 'opponentTactic' ? order : false}
          >
            <TableSortLabel
              active={orderBy === 'opponentTactic'}
              direction={order}
              onClick={createSortHandler('opponentTactic')}
            >
              {'Dispositif adversaire'}
              {orderBy === 'opponentTactic' ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
          <TableCell align={'right'}>Score</TableCell>
        </TableRow>
      </TableHead>
    );
  }
};

TacticComparatorTable.propTypes = {
  gameRecord: PropTypes.object.isRequired,
};

export default TacticComparatorTable;
