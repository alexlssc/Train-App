import React from 'react';
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import Paper from "@material-ui/core/Paper";
import {makeStyles} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from '@material-ui/icons/Delete';
import {Link} from "react-router-dom";
import EditIcon from "@material-ui/icons/Edit";
const useStyles = makeStyles({
    root: {
        width: '100%',
        overflowX: 'auto',
    },
    table: {
        minWidth: 650,
    },
});

const TacticsTable = props => {
  const classes = useStyles();

    function displaysRows(){
        if(typeof props.tactics != "undefined" && props.tactics !== 'Waiting'){
            const output = Object.entries(props.tactics).map(([key, tactic]) => (
                <TableRow key={key}>
                    <TableCell>{tactic['name']}</TableCell>
                    <TableCell align={'right'} style={{width: 50}}>
                        <Link
                            to={'tactics/' + key}
                        >
                            <IconButton aria-label="edit">
                                <EditIcon />
                            </IconButton>
                        </Link>
                    </TableCell>
                    <TableCell align={'right'} style={{width: 50}}>
                        <IconButton aria-label="delete" onClick={() => { if (window.confirm('Voulez-vous vraiment supprimer cette tactique?')) props.deleteTactic(key)}}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </TableCell>
                </TableRow>
            ));
            return output;
        }
    }
  return (
      <Paper className={classes.root}>
          <Table className={classes.table} aria-label="simple table">
              <TableHead>
                  <TableRow>
                      <TableCell>Nom</TableCell>
                  </TableRow>
              </TableHead>
              <TableBody>
                  {displaysRows()}
              </TableBody>
          </Table>
      </Paper>
  );
};

export default TacticsTable;