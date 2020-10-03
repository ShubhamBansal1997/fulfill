import api from "../../utils/api";
import {ADD_FORM_WEBHOOK, ERROR_FETCHING_DATA_WEBHOOK, UPDATE_DATA_WEBHOOK, UPDATE_PAGE_WEBHOOK} from "./constants";

/**
 * Fetch the List of the Webhooks
 * @returns {function(...[*]=)}
 */
export const fetchWebhooks = () => {
    return (dispatch, getState) => {
        let {currentPage} = getState().webhookReducer;
        let url = `/api/webhook?page=${currentPage}`;
        api
            .get(url)
            .then((response) => {
                dispatch({
                    type: UPDATE_DATA_WEBHOOK,
                    payload: response
                });
            })
            .catch((err) => {
                dispatch({
                    type: ERROR_FETCHING_DATA_WEBHOOK,
                    payload: err
                });
            })
    }
}

/**
 * Change the page
 * @param page{number} page number
 * @returns {function(...[*]=)}
 */
export const updatePage = (page) => {
    return (dispatch) => {
        dispatch({
            type: UPDATE_PAGE_WEBHOOK,
            payload: page
        });
        dispatch(fetchWebhooks());
    }
}

/**
 * Update form form the product list
 * @param column {string}
 * @param value {value}
 * @returns {function(...[*]=)}
 */
export const updateForm = (column, value) => {
    return (dispatch, getState) => {
        let {event, target} = getState().webhookReducer;
        let data = {event, target}
        data[column] = value
        console.log(data)
        dispatch({
            type: ADD_FORM_WEBHOOK,
            payload: data
        });
    }
}