import {applyMiddleware, compose, createStore} from "redux";
import thunk from "redux-thunk";
import rootReducer from './reducers';

const store = createStore(
    rootReducer,
    compose(
        applyMiddleware(thunk),
        window.devToolsExtension ? window.devToolsExtension() : f => f
    )
);

export default store;