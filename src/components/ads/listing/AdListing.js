import React, { Component } from 'react';
import { MDBBtn, MDBCol, MDBContainer, MDBRow } from "mdbreact";
import { getAds, fetchCitiesByCountryCode, getCategoriesWithSubCategories, searchAds, fakeAuthCentralState, addToFavourite, getFavouriteAds } from '../../../actions';
import helpers from '../../../utils/helpers';
import { connect } from 'react-redux';
import VectorMap from '@south-paw/react-vector-maps';
import config from '../../../utils/development.json';
import { getName } from 'country-list';
import Pagination from 'react-js-pagination';
import _ from 'lodash';
import './AdListing.css';

class AdListing extends Component {

    constructor(props) {
        super(props);
        this.state = {
            map: null,
            country: null,
            cities: [],
            country_code: null,
            city_id: null,
            parent_id: null,
            title: null,
            data: [],
            ads: [],
            activePage: 1,
            activeCity: null,
            favAds: null
        }
        this.per_page = 8;
        this.total_count = 0;
        this.page_range = 5;
        this.ads_count = 0;
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

    handleChange = (e, key) => {
        this.setState({
            [key]: e.target.value
        });
    }

    handlePageChange = pageNumber => {
        this.setState({
            activePage: pageNumber,
        });
    }

    triggerSearch = city => {

        this.setState({
            city_id: city.id,
            activeCity: city.name
        }, () => {
            this.handleSearch();
        })
    }

    handleSearch = async () => {
        let obj = {};

        if (this.state.country_code) {
            obj.country_code = this.state.country_code
        }

        if (this.state.city_id) {
            obj.city_id = this.state.city_id
        }

        if (this.state.parent_id) {
            obj.parent_id = this.state.parent_id
        }

        if (this.state.title) {
            obj.title = this.state.title
        }

        console.log('obj', obj);
        const result = await searchAds(obj);
        console.log('result', result);

        if (result.status === 200) {

            helpers.toastify('info', 'Ads Filtered Successfully !');

            this.total_count = result.data.data.length;

            this.setState({
                ads: result.data.data
            });

        } else {

            helpers.toastify('error', 'Ads Filteration Failed !');
        }
        
    }

    async componentDidMount() {

        this.props.getAds();

        const result = await getCategoriesWithSubCategories();
        // console.log(result);

        if (result.status === 200) {

            helpers.toastify('success', 'Categories along-with Sub Categories Populated Successfully !');

            this.setState({
                data: result.data.data
            });
        } else {

            helpers.toastify('error', 'Categories along-with Sub Categories Failed to Populate !');
        }
        
    }

    handlePageChange = (page, e) => {
        this.setState({
            activePage: page
        });
    };

    UNSAFE_componentWillReceiveProps(props) {

        console.log('inside component will receive props', props);
        
        if (!_.isEmpty(props.country) && props.country.country_code !== this.state.country_code) {
            const country = getName(props.country.country_code);
            this.props.fetchCitiesByCountryCode(props.country.country_code);
            const map = require('@south-paw/react-vector-maps/maps/json/' + _.kebabCase(country) + '.json');

            this.setState({
                country_code: props.country.country_code,
                country,
                map,
                city_id: null,
            }, () => {
                this.handleSearch();
            })
        }

        if (!_.isEmpty(props.cities) && props.cities.length !== this.state.cities.length) {
            this.setState({
                cities: props.cities
            })
        }

        if (!_.isEmpty(props.ads) && _.isEmpty(this.state.country_code) && _.isEmpty(this.state.ads)) {

                helpers.toastify('success', 'Ads Fetched Successfully !')

                this.total_count = props.ads.length;
    
                this.setState({
                    ads: props.ads
                });
        }

        if (props.favAds && this.state.favAds !== props.favAds) {
            this.setState({
                favAds: props.favAds
            });
        }

        if (!_.isEmpty(props.authUser) && this.state.favAds === null) {
            if (fakeAuthCentralState.isAuthenticated) {
                this.props.getFavouriteAds(localStorage.getItem('token'), { userId: props.authUser._id });
            }
        }
    }

    render() {
        // console.log(this.state);
        this.ads_count = 0;
        return (
            <>
                <MDBContainer>
                    <MDBRow>
                        <MDBCol size="3">
                            <div className="formElement form-group">
                                <select className="browser-default custom-select" onChange={e => this.handleChange(e, 'city_id')}>
                                    <option value="">Where?</option>
                                    { this.state.cities.map(city => (
                                        <option key={city.id} value={city.id}>{city.name}</option>
                                    ))}
                                </select>
                            </div>
                        </MDBCol>
                        <MDBCol size="3">
                            <div className="formElement form-group">
                                <select className="browser-default custom-select" onChange={e => this.handleChange(e, 'parent_id')}>
                                    <option value="">Select Category</option>
                                    { this.props.categories && this.props.categories.map(category => (
                                        <option key={category.id} value={category.id}>{category.title}</option>
                                    ))}
                                </select>
                            </div>
                        </MDBCol>
                        <MDBCol size="5">
                            <div className="formElement form-group">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Find Cars, Mobile Phones and more..."
                                    onChange={e => this.handleChange(e, 'title')}
                                />
                            </div>
                        </MDBCol>
                        <MDBCol size="1">
                            <div className="formElement form-group">
                                <MDBBtn type="button" onClick={this.handleSearch} className="themeBtnStyle btnStyle">Search</MDBBtn>
                            </div>
                        </MDBCol>
                    </MDBRow>
                </MDBContainer>

                <div className="container">

                    <div className="row" style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#F2F2F2', height: 35, padding: '0 20px'}}>
                        
                        <div className="dropdown">
                            <button className="dropbtn">
                                <i className="fa fa-bars" style={{marginRight: 10}}></i>
                                Shop By Department
                                <i className="fa fa-caret-down" style={{marginLeft: 10}}></i>
                            </button>
                            <div className="dropdownContent">
                                { this.state.data.map(category => (
                                        <span key={category.id}>
                                            <a>{category.title}</a>
                                            <i className="fa fa-chevron-right" style={{float: 'right', lineHeight: 0.4}} ></i>
                                            <div className="subDropdown">
                                                { category.sub_categories.map(subCategory => (
                                                    <h6 key={subCategory.id}>{subCategory.title}</h6>
                                                ))}
                                            </div>
                                        </span>
                                    )
                                )}
                                <span>
                                    <a>All Categories</a>
                                </span>
                            </div>
                        </div>

                        <div>
                            <span style={{verticalAlign: '-webkit-baseline-middle', marginRight: 30}}>
                                <i className="fa fa-tag" style={{marginRight: 5, color: '#fa5b23'}}></i>
                                Hyper offers 
                            </span>
                            <span style={{verticalAlign: '-webkit-baseline-middle', marginRight: 30}}>
                                <i className="fa fa-star" style={{marginRight: 5, color: '#fa5b23'}}></i>
                                All sellers 
                            </span>
                            <span style={{verticalAlign: '-webkit-baseline-middle', marginRight: 30}}>
                                <i className="fa fa-shopping-cart" style={{marginRight: 5, color: '#fa5b23'}}></i>
                                Our shops 
                            </span>
                            <span style={{verticalAlign: '-webkit-baseline-middle', marginRight: 30}}>
                                <i className="fa fa-info" style={{marginRight: 5, color: '#fa5b23'}}></i>
                                Helps 
                            </span>
                        </div>
                            
                    </div>

                    <div className="row" style={{height: 400, border: '1px solid #ccc', backgroundImage: 'url(http://thewowstyle.com/wp-content/uploads/2015/01/facebook-cover-9.jpg)', backgroundSize: 'cover', opacity: 1  }}>
                    </div>

                    <div className="row">
                        <div className="mapSection col-sm-6">
                            
                                <div className="mapSectionHeading">
                                    <h3 className="headingText">
                                        <i className="mapMarker fa fa-lg fa-map-marker-alt"></i>
                                        Choose a city or region
                                    </h3>
                                </div>
                                <div className="mapSectionContent row">
                                    <div className="blockLeft col">
                                        { this.state.cities.map((city, index) => { 
                                            
                                            if (index < 10) {
                                                return (
                                                    <span style={{cursor: 'pointer', background: this.state.activeCity === city.name ? '#F2F2F2' : ''}} onClick={() => this.triggerSearch(city)} className="span" key={city.id}>{city.name}</span>
                                                )
                                            }   
                                        })}
                                    </div>
                                    <div className="blockRight col">
                                        { this.state.cities.map((city, index) => { 
                                                
                                            if (index >= 10 && index < 17) {
                                                return (
                                                    <span style={{cursor: 'pointer', background: this.state.activeCity === city.name ? '#F2F2F2' : ''}} onClick={() => this.triggerSearch(city)} className="span" key={city.id}>{city.name}</span>
                                                )
                                            }
                                        })}
                                    </div>
                                </div>
                        </div>

                        <div className="mapSection col-sm-6">
                            { this.state.map && <VectorMap {...this.state.map} className="svg" /> }
                        </div>
                    </div>

                    <div className="row">
                        <div className="ctgSection col">
                            <div className="ctgSectionHeading">
                                <h2 className="headingText">Popular Categories</h2>
                            </div>
                            <div className="ctgSectionContent row">
                                { this.state.data.map((category, index) => {

                                    if (index < 5) {

                                        return (
                                            <div className="col" key={category.id}>
                                                <div className="ctg card">
                                                    <div className="ctg card-header">
                                                        {category.title}
                                                    </div>
                                                    <div className="ctgSectCont card-body">
                                                        {/* <h5 className="card-title">Card title</h5> */}
                                                        { category.sub_categories.map((subCategory, index) => {
                                                            if (index < 5) {
                                                                return (
                                                                    <span style={{display: 'block'}} key={subCategory.id}>{subCategory.title.split(',')[0]}</span>
                                                                )
                                                            }
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }
                                })}
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="adSection col">
                            <div className="adSectionHeading">
                                <h2 className="headingText">Latest Ads</h2>
                            </div>
                            <div className="adSectionContent row">
                                { this.state.ads.map((ad, index) => {
                                    // console.log(this.ads_count, this.per_page);
                                    if (this.ads_count < this.per_page && (index >= (this.state.activePage * this.per_page) - this.per_page)) {
                                        // console.log('inside');
                                        this.ads_count = this.ads_count + 1;
                                        
                                        return (
                                            <div className="adCol col-sm-3" key={ad.id}>
                                                <div className="card">
                                                    <img onClick={() => window.open(`ads/ad/${ad.id}`, "_blank")} className="adCardImg card-img-top" style={{height: 200}} src={ad.pictures.length ? config.baseUrl + '/storage/' + ad.pictures[0].name : "http://mongostaging.demo.commersys.com/storage/app/default/picture.jpeg"} alt="" />
                                                    <div className="adCardBody card-body">
                                                        
                                                        <span style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                                            <span>Rs <strong className="fs-20">{+ad.price || '13,500'}</strong></span>
                                                            { fakeAuthCentralState.isAuthenticated === true ? this.state.favAds.find(favAd => favAd.post_id === ad.id) ? <i className="fa fa-heart"></i> : <i className="icon-heart-empty" onClick={e => this.addToFavourite(e, ad)}></i> : '' }
                                                        </span>
                                                        
                                                        <span style={{display: 'block'}}className="card-text mt-10">{ad.title}</span>
                                                        <span style={{color: '#fa5b23'}} className="fs-12"><i>{ad.details.length > 100 ? ad.details.substring(0, 100) + " ..." : ad.details}</i></span>
                                                        <span style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}} className="fs-12 cl-gray mt-20">
                                                            <span>{ad.Address || 'Abid Market, Lahore'}</span>
                                                            <span>Jan 05</span>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }
                                })}
                            </div>
                            
                        </div>
                    </div>
                    <div className="row" style={{display: 'flex', justifyContent: 'center', margin: 50}}>
                        <Pagination
                            prevPageText='prev'
                            nextPageText='next'
                            firstPageText='first'
                            lastPageText='last'
                            activePage={this.state.activePage}
                            pageRangeDisplayed={this.page_range}
                            itemsCountPerPage={this.per_page}
                            totalItemsCount={this.total_count}
                            onChange={this.handlePageChange}
                        />
                    </div>
                </div>
            </>

        )
    }
}

function mapStateToProps({ country, cities, categories, ads, authUser, favAds }) {
    
    return {
        country,
        cities,
        categories,
        ads,
        authUser,
        favAds
    }
}


export default connect(mapStateToProps, { getAds, fetchCitiesByCountryCode, getFavouriteAds })(AdListing);