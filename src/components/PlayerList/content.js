import React from 'react';
import PlayerTable from "./table";
import AddPlayer from "./addPlayer"

class MainContent extends React.Component{

    render() {
        return (
            <div>
                <PlayerTable />
                <AddPlayer />
            </div>
        );
    }
}

export default MainContent;