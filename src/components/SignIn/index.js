import React from 'react'
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes'


const INITIAL_STATE = {
    email: '',
    password: '',
    error: null,
};

const SignInPage = () => (
    <div>
        <SignInForm />
    </div>
);

class SignInFormBase extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            email: '',
            password: '',
            error: null
        }
    }

    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    onClick = event => {
        const { email, password } = this.state;
        this.props.firebase
            .doSignInWithEmailAndPassword(email, password)
            .then(() => {
                this.setState({ ...INITIAL_STATE });
                this.props.history.push(ROUTES.LANDING);
            })
            .catch(error => {
                this.setState({ error });
            });
        event.preventDefault();
    }

    render() {
        const isInvalid =
            this.state.username === '' ||
            this.state.password === '';

        return (
            <div>
                <MuiThemeProvider>
                    <div>
                        <AppBar title ='Login'/>
                            <TextField id="loginBar" name="email" hintText= "Enter your email" floatingLabelText="Email" style={styles.center} onChange={this.onChange}/>
                            <br/>
                            <TextField id="passwordBar" type="password" name="password" hintText="Enter your password" floatingLabelText="Password" style={styles.center} onChange={this.onChange}/>
                            <br/>
                            <RaisedButton disabled={isInvalid} id="LoginSubmitButton" label="Submit" primary={true} style={Object.assign({}, styles.center, styles.buttonStyle)} onClick={this.onClick}/>
                    </div>
                </MuiThemeProvider>
            </div>
        )
    }
}

const styles = {
    center: {
        display: 'block',
        margin: 'auto'
    },

    buttonStyle : {
        width: 200
    }
}

const SignInForm = compose(
    withRouter,
    withFirebase,
)(SignInFormBase);

export default SignInPage;

export { SignInForm };

