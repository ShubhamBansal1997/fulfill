import api from "../../utils/api";
import {
    ADD_FILTER,
    DELETE_ALL,
    ERROR_FETCHING_DATA,
    UPDATE_DATA,
    UPDATE_ORDER,
    UPDATE_PAGE,
    UPDATE_SEARCH
} from "./constants";

/**
 * Fetch the List of the Products
 * @returns {function(...[*]=)}
 */
export const fetchProducts = () => {
    return (dispatch, getState) => {
        let {currentPage, sku, name, description, orderCol, orderType, search} = getState().productReducer;
        let url = `/api/product?page=${currentPage}&ordering=${orderType !== 'asc' ? '-' : ''}${orderCol}`;
        if (sku !== '' && sku !== null) {
            url = url + `&sku=${sku}`
        }
        if (name !== '' && name !== null) {
            url = url + `&name=${name}`
        }
        if (description !== '' && description !== null) {
            url = url + `&description=${description}`
        }
        if (search !== '' && search !== null) {
            url = url + `&search=${search}`
        }
        api
            .get(url)
            .then((response) => {
                dispatch({
                    type: UPDATE_DATA,
                    payload: response
                });
            })
            .catch((err) => {
                dispatch({
                    type: ERROR_FETCHING_DATA,
                    payload: err
                });
            })
    }
}

/**
 * Update the order of the product list
 * @param orderVal {string} which fields needs to be ordered
 * @returns {function(...[*]=)}
 */
export const updateOrder = (orderVal) => {
    return (dispatch, getState) => {
        let {orderCol, orderType} = getState().productReducer;
        orderType = orderCol === orderVal ? (orderType === 'desc' ? 'asc' : 'desc') : 'desc';
        let payload = {'orderCol': orderVal, orderType};
        dispatch({
            type: UPDATE_ORDER,
            payload: payload
        });
        dispatch(fetchProducts());
    }
}

/**
 * Add filter to the product list
 * @param column {string} filter column
 * @param value {value} filter value
 * @returns {function(...[*]=)}
 */
export const updateFilter = (column, value) => {
    return (dispatch, getState) => {
        let {sku, name, description} = getState().productReducer;
        let data = {sku, name, description}
        data[column] = value
        dispatch({
            type: ADD_FILTER,
            payload: data
        });
        dispatch(fetchProducts());
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
            type: UPDATE_PAGE,
            payload: page
        });
        dispatch(fetchProducts());
    }
}

/**
 * Product to delete
 * @param productId{string} pk of the product to delete
 * @returns {function(...[*]=)}
 */
export const deleteProduct = (productId) => {
    return (dispatch) => {
        let url = `/api/product/${productId}`
        api
            .del(url)
            .then((response) => {
                dispatch(fetchProducts());
            })
            .catch((err) => {
                console.log(err);
            })
    }
}

/**
 * Search in the product list
 * @param search{string} search keyword
 * @returns {function(...[*]=)}
 */
export const updateSearch = (search) => {
    return (dispatch) => {
        dispatch({
            type: UPDATE_SEARCH,
            payload: search
        });
        dispatch(fetchProducts());
    }
}

/**
 * Delete All Products
 * @returns {function(...[*]=)}
 */
export const deleteAll = () => {
    return (dispatch) => {
        api
            .del('/api/product/deleteall')
            .then(_ => {
                dispatch({type: DELETE_ALL});
                dispatch(fetchProducts());
            })
            .catch(err => console.log(err))

    }
}