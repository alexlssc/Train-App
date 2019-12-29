import React from 'react';
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import {makeStyles} from "@material-ui/core";
import * as POSITIONS from '../../../constants/positions';
import ColouredNumber from "../../ColouredNumber";

const useStyles = makeStyles({
    root: {
        width: '100%',
        overflowX: 'auto',
    },
    table: {
        minWidth: 650,
        marginTop: 15,
    },
    playerCell: {
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center'
    }
});

const TableBestEleven = props => {
    const classes = useStyles();
    const {selectedTactic, allThreeBest, allPlayers, allAvgPerformance} = props;

    const displayRows = () => {
        let output = [];
      if(selectedTactic !== null && allThreeBest !== null){
          for(let [index, wantedPosition] of POSITIONS.POSITION.entries()){
              for(let [position, nb] of Object.entries(selectedTactic.positions)){
                  if(wantedPosition === position){
                      for(let i = 0; i < nb; i++){
                          output.push(
                              <TableRow key={`${position}-${i}`}>
                                  <TableCell>{position}</TableCell>
                                  {displayPlayerRows(allThreeBest[index])}
                              </TableRow>
                          )
                      }
                  }
              }
          }
          return output;
      }
    };

    const displayPlayerRows = arrayOfPlayers => {
        const output = [];
        for(let playerId of arrayOfPlayers){
            try{
                output.push(
                    <TableCell align={"right"}>
                        <div className={classes.playerCell}>
                            <p style={{marginRight: 20}} >{`${allPlayers[playerId].lastName} ${allPlayers[playerId].firstName}`}</p>
                            <ColouredNumber performance={allAvgPerformance[playerId]}/>
                        </div>
                    </TableCell>
                )
            } catch (e) {
                output.push(
                    <TableCell align={"right"}>
                        <div className={classes.playerCell}>
                            <p style={{marginRight: 20}}>NaN</p>
                            <ColouredNumber performance={0}/>
                        </div>
                    </TableCell>
                )
                console.log('Index empty')
            }
        }
        return output;

    }

    return(
        <Paper>
            <Table className={classes.table} aria-label="table-best-eleven">
                <TableHead>
                    <TableRow>
                        <TableCell>Position</TableCell>
                        <TableCell align={'right'}>1er Choix</TableCell>
                        <TableCell align={'right'}>2ème Choix</TableCell>
                        <TableCell align={'right'}>3ème Choix</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {displayRows()}
                </TableBody>
            </Table>
        </Paper>
    )
};

export default TableBestEleven;