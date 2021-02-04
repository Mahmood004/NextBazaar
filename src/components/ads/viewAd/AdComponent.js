import React, { Component } from 'react';
import TopSearchBar from '../../searchBar/TopSearchBar';
import DepartmentSearchBar from '../../searchBar/DepartmentSearchBar';
import { MDBBtn } from 'mdbreact';
import { fakeAuthCentralState, getCategories, getCategoriesWithSubCategories, searchAds, viewAd } from '../../../actions';
import { connect } from 'react-redux';
import { Launcher } from 'react-chat-window';
import { Widget, addResponseMessage } from 'react-chat-widget';
import ImageGallery from 'react-image-gallery';
import helpers from '../../../utils/helpers';
import CustomShareIcons from '../../customShareIcons/CustomShareIcons';
import config from '../../../utils/development.json';
import commaNumber from 'comma-number';
import Geocode from 'react-geocode';
import 'react-chat-widget/lib/styles.css';
import 'react-image-gallery/styles/css/image-gallery.css';
import './AdComponent.css';

class AdComponent extends Component {

    constructor(props) {
        super(props);
        Geocode.setApiKey('AIzaSyAO0PHjx1MwTkJDfqC_oTcJJvw_DdE8ZQw');
        this.state = {
            country_code: null,
            categories: [],
            cities: [],
            data: [],
            parent_id: null,
            city_id: null,
            title: null,
            ad: null,
            icons_display: false,
            coordinates: {
                latitude: 0.0,
                longitude: 0.0
            },
            messageList: []    // react chat window
        }
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
        const result = await searchAds(obj);
        console.log('ads', result);
    }

    async componentDidMount() {

        let chatWithSeller = document.querySelector(".chat-with-seller");
        let launcher = document.querySelector(".rcw-launcher");

        chatWithSeller.addEventListener('click', function() {
            launcher.click();
        });
        
        addResponseMessage('Welcome to this awesome chat!');

        this.props.getCategories();
        const result = await getCategoriesWithSubCategories();

        if (result.status === 200) {

            helpers.toastify('success', 'Categories along-with Sub Categories Populated Successfully !');

            this.setState({
                data: result.data.data
            });

        } else {

            helpers.toastify('error', 'Categories along-with Sub Categories Failed to Populate !')
        }


        if (!fakeAuthCentralState.isAuthenticated) {
            const adId = window.location.pathname.split('/').pop();
            const result = await viewAd(localStorage.getItem('token'), adId);
            console.log('ad details', result.data.data[0]);
            if (result.status === 200) {

                helpers.toastify('success', 'Ad Details Loaded Successfully !');

                this.setState({
                    ad: result.data.data[0]
                }, () => {
                    Geocode.fromAddress(this.state.ad.Address).then(
                        response => {
                        const { lat, lng } = response.results[0].geometry.location;
                        this.setState({
                            ...this.state,
                            coordinates: {
                                latitude: lat,
                                longitude: lng
                            }
                        });
                        },
                        error => {
                        console.error(error);
                        }
                    );
                });

            } else {
                
                helpers.toastify('error', 'Ad Details Failed to Load !');
            }
        }
    }

    UNSAFE_componentWillReceiveProps(props) {
        console.log('props', props);

        if (props.country && props.country.country_code !== this.state.country_code) {

            this.setState({
                country_code: props.country.country_code,
                city_id: null
            });
        }

        if (props.categories && props.categories !== this.state.categories) {
            
            this.setState({
                categories: props.categories
            });
        }

        if (props.cities && props.cities !== this.state.cities) {

            this.setState({
                cities: props.cities
            });
        }
    }

    clickHandler = () => {
        this.setState({
            icons_display: !this.state.icons_display
        })
    }

    _onMessageWasSent = text => {
        if (text.length > 0) {
            let message = {
                author: 'them',
                type: 'text',
                data: {
                    text
                }
            }
            this.setState({
                messageList: [...this.state.messageList, message]
            })
        }
    }

    handleNewUserMessage = newMessage => {
        console.log(`New message incoming ${newMessage}`);
        addResponseMessage('Hi bro! How are you?');
    }

    render() {

        console.log(this.state);
        let images = [];
        
        if (this.state.ad) {
            images = this.state.ad.pictures.map(picture => {
                return {
                    original: config.baseUrl + '/storage/' + picture.name,
                    thumbnail: config.baseUrl + '/storage/' + picture.name
                }
            })
        }

        return (
            <div className="container mt-10 mb-30">

                <div>
                    {/* <Launcher 
                        agentProfile={{
                            teamName: 'Chat With Seller',
                            imageUrl: 'https://a.slack-edge.com/66f9/img/avatars-teams/ava_0001-34.png'
                        }}
                        onMessageWasSent={this._onMessageWasSent}
                        messageList={this.state.messageList}
                        showEmoji
                    /> */}
                    <Widget
                        handleNewUserMessage={this.handleNewUserMessage}
                        title="Chat With Seller"
                    //  subtitle="And my cool subtitle"
                    />
                </div>

                <TopSearchBar
                    categories={this.state.categories} 
                    cities={this.state.cities}
                    changed={this.changeHandler}
                    clicked={this.searchHandler}    
                />
                <DepartmentSearchBar
                    data={this.state.data}
                />

                <div className="row ad-detail-section">
                    <div className="ad-specs">
                        <span className="ad-specs-section-first">
                            <span>
                                <span className="fw-100 fs-30">{ this.state.ad ? this.state.ad.title : 'MacBook Pro (13-inch) 2014 Retina'}</span>
                                <span className="ad-top-stats">
                                    <span>
                                        <i className="fa fa-sync"></i>
                                        <span className="ml-7">Last Updated September 05, 2018</span>
                                    </span>
                                    <span className="ml-10">
                                        <i className="fa fa-map-marker-alt"></i>
                                        <span className="ml-7">{this.state.ad ? this.state.ad.Address : 'Lallian, Pakistan'}</span>
                                    </span>
                                    <span  className="ml-10">
                                        <i className="fa fa-eye"></i>
                                        <span className="ml-7">4.2k views</span>
                                    </span>
                                </span>
                            </span>
                            <span>
                                <span className="fs-20 fw-100">PKR</span> <strong className="fs-30 cl-black">{this.state.ad ? commaNumber(this.state.ad.price) : '88,000'}</strong>
                            </span>
                        </span>
                        <span className="ad-specs-section-second">
                            <span>
                                <i className="fa fa-heart ad-action-icons"></i>
                                <span className="ml-7 mr-14">Save Add</span>
                            </span>
                            <span onClick={this.clickHandler}>
                                <i className="fa fa-share-alt ad-action-icons"></i>
                                <span className="ml-7 mr-14">Share</span>
                            </span>
                            <span>
                                <i className="fa fa-map-marker-alt ad-action-icons"></i>
                                <span className="ml-7 mr-14">View on map</span>
                            </span>
                        </span>
                        {this.state.icons_display && <div style={{width: '50%', marginTop: 10}}><CustomShareIcons style={{height: 20}} /></div>}
                        <hr />
                        <span className="row ad-details ad-specs-section-third">
                            <div className="col-md-7">
                                <ImageGallery items={images.length ? images : [{ original: 'http://mongostaging.demo.commersys.com/storage/app/default/picture.jpeg', thumbnail: 'http://mongostaging.demo.commersys.com/storage/app/default/picture.jpeg' }] } autoPlay={true} />
                                {/* <div style={{display: 'block'}}>
                                    <img className="ad-central-img" src="https://cdn.pixabay.com/photo/2014/05/02/21/49/home-office-336373_960_720.jpg" alt="ad_img" />
                                </div>
                                <div className="ad-img-gallery">
                                    <img className="ad-img-item" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTR-HQubLIW_wUesTCwhoFjfnZHxV70OU6lC4ZVaWmTjaJx80xn" alt="ad_img" />
                                    <img className="ad-img-item" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTR-HQubLIW_wUesTCwhoFjfnZHxV70OU6lC4ZVaWmTjaJx80xn" alt="ad_img" />
                                    <img className="ad-img-item" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRw2LE5IlTnDxddx3fydzCzqCzSk07BGBvck3efycjMtbVOZMxg" alt="ad_img" />
                                    <img className="ad-img-item" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6YMp4sRdtnTGkh4xQRqIGWAa06MH1XFj8a6xl1oeDFz48NUhDhQ" alt="ad_img" />
                                </div> */}
                            </div>
                            <div className="col-md-5">
                                <h6 className="fw-800">Ad Details</h6>
                                <p className="fs-12">{this.state.ad ? this.state.ad.details : 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum'}</p>
                            </div>
                        </span>
                        <hr style={{margin: 0.4}} />
                        <span className="row ad-comments-header-section ad-specs-section-fourth">
                            <span className="col-md-12 ad-comments-header">
                                <span className="fw-700">Comments</span>
                                <span className="ad-comments-filter">
                                    <span className="fw-100 fs-12">Sort By:</span> 
                                    <select className="form-control comments-sortion">
                                        <option value="">Oldest</option>
                                        <option value="">Newest</option>
                                    </select>
                                </span>
                            </span>
                        </span>
                        <span className="row ad-comments-body-section ad-specs-section-fifth">
                            <span className="col-md-1 comments-body">
                                <img className="commenter-avatar" src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" alt="user_img" />
                            </span>
                            <span className="col-md-11 commenter-details">
                                <span className="fw-900">Owner name</span>
                                <span className="mt-8 fw-500 cl-black">
                                    Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                                </span>
                            </span>
                        </span>
                        <span className="row ad-comment-input-field ad-specs-section-sixth">
                            <span className="col-md-12 input-with-button" style={{position: 'relative'}}>
                                <input type="text" className="form-control comment-input-field" placeholder="Add a comment" />
                                <MDBBtn type="button" className="themeBtnStyle btnStyle comment-submit-btn">POST</MDBBtn>
                            </span>
                            <span className="ml-30 mt-1">
                                <input type="checkbox" />
                                <span className="ml-1">Also post on Facebook</span>
                            </span>
                        </span>
                    </div>
    
                    <div className="seller-description">
                        <span className="sel-des-section-first">
                            <span className="fw-900 fs-15">Seller Description</span>
                            <span className="seller-details">
                                <span>
                                    <img className="seller-avatar" src="https://image.shutterstock.com/image-photo/closeup-portrait-man-his-40s-260nw-271861394.jpg" alt="seller_img" />
                                    <span className="ml-10">{this.state.ad ? this.state.ad.posted_by : 'Muhammad Arif'}</span>
                                </span>
                                <span>
                                    <i className="fa fa-angle-right" />
                                </span>
                            </span>
                            <span className="fs-12 pt-15 cl-gray"><i>Joined 3 years ago</i></span>
                            <span className="pt-15">
                                <button className="form-control chat-with-seller" type="button">
                                    <i className="fa fa-envelope fa-lg cl-dg"></i>
                                    <span className="ml-8">CHAT WITH SELLER</span>
                                </button>
                            </span>
                        </span>
                        <hr />
                        <span className="sel-des-section-second">
                            <span className="fw-900 fs-15">Safety Tips for Buyers</span>
                            <span className="safety-tips">
                                <span>
                                    <i className="fa fa-check" />
                                    <span className="ml-8">Meet seller at a public place</span>
                                </span>
                                <span>
                                    <i className="fa fa-check" />
                                    <span className="ml-8">Check the item before you buy</span>
                                </span>
                                <span>
                                    <i className="fa fa-check" />
                                    <span className="ml-8">Pay only after collecting the item</span>
                                </span>
                            </span>  
                        </span>
                        <hr style={{margin: '8px 0'}} />
                        <span className="sel-des-section-third">
                            <span className="fw-900 fs-15">Locations's Map</span>
                            <span className="pt-15">
                                <iframe className="embed-map-iframe" src={`https://maps.google.com/maps?q=${this.state.coordinates.latitude},${this.state.coordinates.longitude}&hl=es;z=14&amp;output=embed`} allowFullScreen></iframe>
                            </span>  
                        </span>
                        <hr />
                        <span className="sel-des-section-fourth">
                            <span className="fw-900 fs-15">Share on social media</span>
                            <span style={{display: 'flex', paddingTop: 15}}>
                                <i className="fa fa-facebook"></i>
                                <i className="fa fa-twitter"></i>
                                <i className="fa fa-google"></i>
                            </span>
                            <span className="pt-30">
                                <button className="form-control" type="button">
                                    <i className="fa fa-exclamation-circle fa-lg cl-red"></i>
                                    <span className="ml-8">REPORT AD</span>
                                </button>
                            </span>
                        </span>
    
                    </div>
                </div>
    
                <div className="row mt-40">
                    <h4 className="fw-800">Similar Ads</h4>
                    <div className="row">
                        <div className="col-md-3">
                            <div className="card mt-15 mr-18">
                                <img className="card-img-top" src="https://images.pexels.com/photos/414612/pexels-photo-414612.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" alt="ad_image" />
                                <div className="card-body">
                                    <span className="similar-ads-card-body-section-first">
                                        <span>Rs <strong className="fs-20">13,500</strong></span>
                                        <i className="icon-heart-empty"></i>
                                    </span>
                                    <span className="card-text similar-ads-card-body-section-second">Samsung Galaxy Note 4</span>
                                    <span className="similar-ads-card-body-section-third"><i>Mobile Phones</i></span>
                                    <span className="similar-ads-card-body-section-fourth">
                                        <span>Abid Market, Lahore</span>
                                        <span>Jan 05</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="card mt-15 mr-18">
                                <img className="card-img-top" src="https://images.pexels.com/photos/414612/pexels-photo-414612.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" alt="ad_image" />
                                <div className="card-body">
                                    <span className="similar-ads-card-body-section-first">
                                        <span>Rs <strong className="fs-20">13,500</strong></span>
                                        <i className="icon-heart-empty"></i>
                                    </span>
                                    <span className="card-text similar-ads-card-body-section-second">Samsung Galaxy Note 4</span>
                                    <span className="similar-ads-card-body-section-third"><i>Mobile Phones</i></span>
                                    <span className="similar-ads-card-body-section-fourth">
                                        <span>Abid Market, Lahore</span>
                                        <span>Jan 05</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="card mt-15 mr-18">
                                <img className="card-img-top" src="https://images.pexels.com/photos/414612/pexels-photo-414612.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" alt="ad_image" />
                                <div className="card-body">
                                    <span className="similar-ads-card-body-section-first">
                                        <span>Rs <strong className="fs-20">13,500</strong></span>
                                        <i className="icon-heart-empty"></i>
                                    </span>
                                    <span className="card-text similar-ads-card-body-section-second">Samsung Galaxy Note 4</span>
                                    <span className="similar-ads-card-body-section-third"><i>Mobile Phones</i></span>
                                    <span className="similar-ads-card-body-section-fourth">
                                        <span>Abid Market, Lahore</span>
                                        <span>Jan 05</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="card mt-15 mr-18">
                                <img className="card-img-top" src="https://images.pexels.com/photos/414612/pexels-photo-414612.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" alt="ad_image" />
                                <div className="card-body">
                                    <span className="similar-ads-card-body-section-first">
                                        <span>Rs <strong className="fs-20">13,500</strong></span>
                                        <i className="icon-heart-empty"></i>
                                    </span>
                                    <span className="card-text similar-ads-card-body-section-second">Samsung Galaxy Note 4</span>
                                    <span className="similar-ads-card-body-section-third"><i>Mobile Phones</i></span>
                                    <span className="similar-ads-card-body-section-fourth">
                                        <span>Abid Market, Lahore</span>
                                        <span>Jan 05</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    
}

function mapStateToProps({ categories, country, cities }) {
    return {
        categories,
        country,
        cities
    }
}

export default connect(mapStateToProps, { getCategories })(AdComponent);