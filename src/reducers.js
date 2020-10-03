import {combineReducers} from "redux";
import productReducer from "./pages/product/reducer";
import webhookReducer from "./pages/webhook/reducer";

const rootReducer = combineReducers({
    productReducer,
    webhookReducer
});

export default rootReducer;