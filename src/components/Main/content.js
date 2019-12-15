import React from 'react';
import { useSelector, useDispatch } from "react-redux";
import {snackbarOn, snackbarOff} from "../../actions";
import CustomisedSnackBar from "../SnackBarContent";

const DashboardContent  = () => {
    const dispatch = useDispatch();
    const snackbarState = useSelector(state => state.snackbarState);
    return (
        <div>
            <h1>This is the dashboard</h1>
            <button onClick={() => dispatch(snackbarOn('Hello', 'warning', Date.now()))}>Change state</button>
            {snackbarState.status ? <CustomisedSnackBar variant={snackbarState.status.category} open={snackbarState.status !== null} onClose={() => dispatch(snackbarOff())} message={snackbarState.status.msg} /> : null}
        </div>
    )
};

export default DashboardContent;