import React, { Component } from 'react';
import { Slider, Checkbox } from 'antd';
import './AdSearching.css';
import TopSearchBar from '../../searchBar/TopSearchBar';
import DepartmentSearchBar from '../../searchBar/DepartmentSearchBar';
import { fakeAuthCentralState, getCategoriesWithSubCategories, getAds, getFavouriteAds, addToFavourite, filterCitiesByCountryCode, searchAds2 } from '../../../actions';
import { getName } from 'country-list';
import helpers from '../../../utils/helpers';
import { connect } from 'react-redux';
import FilteredAds from '../../profile/FilteredAds';
import _ from 'lodash';

class AdSearching extends Component {

    constructor(props) {
        console.log('search page constructor', props);
        super(props);
        this.state = {
            categories: [],
            countries: [],
            cities: [],
            searchPanelCities: [],
            data: [],
            ads: [],
            favAds: [],
            parent_id: null,
            city_id: null,
            title: null,
            country_code: null,
            display_type: 'grid'
        }
    }

    displayTypeHandler = type => {

        this.setState({
            display_type: type
        });
    }

    changeHandler = (event, key) => {
        this.setState({
            [key]: event.target.value
        });
    }

    searchHandler = async () => {
        let obj = {};
        
        if (this.state.country_code) {
            obj.country_code = this.state.country_code
        }
        if (this.state.parent_id) {
            obj.parent_id = this.state.parent_id
        }
        if (this.state.city_id) {
            obj.city_id = this.state.city_id
        }
        if (this.state.title) {
            obj.title = this.state.title
        }

        console.log('obj', obj);
        this.props.searchAds2(obj);

    }

    addToFavourite = async (event, ad) => {

        event.currentTarget.setAttribute('class', 'fa fa-heart');

        if (fakeAuthCentralState.isAuthenticated) {
            const obj = {
                postId: ad.id,
                userId: this.props.authUser._id
            }
    
            const result = await addToFavourite(localStorage.getItem('token'), obj);
            console.log('result', result);

            if (result.status === 200) {
                
                if (fakeAuthCentralState.isAuthenticated) {
                    this.props.getFavouriteAds(localStorage.getItem('token'), { userId: this.props.authUser._id });
                }

                helpers.toastify('success', result.data.message);
            }
        }
        
    }

    async componentDidMount() {
        
        this.props.getAds();

        const result = await getCategoriesWithSubCategories();
        if (result.status === 200) {

            helpers.toastify('success', 'Categories along-with Sub Categories Populated Successfully !');

            this.setState({
                data: result.data.data
            });

        } else {

            helpers.toastify('error', 'Categories along-with Sub Categories Failed to Populate !');
        }
    }

    UNSAFE_componentWillReceiveProps(props) {

        console.log('props', props);

        if (props.categories && props.categories !== this.state.categories) {

            this.setState({
                categories: props.categories
            });
        }

        if (props.country && props.country.country_code !== this.state.country_code) {
            
            this.setState({
                country_code: props.country.country_code,
                city_id: null
            }, () => this.searchHandler());
        }

        if (props.cities && props.cities !== this.state.cities) {
            
            this.setState({
                cities: props.cities
            });
        }

        if (props.ads && props.ad !== this.state.ads) {

            this.setState({
                ads: props.ads
            });
        }

        if (props.favAds && props.favAds !== this.state.favAds) {

            this.setState({
                favAds: props.favAds
            });
        }

        if (props.countries && props.countries !== this.state.countries) {

            this.setState({
                countries: props.countries
            });
        }

        if (!_.isEmpty(props.authUser) && this.state.favAds.length > 0) {
            console.log(props.authUser);
            if (fakeAuthCentralState.isAuthenticated) {
                this.props.getFavouriteAds(localStorage.getItem('token'), { userId: props.authUser._id });
            }
        }
    }

    filterCities = async event => {

        console.log(event.target.value);
        const result = await filterCitiesByCountryCode(event.target.value);
        console.log('cities', result);
        this.setState({
            searchPanelCities: result.data.data
        });
        
    }

    render() {
        return (

            <div className="container mb-30">
                <TopSearchBar
                    categories={this.state.categories}
                    cities={this.state.cities}
                    changed={this.changeHandler}
                    clicked={this.searchHandler}    
                />
                <DepartmentSearchBar 
                    data={this.state.data}
                />

                <div className="row search-panel">
                    <div className="col-sm-3">
                        <div className="search-block-left">
                            <div className="search-sidenav-header">
                                <span>Filters</span>
                                <span className="reset">Clear All</span>
                            </div>
                            <div>
                                <div className="input-group mb-3 mt-65">
                                    <input type="text" className="form-control" placeholder="Search" onChange={e => this.changeHandler(e, 'title')} />
                                    <div className="input-group-append">
                                        <span className="input-group-text" id="basic-addon2"><i className="fa fa-search fa-fw"></i></span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div id="accordion">
                            <div className="card">
                                <div className="card-header" id="headingOne" style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                                    
                                    <h6 className="mb-0">
                                        Categories
                                    </h6>
                                    <button style={{backgroundColor: '#FFF', border: 'none'}} data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                        <i className="fa fa-chevron-down"></i>
                                    </button>
                                </div>

                                <div id="collapseOne" className="collapse show" aria-labelledby="headingOne" data-parent="#accordion" style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
                                    <div className="card-body">    
                                        <select className="form-control ctg-dropdown" id="exampleFormControlSelect1">
                                            <option>Select a Category</option>
                                            { this.state.categories.map(category => (
                                                <option key={category.id} value={category.id}>{category.title}</option>
                                            )) }
                                        </select>
                                        <div className="collapse-ctg-content">
                                            <span style={{display: 'block'}}>Tablets (240)</span>
                                            <span style={{display: 'block'}}>Accessories (1240)</span>
                                            <span style={{display: 'block'}}>Mobile Phones (7850)</span>
                                        </div>
                                    </div>
                                </div>
                                
                            </div>
                            <div className="card">
                                <div className="card-header" id="headingTwo" style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                                    
                                    <h6 className="mb-0">
                                        Area
                                    </h6>
                                    <button style={{backgroundColor: '#FFF', border: 'none'}} data-toggle="collapse" data-target="#collapseTwo" aria-expanded="true" aria-controls="collapseTwo">
                                        <i className="fa fa-chevron-down"></i>
                                    </button>
                                </div>

                                <div id="collapseTwo" className="collapse show" aria-labelledby="headingTwo" data-parent="#accordion" style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
                                    <div className="card-body">  
                                        <select className="form-control area-dropdown" id="exampleFormControlSelect1" onChange={e => this.filterCities(e)}>
                                            <option>Select Country</option>
                                            { this.state.countries.map(country => (
                                                <option key={country.id} value={country.id}>{getName(country.id)}</option>
                                            )) }
                                        </select>
                                        <select className="form-control area-dropdown" id="exampleFormControlSelect1">
                                            <option>Select City</option>
                                            { this.state.searchPanelCities.map(city => (
                                                <option key={city.id} value={city.id}>{city.name}</option>
                                            )) }
                                        </select>
                                    </div>
                                </div>

                            </div>
                            <div className="card">
                                <div className="card-header" id="headingThree" style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                                    
                                    <h6 className="mb-0">
                                        Price
                                    </h6>
                                    <button style={{backgroundColor: '#FFF', border: 'none'}} data-toggle="collapse" data-target="#collapseThree" aria-expanded="true" aria-controls="collapseThree">
                                        <i className="fa fa-chevron-down"></i>
                                    </button>
                                </div>

                                <div id="collapseThree" className="collapse show" aria-labelledby="headingThree" data-parent="#accordion">
                                    <div className="card-body">
                                        <Slider range defaultValue={[20, 50]} />
                                    </div>
                                </div>
                            </div>
                            <div className="card">
                                <div className="card-header" id="headingFour" style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                                    
                                    <h6 className="mb-0">
                                        Brands
                                    </h6>
                                    <button style={{backgroundColor: '#FFF', border: 'none'}} data-toggle="collapse" data-target="#collapseFour" aria-expanded="true" aria-controls="collapseFour">
                                        <i className="fa fa-chevron-down"></i>
                                    </button>
                                </div>

                                <div id="collapseFour" className="collapse show" aria-labelledby="headingFour" data-parent="#accordion">
                                    <div className="card-body">
                                        <div>
                                            <Checkbox>iPhone</Checkbox>
                                        </div>
                                        <div>
                                            <Checkbox>Samsung</Checkbox>
                                        </div>
                                        <div>
                                            <Checkbox>Oppo</Checkbox>
                                        </div>
                                        <div>
                                            <Checkbox>Huawei</Checkbox>
                                        </div>
                                        <div>
                                            <Checkbox>Nokia</Checkbox>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-9 search-results">
                        <div className="row search-stats" style={{width: '105%'}}>
                            <span className="fs-20"><strong>96,446</strong> <span className="fw-100">Ads found</span></span>
                            <span style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '40%'}}>
                                <span>Sort By:</span>
                                <select className="form-control" style={{width: 200}}>
                                    <option value="">Date: Recent First</option>
                                    <option value="">Date: Recent Last</option>
                                </select>
                                <i 
                                    className={this.state.display_type === "grid" ? "active fa fa-th disp-icons" : "fa fa-th disp-icons"} 
                                    onClick={() => this.displayTypeHandler('grid')}
                                ></i>
                                <i 
                                    className={this.state.display_type === "list" ? "active fa fa-list disp-icons" : "fa fa-list disp-icons"} 
                                    onClick={() => this.displayTypeHandler('list')}
                                ></i>
                            </span>
                        </div>
                        <div className="row search-ad-items">

                            <FilteredAds 
                                ads={this.state.ads}
                                favIcon={true}
                                favAds={this.state.favAds}
                                addToFavourite={this.addToFavourite}
                                rootDivStyling={{width: '31.7%', marginLeft: 15, marginTop: 15}}
                            />
                            
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps({ categories, countries, country, cities, ads, favAds, authUser }) {
    return {
        categories,
        countries,
        country,
        cities,
        ads,
        favAds,
        authUser
    }
}

export default connect(mapStateToProps, { getAds, getFavouriteAds, searchAds2, addToFavourite })(AdSearching);