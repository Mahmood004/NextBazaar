import React from 'react';
import { MDBBtn } from 'mdbreact';
import _ from 'lodash';

const TopSearchBar = props => {

    return (

        <div className="row" style={{marginLeft: 8}}>
            <div className="col-md-3">
                <div className="formElement form-group">
                    <select className="browser-default custom-select" onChange={e => props.changed(e, 'city_id')}>
                        <option value="">Where?</option>
                        { props.cities && props.cities.map(city => (
                            <option key={city.id} value={city.id}>{city.name}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="col-md-3">
                <div className="formElement form-group">
                    <select className="browser-default custom-select" onChange={e => props.changed(e, 'parent_id')}>
                        <option value="">Select Category</option>
                        { props.categories && props.categories.map(category => (
                            <option key={category.id} value={category.id}>{category.title}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="col-md-5">
                <div className="formElement form-group">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Find Cars, Mobile Phones and more..."
                        onChange={e => props.changed(e, 'title')}
                    />
                </div>
            </div>
            <div className="col-md-1">
                <div className="formElement form-group">
                <MDBBtn type="button" className="themeBtnStyle btnStyle" onClick={props.clicked}>Search</MDBBtn>
                </div>
            </div>
        </div>
    )

}

export default TopSearchBar;