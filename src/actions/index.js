export const snackbarOn = (msg, category, date) => {
    return ({
        type: 'SNACKBAR_ON',
        msg: msg,
        category: category,
        date: date
    })
};

export const snackbarOff = () => {
    return ({
        type: 'SNACKBAR_OFF'
    })
};