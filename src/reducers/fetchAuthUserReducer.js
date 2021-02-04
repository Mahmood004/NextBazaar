import { FETCH_AUTH_USER } from "../actions/types";

export default function (state = {}, action) {
    switch (action.type) {
        case FETCH_AUTH_USER:
            return action.payload || false;
        default:
            return state;
    }
}