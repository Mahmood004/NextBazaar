import React, {Component} from 'react';
import _ from 'lodash';
import { MDBContainer, MDBRow, MDBCol, MDBBtn, MDBIcon } from "mdbreact";
import { getCategories, getSubCategoriesByCategoryId, getCustomFieldsByCategoryId, postAd, updateAd } from '../../../actions';
import CustomField from './customFields/AdCustomFields';
import helpers from '../../../utils/helpers';
import { connect } from 'react-redux';
import { Checkbox } from 'antd';
import './AdPosting.css';

class AdPosting extends Component {

    constructor(props) {

        // console.log('ad posting props', props);

        super(props);
        this.state = {
            categories: [],
            subCategories: [],
            categoryId: '',
            subCategoryId: '',
            cities: [],
            city: '',
            customFields: [],
            cf: [],
            type: '',
            pictures: [],
            title: '',
            description: '',
            price: '',
            negotiable: null,
            name: '',
            email: '',
            phone: '',
            phoneHidden: null,
            address: '',
            fbProfile: ''
        }

    }

    componentDidMount() {
        
        this.props.getCategories();
        if (this.props.ad) {
            
            this.props.getCustomFieldsByCategoryId(this.props.ad.parent_id);
            console.log('single ad props', this.props.ad);
            this.adCustomFieldsMapper(this.props.ad.cf);
            this.filterSubCategories(this.props.ad.parent_id);
            this.adFieldsMapper(this.props.ad);
        }
        
    }

    changeCategoryHandler = async event => {
        
        const categoryId = event.target.value;
        // console.log(categoryId);
        
        this.setState({
            categoryId,
            customFields: []
        });

        if (categoryId) {
            
            this.props.getCustomFieldsByCategoryId(categoryId);
            this.filterSubCategories(categoryId);
        }
    }

    filterSubCategories = async categoryId => {
        const result = await getSubCategoriesByCategoryId(categoryId);

        if (result.status === 200) {
            
            helpers.toastify('success', 'Sub Categories Populated Successfully !');

            if (this.props.ad) {
                this.setState({
                    categoryId: this.props.ad.parent_id,
                    subCategories: result.data.data
                });

            } else {
                this.setState({
                    subCategories: result.data.data
                });
            }
            
        } else {
            
            helpers.toastify('error', 'Sub Categories Failed to Populate !');
        }
    }

    adFieldsMapper = ad => {
        this.setState({
            categoryId: ad.parent_id,
            subCategoryId: ad.category_id,
            title: ad.title,
            description: ad.details,
            type: ad.Type.toString(),
            price: ad.price,
            negotiable: ad.is_negotiable,
            name: ad.posted_by,
            email: ad.posted_by_email,
            phone: ad.phone,
            phoneHidden: ad.is_phone_hidden,
            address: ad.Address,
            fbProfile: ad.fprofile,
            pictures: ad.pictures,
            city: ad.City
        })
    }

    adCustomFieldsMapper = cf_fields => {
        
        
        const customFields = Object.assign({}, this.state.customFields);

        cf_fields.forEach(cf => {
            if (cf.type === "checkbox_multiple") {
                Object.keys(cf.value).forEach(key => {
                    const field_id = cf.id;
                    const id = cf.value[key]['_id'];
                    if (_.isEmpty(customFields[field_id])) {
                        customFields[field_id] = Object.assign({}, []);
                    }
                    customFields[field_id][id] = id;
                });
            }
    
            else if (cf.type === "checkbox") {
                customFields[cf.id] = cf.id; 
            }
    
            else if (cf.type === "file") {
                customFields[cf.id] = cf.files
            }
    
            else {
                customFields[cf.id] = cf.value;
            }
        });

        this.setState({
            customFields
        });

    }

    changeCustomFieldHandler = event => {

        // console.log(event.target);

        console.log(event.target.checked);

        // console.log(event.target.attributes.getNamedItem('labelid'));
        console.log(this.state.customFields);
        const customFields = Object.assign({}, this.state.customFields);

        // console.log(customFields);

        if (event.target.type === 'checkbox' && event.target.attributes.getNamedItem('labelid')) {

            if (event.target.checked) {
                
                if (_.isEmpty(customFields[event.target.id])) {
                    customFields[event.target.id] = Object.assign({}, []);
                }

                customFields[event.target.id][event.target.attributes.getNamedItem('labelid').value] = event.target.attributes.getNamedItem('labelid').value;
            
            } else {
                
                delete customFields[event.target.id][event.target.attributes.getNamedItem('labelid').value];
                if (Object.keys(customFields[event.target.id]).length === 0) {
                    delete customFields[event.target.id];
                }

            }
            

        } else if (event.target.type === 'checkbox') {

            customFields[event.target.id] = event.target.id;

        } else if (event.target.type === 'file') {

            customFields[event.target.id] = event.target.files;

        } else {

            customFields[event.target.id] = event.target.value;
        }

        this.setState({
            customFields
        });
        
    }

    clickCustomFieldHandler = event => {

        const customFields = Object.assign({}, this.state.customFields);
        
        customFields[event.target.id] = event.target.value;

        this.setState({
            customFields
        });
        
    }

    submitAdHandler = async event => {
        event.preventDefault();
    
        const ad = {
            parent_id: this.state.categoryId,
            category_id: this.state.subCategoryId,
            title: this.state.title,
            description: this.state.description,
            price: this.state.price,
            negotiable: this.state.negotiable,
            post_type_id: this.state.type,
            contact_name: this.state.name,
            email: this.state.email,
            phone: this.state.phone,
            phone_hidden: this.state.phoneHidden,
            address: this.state.address,
            fb_profile: this.state.fbProfile,
            cf: Object.assign({}, this.state.customFields),
            country_code: this.props.country.country_code,
            city_id: this.state.city,
            pictures: this.state.pictures
        }

        console.log('ad object', ad);

        let result;
        
        if (this.props.title === "Update") {
            if (localStorage.getItem('token')) {
                result = await updateAd(localStorage.getItem('token'), this.props.ad.id, ad);
            }
            this.props.close();
        } else {
            result = await postAd(ad);
        }
        
        
        if (result.status === 201 || result.status === 200) {

            if (this.props.title === "Update") {
                helpers.toastify('success', 'Ad has been updated Successfully !');
            } else {
                helpers.toastify('success', 'Ad has been posted Successfully !');
            }

            this.clearFormControls();

        } else {

            helpers.toastify('error', 'Ad Posting Failed !');
        }
    }

    getBase64(file) {

        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (function () {

            const pictures = [...this.state.pictures];
            
            pictures.push(reader.result);
            
            this.setState({
                pictures
            });
            
        }).bind(this);
    }


    changeFileHandler = event => {

        this.setState({
            pictures: []
        });

        for (let i = 0; i < event.target.files.length; i++) {
            this.getBase64(event.target.files[i]);
        }

    }

    UNSAFE_componentWillReceiveProps(props) {
        console.log('props', props);
        
        if (!_.isEmpty(props.categories) && _.isEmpty(this.state.categories)) {

            helpers.toastify('success', 'Categories Loaded Successfully !');

            this.setState({
                categories: props.categories
            });
        }

        if (props.customFields) {
            
            this.setState({
                cf: props.customFields
            })
        }
    }

    clearFormControls = () => {

        this.setState({
            categoryId: '',
            subCategoryId: '',
            city: '',
            type: '',
            title: '',
            description: '',
            price: '',
            negotiable: null,
            name: '',
            email: '',
            phone: '',
            phoneHidden: null,
            address: '',
            fbProfile: '',
            cf: [],
            customFields: [],
            pictures: []
        });
    }

    render () {

        console.log('custom fields', this.state.customFields);
        
        return (
            
            <form onSubmit={event => this.submitAdHandler(event)}>
                <MDBContainer>
                    <MDBRow>
                        <MDBCol md="6" className="offset-md-3">
                            <div className="AdForm">
                                <h2>{this.props.ad ? 'Update your ad' : 'Post your ad'}</h2>
                                <div className="formElement form-group">
                                    <label htmlFor="category">Category</label>
                                    <div>
                                        <select 
                                            required
                                            className="browser-default custom-select" 
                                            onChange={event => this.changeCategoryHandler(event)} 
                                            value={this.state.categoryId}>
                                                <option value="">Select a Category</option>
                                                { this.state.categories && this.state.categories.map(category => (
                                                    <option 
                                                        key={category.id} 
                                                        value={category.id} 
                                                    >
                                                        {category.title}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="formElement form-group">
                                    <label htmlFor="subCategory">SubCategory</label>
                                    <div>
                                        <select 
                                            required
                                            className="browser-default custom-select" 
                                            onChange={event => this.setState({ subCategoryId: event.target.value })} 
                                            value={this.state.subCategoryId}
                                            disabled={this.state.subCategories.length && this.state.categoryId ? false : true }>
                                                <option value="">Select a sub-category</option>
                                                { this.state.subCategories && this.state.subCategories.map(subCategory => (
                                                    <option 
                                                        key={subCategory.id} 
                                                        value={subCategory.id} 
                                                    >
                                                        {subCategory.title}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="formElement form-group">
                                    <label htmlFor="title">Ad Title</label>
                                    <input type="text" required name="title" className="form-control" value={this.state.title} onChange={e => this.setState({ title: e.target.value })} />
                                </div>
                                <div className="formElement form-group">
                                    <label htmlFor="description">Ad Description</label>
                                    <textarea name="description" required className="form-control" value={this.state.description} onChange={e => this.setState({ description: e.target.value })}></textarea>
                                </div>
                                
                                { this.state.cf && this.state.cf.map((customField, index) => {
                                    if (this.props.ad) {
                                        return (
                                            <CustomField key={index} {...customField} cfUpdatedValues={this.state.customFields} changed={this.changeCustomFieldHandler} />
                                        )
                                    } else {
                                        return (
                                            <CustomField key={index} {...customField} cfUpdatedValues={this.state.customFields} changed={this.changeCustomFieldHandler} />
                                        )
                                    }
                                    
                                    
                                })}
                                
                                <MDBRow>
                                    <MDBCol md="8">
                                        <div className="formElement form-group">
                                            <label htmlFor="price">Set Price</label>
                                            <div className="input-group">
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text" id="basic-addon">
                                                        <MDBIcon icon="dollar-sign" />
                                                    </span>
                                                </div>
                                                <input type="number" className="form-control" value={this.state.price ? this.state.price : this.props.ad ? this.props.ad.price : ''} onChange={e => this.setState({ price: e.target.value })} />
                                            </div>
                                        </div>
                                    </MDBCol>
                                    <MDBCol md="4">
                                        <div className="formElement form-group">
                                            <Checkbox checked={this.state.negotiable} onChange={e => this.setState({ negotiable: e.target.checked })} /> Negotiable
                                        </div>
                                    </MDBCol>
                                </MDBRow>
                                <div className="formElement form-group">
                                    <label className="radio-inline"><input type="radio" name="type" value="1" checked={this.state.type === '1'} onChange={e => this.setState({ type: e.target.value })} required />Private</label>
                                    <label className="radio-inline"><input type="radio" name="type" value="2" checked={this.state.type === '2'} onChange={e => this.setState({ type: e.target.value })} required />Professional</label>
                                </div>
                                <div className="formElement form-group">
                                    <label htmlFor="name">Contact Name</label>
                                    <input type="text" required name="name" className="form-control" value={this.state.name} onChange={e => this.setState({ name: e.target.value })} />
                                </div>
                                <div className="formElement form-group">
                                    <label htmlFor="email">Email</label>
                                    <input type="email" id="email" name="email" className="form-control" value={this.state.email} onChange={e => this.setState({ email: e.target.value })} />
                                </div>
                                <MDBRow>
                                    <MDBCol md="8">
                                        <div className="formElement form-group">
                                            <label htmlFor="phone">Phone</label>
                                            <input type={this.state.phoneHidden ? 'password' : 'tel'} name="phone" className="form-control" value={this.state.phone} onChange={e => this.setState({ phone: e.target.value })} />
                                        </div>
                                    </MDBCol>
                                    <MDBCol md="4">
                                        <div className="formElement form-group">
                                            <Checkbox checked={this.state.phoneHidden} onChange={e => this.setState({ phoneHidden: e.target.checked })} /> Hidden
                                        </div>
                                    </MDBCol>
                                </MDBRow>
                                <div className="formElement form-group">
                                    <label htmlFor="address">Address</label>
                                    <input type="text" name="address" className="form-control" value={this.state.address} onChange={e => this.setState({ address: e.target.value })} />
                                </div>

                                <div className="formElement form-group">
                                    <label htmlFor="fbProfile">Facebook Profile</label>
                                    <input type="text" name="fbProfile" className="form-control" value={this.state.fbProfile} onChange={e => this.setState({ fbProfile: e.target.value })} />
                                </div>

                                <div className="formElement form-group">
                                    <label htmlFor="city">City</label>
                                    <div>
                                        <select 
                                            required
                                            className="browser-default custom-select"
                                            value={this.state.city}
                                            onChange={event => this.setState({ city: event.target.value })}>
                                                <option value="">Select City</option>
                                                { _.isArray(this.props.cities) && this.props.cities.map(city => (
                                                    <option 
                                                        key={city.id} 
                                                        value={city.id} 
                                                    >
                                                        {city.name}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="formElement form-group">
                                    <label htmlFor="photosID">Upload Photos</label>
                                    <div className="custom-file">
                                        <input type="file" className="custom-file-input" id="pictures" onChange={this.changeFileHandler} multiple />
                                        <label className="custom-file-label" htmlFor="inputGroupFile01">{ this.state.pictures.length ? this.state.pictures.length + ' file(s) selected' : 'Choose file' }</label>
                                    </div>
                                </div>
                                <div className="registerBtnRow">
                                    <MDBBtn type="submit" className="themeBtnStyle">{this.props.ad ? 'Update Ad' : 'Post Ad'}</MDBBtn>
                                </div>
                            </div>
                        </MDBCol>
                    </MDBRow>
                </MDBContainer>
            </form>
        );
    }
};

function mapStateToProps({ country, cities, categories, customFields }) {
    return {
        country,
        cities,
        categories,
        customFields
    }
}


export default connect(mapStateToProps, { getCategories, getCustomFieldsByCategoryId })(AdPosting);