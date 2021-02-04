import React from 'react';

const DepartmentSearchBar = props => {

    return (

        <div className="row" style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#F2F2F2', height: 35, padding: '0 20px'}}>
                        
            <div className="dropdown">
                <button className="dropbtn">
                    <i className="fa fa-bars" style={{marginRight: 10}}></i>
                    Shop By Department
                    <i className="fa fa-caret-down" style={{marginLeft: 10}}></i>
                </button>
                <div className="dropdownContent">
                    
                    { props.data && props.data.map(category => (
                        <span key={category.id}>
                            <a>{category.title}</a>
                            <i className="fa fa-chevron-right" style={{float: 'right', lineHeight: 0.4}} ></i>
                            <div className="subDropdown">
                                { category.sub_categories.map(subCategory => (
                                    <h6 style={{cursor: 'pointer'}} key={subCategory.id}>{subCategory.title}</h6>
                                ))}
                            </div>
                        </span>
                    ))}
                    
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
    )
}

export default DepartmentSearchBar