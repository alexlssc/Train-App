import React from 'react';
import {makeStyles} from "@material-ui/styles";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import {Paper} from "material-ui";
import List from '@material-ui/core/List';
import * as POSITIONS from '../../../../../constants/positions'
import ListItem from '@material-ui/core/ListItem';
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/core/SvgIcon/SvgIcon";

const useStyles = makeStyles(theme => ({
    root: {
        width: '35%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 7
    },
    logo: {
        width: 100,
    },
    form: {
        width: '100%'
    },
    select: {
        width: '100%'
    },
    list: {
        alignSelf: 'end'
    }

}));

const TeamTacticDisplay = props => {
    const { allTactics, opponentCard , handleChangeSelectedTactic, targetTeam, targetTeamSelectedTactic,} = props;
    const classes = useStyles();

    const getMenuContent = () => {
        if(allTactics != null){
           return Object.entries(allTactics).map(([key, tacticObject]) => (
               <MenuItem key={key} value={key}>{tacticObject.name}</MenuItem>
           ))
        }
    };

    const getListContent = () => {
        if(targetTeamSelectedTactic != null){
            return (
                POSITIONS.POSITION.map(position => (
                    Object.entries(allTactics[targetTeamSelectedTactic].positions).map(([objectPosition, nb]) => {
                        if(position === objectPosition){
                            return listRow(objectPosition, nb);
                        }
                    })
                ))
            )
        }
    };

    const listRow = (position, nb) => {
        const output = [];
        for (var i = 0; i < nb; i++){
            output.push(
                <ListItem>{position}</ListItem>
            )
        }
        return output;
    };

    return (
        <Paper className={classes.root}>
            <img className={classes.logo} src={targetTeam.logo} alt="Team Logo"/>
            <h2>{targetTeam.name}</h2>
            <FormControl variant="outlined" className={classes.form}>
                <InputLabel id="demo-simple-select-outlined-label">
                    Choisir la formation
                </InputLabel>
                <Select
                    labelId="demo-simple-select-outlined-label"
                    id="playerList"
                    value={targetTeamSelectedTactic != null ? targetTeamSelectedTactic : ''}
                    className={classes.select}
                    onChange={e => handleChangeSelectedTactic(e, opponentCard)}
                >
                    {getMenuContent()}
                </Select>
            </FormControl>
            <List className={classes.list}>
                {getListContent()}
            </List>
        </Paper>
    )
};

export default TeamTacticDisplay;