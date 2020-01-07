import React from 'react';
import PropTypes from 'prop-types';
import {KeyboardDatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import {Button} from "@material-ui/core";
import AddCircleIcon from '@material-ui/icons/AddCircle';
import {makeStyles} from "@material-ui/styles";

const useStyles = makeStyles(theme => ({
    dateContainer:{
        display: 'flex',
        alignItems: 'center'
    },
    buttonDate:{
        marginLeft: 20
    },
}))
const DatePicker = props => {
    const { datePickerPropsValue, datePickerOnChange, datePickerOnClick } = props;
    const classes = useStyles();
    const datePickerValue = datePickerPropsValue != null ? datePickerPropsValue : new Date();

    // Format date to dd/MM/yyyy
    function rightFormatDate(oldDate){
        try{
            const dateParts = oldDate.split('/');
            return new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
        } catch (e) {
            return null
        }
    }

    return (
        <div className={classes.dateContainer}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                    disableToolbar
                    variant="inline"
                    format="dd/MM/yyyy"
                    margin="normal"
                    id="date-picker-inline"
                    label="Changer la date"
                    value={rightFormatDate(datePickerValue)}
                    KeyboardButtonProps={{
                        'aria-label': 'change date',
                    }}
                    onChange={date => datePickerOnChange(date)}
                    autoOk={true}
                />
            </MuiPickersUtilsProvider>
            <Button
                variant="contained"
                color="primary"
                startIcon={<AddCircleIcon/>}
                className={classes.buttonDate}
                //
                onClick={() => datePickerOnClick()}
            >
                Changer date
            </Button>
        </div>
    );
};


export default DatePicker;