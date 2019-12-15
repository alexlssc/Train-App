const INITIAL_STATE = {
    status: null
};

const snackbarReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'SNACKBAR_ON':
            return Object.assign({}, state, {
                status: {
                    msg: action.msg,
                    category: action.category,
                    date: action.date
                }
            });
        case 'SNACKBAR_OFF':
            return Object.assign({}, state, {
                status: null
            });

        default:
            return state
    }
}

export default snackbarReducer;