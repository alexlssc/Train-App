import React from 'react'

export class MainPage extends React.Component{

    render() {
        return(
            <div>
                <h1>Main Page</h1>
                <h2>{process.env.REACT_APP_SECRET_VALUE}</h2>
            </div>
        )
    }
}