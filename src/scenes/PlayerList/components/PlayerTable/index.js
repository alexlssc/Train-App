import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import PropTypes from 'prop-types';

const useStyles = makeStyles({
  root: {
    width: '100%',
    overflowX: 'auto',
  },
  table: {
    minWidth: 650,
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
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

function EnhancedTableHead(props) {
  const { classes, order, orderBy, onRequestSort } = props;

  const createSortHandler = property => event => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell
          key="lastName"
          sortDirection={orderBy === 'lastName' ? order : false}
        >
          <TableSortLabel
            active={orderBy === 'lastName'}
            direction={order}
            onClick={createSortHandler('lastName')}
          >
            {'Nom'}
            {orderBy === 'lastName' ? (
              <span className={classes.visuallyHidden}>
                {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
              </span>
            ) : null}
          </TableSortLabel>
        </TableCell>
        <TableCell
          key="firstName"
          sortDirection={orderBy === 'firstName' ? order : false}
          align={'right'}
        >
          <TableSortLabel
            active={orderBy === 'firstName'}
            direction={order}
            onClick={createSortHandler('firstName')}
          >
            {'Prénom'}
            {orderBy === 'firstName' ? (
              <span className={classes.visuallyHidden}>
                {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
              </span>
            ) : null}
          </TableSortLabel>
        </TableCell>
        <TableCell
          key="dob"
          sortDirection={orderBy === 'dob' ? order : false}
          align={'right'}
        >
          <TableSortLabel
            active={orderBy === 'dob'}
            direction={order}
            onClick={createSortHandler('dob')}
          >
            {'Age'}
            {orderBy === 'firstName' ? (
              <span className={classes.visuallyHidden}>
                {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
              </span>
            ) : null}
          </TableSortLabel>
        </TableCell>
        <TableCell key="positions" align={'right'}>
          Positions
        </TableCell>
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

const PlayerTable = props => {
  const { listPlayers, handleOpen, handleRemovePlayer } = props;

  const classes = useStyles();
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('lastName');

  const handleRequestSort = (event, property) => {
    const isDesc = orderBy === property && order === 'desc';
    setOrder(isDesc ? 'asc' : 'desc');
    setOrderBy(property);
  };

  function _calculateAge(birthday) {
    const dateParts = birthday.split('/');
    const birthdayObject = new Date(
      +dateParts[2],
      dateParts[1] - 1,
      +dateParts[0],
    );
    const ageDifMs = Date.now() - birthdayObject.getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970).toString();
  }

  return (
    <div>
      <Paper className={classes.root}>
        <Table className={classes.table} aria-label="simple table">
          <EnhancedTableHead
            classes={classes}
            onRequestSort={handleRequestSort}
            order={order}
            orderBy={orderBy}
          />
          <TableBody>
            {Object.entries(listPlayers.player)
              .sort((a, b) => {
                if (order === 'asc') {
                  if (orderBy !== 'dob') {
                    return a[1][orderBy].localeCompare(b[1][orderBy]);
                  } else {
                    return (
                      _calculateAge(a[1][orderBy]) -
                      _calculateAge(b[1][orderBy])
                    );
                  }
                } else {
                  if (orderBy !== 'dob') {
                    return b[1][orderBy].localeCompare(a[1][orderBy]);
                  } else {
                    return (
                      _calculateAge(b[1][orderBy]) -
                      _calculateAge(a[1][orderBy])
                    );
                  }
                }
              })
              .map(([key, playerObject]) => (
                <TableRow key={key}>
                  <TableCell>{playerObject['lastName']}</TableCell>
                  <TableCell align="right">
                    {playerObject['firstName']}
                  </TableCell>
                  <TableCell align="right">
                    {_calculateAge(playerObject['dob'])}
                  </TableCell>
                  <TableCell align="right" style={{ whiteSpace: 'pre' }}>
                    {playerObject['positions'].map(position => position + '\n')}
                  </TableCell>
                  <TableCell style={{ width: '25%' }}>
                    <div className={classes.buttonContainer}>
                      <Button
                        variant="contained"
                        color="primary"
                        className={classes.button}
                        startIcon={<EditIcon />}
                        size="small"
                        onClick={() => handleOpen(playerObject, key)}
                      >
                        Editer
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        className={classes.button}
                        startIcon={<DeleteIcon />}
                        size="small"
                        onClick={() => {
                          if (
                            window.confirm(
                              'Voulez-vous vraiment supprimer ce joueur?',
                            )
                          )
                            handleRemovePlayer(key);
                        }}
                      >
                        Effacer
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </Paper>
    </div>
  );
};

export default PlayerTable;
