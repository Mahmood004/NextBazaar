import { FETCH_FAV_ADS } from "../actions/types";

export default function (state = [], action) {
    switch (action.type) {
        case FETCH_FAV_ADS:
            return action.payload || false;
        default:
            return state;
    }
}