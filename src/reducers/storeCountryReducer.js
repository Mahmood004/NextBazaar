import { STORE_COUNTRY } from "../actions/types";

export default function (state = {}, action) {

    switch (action.type) {
        case STORE_COUNTRY:
            return action.payload;
        default: 
            return state;
    }
}