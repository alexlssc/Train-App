import React from 'react';
import PlayerTable from "./table";
import AddPlayer from "./addPlayer"

const MainContent = () => {
    return (
        <div>
            <PlayerTable />
            <AddPlayer />
        </div>
    );
}

export default MainContent;