import {combineReducers} from "redux";
import productReducer from "./pages/product/reducer";

const rootReducer = combineReducers({
    productReducer
});

export default rootReducer;