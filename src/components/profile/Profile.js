import React, { Component } from 'react';
import './Profile.css';
import FilteredAds from './FilteredAds';
import FilteredAdsHeader from './FilteredAdsHeader';
import TopSearchBar from '../searchBar/TopSearchBar';
import DepartmentSearchBar from '../searchBar/DepartmentSearchBar';
import AdPosting from '../ads/posting/AdPosting';
import { fakeAuthCentralState, getAuthUser, signout, getCategories, getCategoriesWithSubCategories, getAds, searchAds2, deleteSingleAd, deleteMultipleAds, getGenderOptions, updateUser, updateProfileAvatar, recoverPassword } from '../../actions';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import helpers from '../../utils/helpers';
import Modal from 'react-modal';
import config from '../../utils/development.json';
import ResetPassword from './ResetPassword';
import _ from 'lodash';

Modal.setAppElement('#root');

class Profile extends Component {

    constructor(props) {
        super(props);
        this.resetPasswordFlag = true;
        this.state = {
            country_code: null,
            visible: false,
            data: [],
            categories: [],
            cities: [],
            ads: [],
            authUser: {
                user_id: '',
                name: '',
                gender_id: '',
                username: '',
                email: '',
                phone: '',
                avatar: ''
            },
            genders: [],
            parent_id: null,
            city_id: null,
            title: null,
            active: 'myAds',
            statTitle: 'My ads',
            markedAll: false,
            remove_ads: [],
            modalIsOpen: false,
            changePasswordModal: false,
            ad: null,
            new_password: {
                value: '',
                error: null
            },
            confirm_password: {
                value: '',
                error: null
            }
        }
    }

    openModal = (ad = null) => {
        this.setState({
            modalIsOpen: true,
            ad
        })
    }

    openChangePasswordModal = () => {
        this.setState({
            changePasswordModal: true
        })
    }

    closeModal = () => {
        this.setState({
            modalIsOpen: false
        })
    }

    closeChangePasswordModal = () => {
        this.setState({
            changePasswordModal: false
        })
    }

    markedAllHandler = event => {

        this.setState({
            markedAll: event.target.checked,
            remove_ads: []
        });

    }

    resetPasswordHandler = (event, key) => {

        console.log(key, event.target.value, _.size(event.target.value));

        if (key === 'new_password') {
            
            if (_.size(event.target.value) < 6) {
                this.setState({
                    [key]: {
                        ...this.state[key],
                        error: 'Password length should be six characters long'
                    } 
                });
                this.resetPasswordFlag = false;
            } else {
                this.setState({
                    [key]: {
                        ...this.state[key],
                        value: event.target.value,
                        error: null
                    } 
                });
                this.resetPasswordFlag = true;
            }
        }

        if (key === 'confirm_password') {
            if (event.target.value !== this.state.new_password.value) {
                this.setState({
                    [key]: {
                        ...this.state[key],
                        error: 'Confirm Password must match to the New Password'
                    } 
                });
                this.resetPasswordFlag = false;
            } else {
                this.setState({
                    [key]: {
                        ...this.state[key],
                        value: event.target.value,
                        error: null
                    }
                });
                this.resetPasswordFlag = true;
            }
        }
    }

    resetPassword = async () => {
        if (this.resetPasswordFlag) {
            let obj = {
                email: this.state.authUser.email,
                password: this.state.new_password.value,
                password_confirmation: this.state.confirm_password.value,
                token: localStorage.getItem('token')
            }
            console.log('obj', obj);
            const result = await recoverPassword(obj);
            console.log(result);
        }
    }

    deleteAdsHandler = async (e, adId = null) => {
        // console.log(this.state.markedAll, this.state.remove_ads, adId);

        let result;
        let adIndex;

        if (fakeAuthCentralState.isAuthenticated) {
            if (adId)
                result = await deleteSingleAd(localStorage.getItem('token'), adId);
            else 
                result = await deleteMultipleAds(localStorage.getItem('token'), this.state.remove_ads);
            
            if (result.status === 200) {
                console.log('in if 200');
                const ads = [...this.state.ads];

                if (adId) {

                    adIndex = ads.findIndex(ad => ad.id === adId);

                    if (adIndex >= 0) {
                        ads.splice(adIndex, 1);
                    }
                }
                    
                else {
                    // console.log('in else 200');
                    this.state.remove_ads.forEach(adId => {
                        adIndex = ads.findIndex(ad => ad.id === adId);
                        if (adIndex >= 0) {
                            ads.splice(adIndex, 1);
                        }
                    })
                }

                this.setState({
                    ads
                });

                helpers.toastify('success', 'Ad(s) has been deleted successfully !');
                
            } else {
                helpers.toastify('error', 'Ad(s) deletion failed !');
            }
        }
        
    }

    deleteCheckboxHandler = (event, id) => {

        // console.log('inside delete checkbox handler');
        
        const removeAds = [...this.state.remove_ads];
        if (event.target.checked) {
            const ad = this.state.ads.find(ad => ad.id === id);
            removeAds.push(ad.id);
        } else {
            let adIndex = removeAds.findIndex(ad => ad.id === id);
            removeAds.splice(adIndex, 1);
        }

        // console.log(removeAds.length, this.state.ads.length);

        if (removeAds.length === this.state.ads.length) {
            
            this.setState({
                markedAll: true,
                remove_ads: removeAds
            });

        } else {

            this.setState({
                markedAll: false,
                remove_ads: removeAds
            });
        }
        
    }

    setActive = (title, value) => {

        if (this.state.active !== value) {
            this.setState({
                active: value,
                statTitle: title
            })
        }
    }

    showModal = () => {
        this.setState({
          visible: true,
        });
    }

    handleOk = (e) => {
        
        this.setState({
          visible: false,
        });
    }

    handleCancel = (e) => {
        
        this.setState({
          visible: false,
        });
    }

    changeHandler = (event, key) => {
        this.setState({
            [key]: event.target.value
        })
    }

    searchHandler = () => {
        let obj = {};
        if (this.state.country_code) {
            obj.country_code = this.state.country_code;
        }
        if (this.state.city_id) {
            obj.city_id = this.state.city_id;
        }
        if (this.state.parent_id) {
            obj.parent_id = this.state.parent_id
        }
        if (this.state.title) {
            obj.title = this.state.title
        }

        // console.log('obj', obj);
        this.props.searchAds2(obj);

    }

    async componentDidMount() {

        this.props.getCategories();
        this.props.getAds();

        if (fakeAuthCentralState.isAuthenticated) {
            this.props.getAuthUser(localStorage.getItem('token'));
            const response = await getGenderOptions(localStorage.getItem('token'));
            
            if (response.status === 200) {
                this.setState({
                    genders: response.data.data
                });
            }
        }

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

        if (props.country && props.country.country_code !== this.state.country_code) {
            this.setState({
                country_code: props.country.country_code,
                city_id: null
            }, () => this.searchHandler());
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

        if (props.ads && props.ads !== this.state.ads) {
            this.setState({
                ads: props.ads
            });
        }

        if (props.authUser && props.authUser !== this.state.authUser) {
            this.setState({
                authUser: {
                    ...this.state.authUser,
                    user_id: props.authUser._id,
                    gender_id: props.authUser.gender_id,
                    name: props.authUser.name,
                    username: props.authUser.username,
                    email: props.authUser.email,
                    phone: props.authUser.phone,
                    avatar: config.baseUrl + '/storage/' + props.authUser.avatar
                }
            });
        }
    }

    logout = () => {
        localStorage.removeItem('token');
        fakeAuthCentralState.isAuthenticated = false;
        this.props.signout();
        this.props.history.push('/');
    }

    changedProfileHandler = async event => {

        // console.log(event.target.name, event.target.value);
        await this.setState({
            authUser: {
                ...this.state.authUser,
                [event.target.name]: event.target.value
            }
        });

        if (fakeAuthCentralState.isAuthenticated) {
            console.log(this.state.authUser);
            const updated = await updateUser(localStorage.getItem('token'), this.state.authUser);
            console.log('updated', updated);
        }
        

    }

    changeAvatarHandler = async event => {
        
        let reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = async () => {
            let base64 = reader.result;
            console.log(base64);
            if (fakeAuthCentralState.isAuthenticated) {
                const response = await updateProfileAvatar(localStorage.getItem('token'), base64);
                if (response.status === 200) {
                    this.setState({
                        authUser: {
                            ...this.state.authUser,
                            avatar: config.baseUrl + '/storage/' + response.data.data.profile
                        }
                    })
                }
            }
        }
        
    }
    
    render() {

        console.log('state', this.state.new_password, this.state.confirm_password);

        return (
            <div className="container">

                <ResetPassword 
                    modalIsOpen={this.state.changePasswordModal} 
                    closeModal={this.closeChangePasswordModal}
                    customStyles={customStyles.content}
                    contentLabel="Reset Password"
                    changed={this.resetPasswordHandler}
                    clicked={this.resetPassword}
                    newPassword={this.state.new_password}
                    confirmPassword={this.state.confirm_password}
                />

                <TopSearchBar 
                    categories={this.state.categories}
                    cities={this.state.cities}
                    changed={this.changeHandler}
                    clicked={this.searchHandler}
                />

                <DepartmentSearchBar 
                    data={this.state.data}
                />

                <div className="row profile-section">
                    <div className="col-md-3 profile-short-summary">
                        <div>
                            <input type="file" onChange={e => this.changeAvatarHandler(e)} />
                            <img className="profile-avatar" src={this.state.authUser.avatar !== '' ? this.state.authUser.avatar : "https://www.pstu.ac.bd/images/defaults/default.png"} alt="" />
                        </div>
                        <h4 className="fw-bold">{this.state.authUser.name}</h4>
                        <div className="user-ads-stats">
                            <span>
                                <i className="fa fa-envelope wrapped-circle"></i>
                                <span>90</span>
                                <span className="fs-12 cl-gray">Mails</span>
                            </span>
                            <span>
                                <i className="fa fa-eye wrapped-circle"></i>
                                <span>57.9k</span>
                                <span className="fs-12 cl-gray">Visits</span>
                            </span>
                            <span>
                                <i className="fa fa-th-large wrapped-circle"></i>
                                <span>34</span>
                                <span className="fs-12 cl-gray">Ads</span>
                            </span>
                            <span>
                                <i className="fa fa-heart wrapped-circle"></i>
                                <span>12</span>
                                <span className="fs-12 cl-gray">Favorites</span>
                            </span>
                        </div>
                    </div>
                    <div className="col-md-9 profile-basic-info">
                        <div className="profile-header-info">
                            <h4 className="fw-600" style={{ color: '#fa5b23' }}>Profile</h4>
                            <span>
                                <span className="pr-15 fw-100 cl-gray" style={{ borderRight: '1px solid #ddd', cursor: 'pointer'}} onClick={this.openChangePasswordModal}>Change Password</span>
                                <span className="ml-15 fw-100 cl-gray">Edit</span>
                            </span>
                        </div>
                        <div className="profile-body-info">
                            <div className="row">
                                <div className="col-md-6 form-group">
                                    <label className="fs-14" htmlFor="gender">Select Gender</label>
                                    <select className="form-control" name="gender_id" value={this.state.authUser.gender_id} onChange={e => this.changedProfileHandler(e)}>
                                        <option value="">--Select Gender--</option>
                                        {this.state.genders && this.state.genders.map(gender => (
                                            <option value={gender.id} key={gender.id}>{gender.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-md-6 form-group">
                                    <label className="fs-14" htmlFor="fullname">Full Name</label>
                                    <input className="form-control" type="text" name="name" value={this.state.authUser.name} onChange={e => this.changedProfileHandler(e)} />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6 form-group">
                                    <label className="fs-14" htmlFor="username">Username</label>
                                    <input className="form-control" type="text" name="username" value={this.state.authUser.username} onChange={e => this.changedProfileHandler(e)} />
                                </div> 
                                <div className="col-md-6 form-group">
                                    <label className="fs-14" htmlFor="email">Email</label>
                                    <input className="form-control" type="text" name="email" value={this.state.authUser.email} readOnly />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6 form-group">
                                    <label className="fs-14" htmlFor="phone">Phone</label>
                                    <input className="form-control" type="text" value={this.state.authUser.phone} name="phone" onChange={e => this.changedProfileHandler(e)} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row ad-section">
                    <div className="col-md-3 ad-stats-navbar">
                        <ul className="ad-stats-list">
                            <li 
                                className={this.state.active === "myAds" ? "active" : ""} 
                                onClick={e => this.setActive('My ads', 'myAds')}
                            >
                                <span className="fs-18"><i className="fa fa-ad"></i>My ads</span>
                                <span className="ad-stats-count">34</span>
                            </li>
                            <li 
                                className={this.state.active === "favAds" ? "active" : ""} 
                                onClick={e => this.setActive('Favourite ads', 'favAds')}
                            >
                                <span className="fs-18"><i className="fa fa-heart"></i>Favourite ads</span>
                                <span className="ad-stats-count">05</span>    
                            </li>
                            <li 
                                className={this.state.active === "savSearches" ? "active" : ""} 
                                onClick={e => this.setActive('Saved searches', 'savSearches')}
                            >
                                <span className="fs-18"><i className="fa fa-search"></i>Saved searches</span>
                                <span className="ad-stats-count">02</span>
                            </li>
                            <li 
                                className={this.state.active === "pendAppr" ? "active" : ""} 
                                onClick={e => this.setActive('Pending approval', 'pendAppr')}
                            >
                                <span className="fs-18"><i className="fa fa-hourglass"></i>Pending approval</span>
                                <span className="ad-stats-count">00</span>    
                            </li>
                            <li 
                                className={this.state.active === "archiveAds" ? "active" : ""} 
                                onClick={e => this.setActive('Archived ads', 'archiveAds')}
                            >
                                <span className="fs-18"><i className="fa fa-archive"></i>Archived ads</span>
                                <span className="ad-stats-count">01</span>    
                            </li>
                            <li 
                                className={this.state.active === "conversations" ? "active" : ""} 
                                onClick={e => this.setActive('Conversations', 'conversations')}
                            >
                                <span className="fs-18"><i className="fa fa-envelope"></i>Conversations</span>
                                <span className="ad-stats-count">91</span>    
                            </li>
                            <li 
                                className={this.state.active === "transactions" ? "active" : ""} 
                                onClick={e => this.setActive('Transactions', 'transactions')}
                            >
                                <span className="fs-18"><i className="fa fa-exchange-alt"></i>Transactions</span>
                                <span className="ad-stats-count">07</span>    
                            </li>
                            <li style={{borderBottom: 'none'}}>
                                <span className="fs-18" onClick={this.logout}><i className="fa fa-sign-out-alt"></i>Logout</span>
                            </li>
                        </ul>
                    </div>
                    <div className="col-md-9 ad-selected-navbar">
                        <FilteredAdsHeader 
                            title={this.state.statTitle} 
                            markedAll={this.markedAllHandler} 
                            deleted={this.deleteAdsHandler}
                            marked={this.state.markedAll}
                        />
                        <FilteredAds 
                            ads={this.state.ads}
                            checkbox={true}
                            actionIcons={true}
                            click={this.showModal}
                            rootDivStyling={{width: '31.7%', marginLeft: 15, marginTop: 15}}
                            markedAll={this.state.markedAll}
                            checked={this.deleteCheckboxHandler}
                            deleted={this.deleteAdsHandler}
                            openModal={this.openModal}
                        />
                    </div>
                </div>

                <Modal
                    isOpen={this.state.modalIsOpen}
                    onRequestClose={this.closeModal}
                    style={customStyles.content}
                    contentLabel="Update Ad"
                >
                    <AdPosting title="Update" ad={this.state.ad} close={this.closeModal} />
                </Modal>

            </div>
        )
    }

}

const customStyles = {
    content : {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform : 'translate(-50%, -50%)'
    }
};

function mapStateToProps({ categories, country, cities, ads, authUser }) {
    return {
        categories,
        country,
        cities,
        ads,
        authUser
    }
}

export default connect(mapStateToProps, { getAuthUser, signout, getCategories, getAds, searchAds2 })(withRouter(Profile));