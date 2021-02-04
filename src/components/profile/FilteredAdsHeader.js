import React from 'react';
import { Checkbox } from 'antd';

const FilteredAdsHeader = props => {

    return (
        <div className="ad-selected-navbar-header">
            <h4>{props.title}</h4>
            <span className="input-with-icon">
                <input className="form-control" placeholder="Search" type="text" style={{width: '250px'}} />
                <i className="fa fa-search"></i>
            </span>
            <span>
                <Checkbox checked={props.marked ? true : false} onChange={props.markedAll} />
                <label htmlFor="selectAll" style={{padding: '0 10px', borderRight: '1px solid #ddd', color: 'gray', fontWeight: 100}}>Select all:</label>
                <i style={{paddingLeft: 10, color: 'gray', cursor: 'pointer'}} className="fa fa-trash-alt" onClick={e => props.deleted(e)}></i>
            </span>
        </div>
    )
}

export default FilteredAdsHeader;