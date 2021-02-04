import { combineReducers } from 'redux';

import authStateReducer from './authStateReducer';
import fetchCategoriesReducer from './fetchCategoriesReducer';
import fetchCountriesReducer from './fetchCountriesReducer';
import fetchAdsReducer from './fetchAdsReducer';
import fetchCitiesReducer from './fetchCitiesReducer';
import fetchCustomFieldsReducer from './fetchCustomFieldsReducer';
import storeCountryReducer from './storeCountryReducer';
import fetchAuthUserReducer from './fetchAuthUserReducer';
import fetchFavAdsReducer from './fetchFavAdsReducer';

export default combineReducers({
    authState: authStateReducer,
    categories: fetchCategoriesReducer,
    countries: fetchCountriesReducer,
    ads: fetchAdsReducer,
    cities: fetchCitiesReducer,
    customFields: fetchCustomFieldsReducer,
    country: storeCountryReducer,
    authUser: fetchAuthUserReducer,
    favAds: fetchFavAdsReducer
});