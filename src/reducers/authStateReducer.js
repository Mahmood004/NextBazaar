import { AUTH_STATE } from "../actions/types";

export default function (state = {}, action) {
    switch (action.type) {
        case AUTH_STATE:
            return action.payload || false;
        default:
            return state;
    }
}