import {
    ADD_FORM_WEBHOOK,
    ERROR_FETCHING_DATA_WEBHOOK,
    FETCHING_DATA_WEBHOOK,
    UPDATE_DATA_WEBHOOK,
    UPDATE_PAGE_WEBHOOK,
} from './constants';


const INITIAL_STATE = {
    webhooks: [],
    totalWebhooks: 0,
    currentPage: 1,
    loading: true,
    event: '',
    target: '',
    error: null,
}

function webhookReducer(state = INITIAL_STATE, action) {
    switch (action.type) {
        case FETCHING_DATA_WEBHOOK:
            return {...state, webhooks: [], loading: true};
        case UPDATE_PAGE_WEBHOOK:
            return {...state, currentPage: action.payload, loading: true};
        case UPDATE_DATA_WEBHOOK:
            return {...state, webhooks: action.payload.results, totalWebhooks: action.payload.count, loading: false};
        case ERROR_FETCHING_DATA_WEBHOOK:
            return {...state, error: action.payload, loading: false};
        case ADD_FORM_WEBHOOK:
            return {...state, event: action.payload.event, target: action.payload.target};
        default:
            return state;
    }
}

export default webhookReducer;