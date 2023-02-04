import React from "react";
import './styles.css';
import { NotificationProvider } from "web3uikit";
import { MoralisProvider } from "react-moralis";
import Game from "./components/Game";

const App = () => {
    return (
        <MoralisProvider initializeOnMount={false}>
            <NotificationProvider>
                <div className="App">
                    <Game rows={20} columns={10} />
                </div>
            </NotificationProvider>
        </MoralisProvider>
    );
}

export default App;