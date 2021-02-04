import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { AUTH_STATE, FETCH_CITIES, FETCH_CUSTOM_FIELDS, STORE_COUNTRY, FETCH_CATEGORIES, FETCH_ADS, FETCH_AUTH_USER, FETCH_FAV_ADS, FETCH_COUNTRIES } from './types';
import config from '../utils/development.json';
const apiBaseUrl = `${config.baseUrl}/api`;


export const checkTokenExpiration = () => {
    let flag = true;
    if (jwtDecode(localStorage.getItem('token')).exp < Date.now() / 1000) {
        localStorage.removeItem('token');
        flag = false;
        return flag;
    }
    return flag;
}

export const fakeAuthCentralState = {
    isAuthenticated: localStorage.getItem('token') && checkTokenExpiration() ? true : false,
}

export const authenticate = () => dispatch =>  {
    dispatch({ type: AUTH_STATE, payload: { auth: fakeAuthCentralState.isAuthenticated }})
}

export const signout = () => dispatch => {
    dispatch({ type: AUTH_STATE, payload: { auth: fakeAuthCentralState.isAuthenticated }})
}

export const signup = data => {
    console.log('data', data);
    return axios.post(apiBaseUrl + '/register', data)
            .then(res => res)
            .catch(err => err);
}

export const login = data => {
    console.log('data', data);
    return axios.post(apiBaseUrl + '/login', data)
            .then(res => res)
            .catch(err => err.response.data);
}

export const getAuthUser = token => dispatch => {
    return axios.get(apiBaseUrl + '/user', { headers: { 'Authorization': `Bearer ${token}` } })
            .then(res => dispatch({ type: FETCH_AUTH_USER, payload: res.data.user }))
            .catch(err => err);
} 

export const getCategoriesWithSubCategories = () => {
    
    return axios.get(apiBaseUrl + '/categories/list')
            .then(res => {
                console.log(res);
                return res;
            });
}


export const getCategories = () => dispatch => {

    return axios.get(apiBaseUrl + '/categories')
            .then(res => {
                // console.log('categories', res);
                dispatch({ type: FETCH_CATEGORIES, payload: res.data.data })
            });

}

export const getSubCategoriesByCategoryId = categoryId => {

    return axios.get(apiBaseUrl + '/subcategories/' + categoryId)
            .then(res => {
                // console.log('sub categories', res);
                return res;
            })
}

export const getAds = () => dispatch => {

    return axios.get(apiBaseUrl + '/ads')
            .then(res => {
                console.log('ads', res);
                dispatch({ type: FETCH_ADS , payload: res.data.data });
            });

}

export const postAd = data => {

    return axios
        .post(apiBaseUrl + '/ads', data)
        .then(newAd => {
            return newAd;
        })
        .catch(err => {
            console.log(err.message);
            return err;
        });

}

export const fetchCountries = () => dispatch => {

    return axios.get(apiBaseUrl + '/countries').then(res => dispatch({ type: FETCH_COUNTRIES, payload: res.data.data }));

}

export const storeCountry = data => dispatch => dispatch({ type: STORE_COUNTRY, payload: data });

export const fetchCitiesByCountryCode = countryCode => dispatch => {

    return axios.get(apiBaseUrl + '/city/' + countryCode)
            .then(res => dispatch({ type: FETCH_CITIES, payload: res.data.data }));
    
}

export const filterCitiesByCountryCode = countryCode => {

    return axios.get(apiBaseUrl + '/city/' + countryCode)
            .then(res => {
                console.log(res);
                return res;
            })
            .catch(err => {
                console.log(err);
                return err;
            });
}

export const getCustomFieldsByCategoryId = categoryId => dispatch => {
    return axios.get(apiBaseUrl + '/category_custom_fields/' + categoryId)
            .then(res => dispatch({ type: FETCH_CUSTOM_FIELDS, payload: res.data }));

}

export const searchAds = data => {
    return axios.post(apiBaseUrl + '/ads/search', data)
            .then(res => {
                console.log(res);
                return res;
            })
            .catch(err => {
                console.log(err);
                return err;
            })
}

export const searchAds2 = data => dispatch => {
    return axios.post(apiBaseUrl + '/ads/search', data)
            .then(res => {
                console.log(res);
                return dispatch({ type: FETCH_ADS, payload: res.data.data })
            })
            .catch(err => {
                console.log(err);
                return err;
            })
}

export const addToFavourite = (token, data) => {

    return axios.post(apiBaseUrl + '/account/ad_to_favourite', data, { headers: { 'Authorization': `Bearer ${token}` }})
            .then(res => {
                console.log(res);
                return res;
            })
            .catch(err => err);
}

export const getFavouriteAds = (token, data) => dispatch => {

    return axios.post(apiBaseUrl + '/account/favourites', data, { headers: { 'Authorization': `Bearer ${token}` }})
            .then(res => {
                console.log(res);
                dispatch({ type: FETCH_FAV_ADS, payload: res.data });
            })
            .catch(err => err);
}

export const viewAd = (token, adId) => {

    return axios.get(apiBaseUrl + '/ads/' + adId, { headers: { 'Authorization': `Bearer ${token}` }})
            .then(res => {
                console.log(res);
                return res;
            })
            .catch(err => {
                console.log(err);
                return err;
            });
}

export const updateAd = (token, adId, ad) => {
    return axios.put(apiBaseUrl + '/ads/' + adId, ad, { headers: { 'Authorization': `Bearer ${token}` }})
            .then(res => {
                console.log(res);
                return res;
            })
            .catch(err => {
                console.log(err);
                return err;
            })
}
 
export const deleteSingleAd = (token, adId) => {
    return axios.get(apiBaseUrl + '/account/' + adId + '/delete', { headers: { 'Authorization': `Bearer ${token}` }})
            .then(res => {
                console.log(res);
                return res;
            })
            .catch(err => {
                console.log(err);
                return err;
            });
}

export const deleteMultipleAds = (token, remove_ads) => {
    return axios.post(apiBaseUrl + '/account/delete', { remove_ads }, { headers: { 'Authorization': `Bearer ${token}` }})
            .then(res => {
                console.log(res);
                return res;
            })
            .catch(err => {
                console.log(err);
                return err;
            });
}

export const getGenderOptions = token => {
    return axios.get(apiBaseUrl + '/user/gender', { headers: { 'Authorization': `Bearer ${token}` }})
            .then(res => {
                console.log(res);
                return res;
            })
            .catch(err => {
                console.log(err);
                return err;
            })
}

export const updateUser = (token, user) => {
    return axios.post(apiBaseUrl + '/user/update', user, { headers: { 'Authorization': `Bearer ${token}` }})
            .then(res => {
                console.log(res);
                return res;
            })
            .catch(err => {
                console.log(err);
                return err;
            })
}

export const updateProfileAvatar = (token, profile_pic) => {
    return axios.post(apiBaseUrl + '/user/avatar', { token, profile_pic })
            .then(res => {
                console.log(res);
                return res;
            })
            .catch(err => {
                console.log(err);
                return err;
            })
}

export const recoverPassword = obj => {
    return axios.post(apiBaseUrl + '/recover/', obj)
            .then(res => {
                console.log(res);
                return res;
            })
            .catch(err => {
                console.log(err);
                return err;
            })
}

