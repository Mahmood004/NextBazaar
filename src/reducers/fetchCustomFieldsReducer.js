import { FETCH_CUSTOM_FIELDS } from "../actions/types";

export default function (state = [], action) {
    switch (action.type) {
        case FETCH_CUSTOM_FIELDS:
            return action.payload || false;
        default:
            return state;
    }
}