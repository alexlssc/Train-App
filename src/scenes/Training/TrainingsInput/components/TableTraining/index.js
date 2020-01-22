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
import * as RATINGS from '../../../../../constants/ratings';
import chroma from 'chroma-js';

const TableTraining = props => {

    const dot = (color = '#ccc') => ({
        alignItems: 'center',
        display: 'flex',

        ':before': {
            backgroundColor: color,
            borderRadius: 10,
            content: '" "',
            display: 'block',
            marginRight: 8,
            height: 10,
            width: 10,
        },
    });

    const colourStyles = {
        control: styles => ({ ...styles, backgroundColor: 'white' }),
        option: (styles, { data, isDisabled, isFocused, isSelected }) => {
            const color = chroma(data.color);
            return {
                ...styles,
                ...dot(data.color)
                // backgroundColor: isDisabled
                //     ? null
                //     : isSelected
                //         ? data.color
                //         : isFocused
                //             ? color.alpha(0.1).css()
                //             : null,
                // color: isDisabled
                //     ? '#ccc'
                //     : isSelected
                //         ? chroma.contrast(color, 'white') > 2
                //             ? 'white'
                //             : 'black'
                //         : data.color,
                // cursor: isDisabled ? 'not-allowed' : 'default',
                //
                // ':active': {
                //     ...styles[':active'],
                //     backgroundColor: !isDisabled && (isSelected ? data.color : color.alpha(0.3).css()),
                // },
            };
        },
        input: styles => ({ ...styles, ...dot() }),
        placeholder: styles => ({ ...styles, ...dot() }),
        singleValue: (styles, { data }) => ({ ...styles, ...dot(data.color) }),
    };

    function displayAttendeesRows(){
        if(typeof props.playerAttendees != "undefined" && props.playerAttendees !== 'Waiting'){
            const output = Object.entries(props.playerAttendees).map(([key, playerObject]) => (
                <TableRow key={key}>
                    <TableCell>{playerObject["lastName"] + ' ' + playerObject["firstName"]}</TableCell>
                    <TableCell align={'right'}>
                        <Select
                            defaultValue={RATINGS.RATINGS[playerObject['performance'] - 1]}
                            value={RATINGS.RATINGS[playerObject['performance'] - 1]}
                            label="Single select"
                            options={
                                RATINGS.RATINGS.map(rating => (
                                    rating
                                ))
                            }
                            onChange={value => props.updatePlayerAttendee(key, value)}
                            styles={colourStyles}
                        />
                    </TableCell>
                    <TableCell align={'right'} style={{width: 50}}>
                        <IconButton aria-label="delete" onClick={() => props.deletePlayerAttendee(key)} >
                            <DeleteIcon />
                        </IconButton>
                    </TableCell>
                </TableRow>
            ));
            return output;
        }
    }

    return (
        <Paper>
            <Table>
                <TableHead>
                    <TableCell>Nom</TableCell>
                    <TableCell align={'right'}>Performance</TableCell>
                </TableHead>
                <TableBody>
                    {displayAttendeesRows()}
                </TableBody>
            </Table>
        </Paper>
    );
};

export default TableTraining;