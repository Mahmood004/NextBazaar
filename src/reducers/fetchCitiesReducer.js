import { FETCH_CITIES } from "../actions/types";

export default function (state = [], action) {
    switch (action.type) {
        case FETCH_CITIES: 
            return action.payload || false;
        default:
            return state;
    }
}