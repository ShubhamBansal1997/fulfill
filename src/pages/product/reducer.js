import {
    ADD_FILTER,
    DELETE_ALL,
    ERROR_FETCHING_DATA,
    FETCHING_DATA,
    UPDATE_DATA,
    UPDATE_ORDER,
    UPDATE_PAGE,
    UPDATE_SEARCH
} from './constants';


const INITIAL_STATE = {
    products: [],
    totalProducts: 0,
    currentPage: 1,
    loading: true,
    sku: '',
    description: '',
    name: '',
    orderCol: 'sku',
    orderType: 'desc',
    error: null,
    search: ''
}

function productReducer(state = INITIAL_STATE, action) {
    switch (action.type) {
        case FETCHING_DATA:
            return {...state, products: [], loading: true};
        case UPDATE_PAGE:
            return {...state, currentPage: action.payload, loading: true};
        case ADD_FILTER:
            return {
                ...state,
                sku: action.payload.sku,
                description: action.payload.description,
                name: action.payload.name,
                loading: true,
                currentPage: 1
            };
        case UPDATE_ORDER:
            return {
                ...state,
                orderCol: action.payload.orderCol,
                orderType: action.payload.orderType,
                loading: true,
                currentPage: 1
            };
        case UPDATE_DATA:
            return {...state, products: action.payload.results, totalProducts: action.payload.count, loading: false};
        case ERROR_FETCHING_DATA:
            return {...state, error: action.payload, loading: false};
        case UPDATE_SEARCH:
            return {...state, search: action.payload, loading: true, currentPage: 1};
        case DELETE_ALL:
            return {...state, sku: '', name: '', description: '', currentPage: 1, loading: true, search: ''};
        default:
            return state;
    }
}

export default productReducer;