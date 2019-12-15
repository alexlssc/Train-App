import { combineReducers } from 'redux';
import sessionReducer from './session';
import userReducer from './user';
import messageReducer from './message';
import snackbarReducer from "./snackbarReducer";
const rootReducer = combineReducers({
    sessionState: sessionReducer,
    userState: userReducer,
    messageState: messageReducer,
    snackbarState: snackbarReducer,
});
export default rootReducer;