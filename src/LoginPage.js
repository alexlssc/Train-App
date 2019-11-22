import React from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';


export class LoginPage extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            username: '',
            password: ''
        }
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
                            <TextField id="loginBar" hintText= "Enter your username" floatingLabelText="Username" style={styles.center} onChange={
                                (event, newValue) => this.setState({username: newValue})
                            }/>
                            <br/>
                            <TextField id="passwordBar" hintText="Enter your password" floatingLabelText="Password" style={styles.center} onChange={
                                (event, newValue) => this.setState({password: newValue})
                            }/>
                            <br/>
                            <RaisedButton disabled={isInvalid} id="LoginSubmitButton" label="Submit" primary={true} style={Object.assign({}, styles.center, styles.buttonStyle)}/>
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

