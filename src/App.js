import React, {Component} from 'react';
import store from "./store";
import {Provider} from "react-redux";
import Routes from "./routes";

class App extends Component {
    render() {
        return (
            <div>
                <Provider store={store}>
                    <Routes/>
                </Provider>
            </div>
        )
    }

}

export default App;
