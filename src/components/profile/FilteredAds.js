import React from 'react';
import config from '../../utils/development.json';
import { Checkbox } from 'antd';
import { fakeAuthCentralState } from '../../actions';

const FilteredAds = props => {

    return (
        <div className="row ad-selected-navbar-result" style={{marginTop: 20}}>
                            
            { props.ads && props.ads.map((ad, index) => (

                <div key={ad.id} className="card" style={props.rootDivStyling}>
                    <img className="card-img-top" onClick={() => window.open(`ads/ad/${ad.id}`, "_blank")} src={ad.pictures.length ? config.baseUrl + '/storage/' + ad.pictures[0].name : "http://mongostaging.demo.commersys.com/storage/app/default/picture.jpeg"} alt="ad_image" style={{cursor: 'pointer'}} />
                    <div className="card-body">
                        <span style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                            <span>Rs <strong style={{fontSize: 20}}>{+ad.price || '13,500'}</strong></span>
                            { props.checkbox && props.markedAll && <Checkbox checked={props.markedAll ? true : false} /> }
                            { props.checkbox && !props.markedAll && <Checkbox onChange={e => props.checked(e, ad.id)} /> }
                            { (props.favIcon && fakeAuthCentralState.isAuthenticated === true) ? props.favAds.find(favAd => favAd.post_id === ad.id) ? <i className="fa fa-heart"></i> : <i className="icon-heart-empty" onClick={e => props.addToFavourite(e, ad)}></i> : props.favIcon ? <i className="icon-heart-empty" onClick={e => props.addToFavourite(e, ad)}></i> : '' }
                        </span>
                        <span style={{display: 'block'}} className="card-text mt-10">{ad.title}</span>
                        <span style={{color: '#fa5b23'}} className="fs-12"><i>{ad.details.length > 100 ? ad.details.substring(0, 100) + " ..." : ad.details}</i></span>
                        <span style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}} className="mt-20 fs-12 cl-gray">
                            <span>{ad.Address || 'Abid Market, Lahore'}</span>
                            <span>Jan 05</span>
                        </span>
                        { props.actionIcons && (
                            <>
                                <hr style={{ margin: '15px 0' }}/>
                                <div style={{display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', color: 'gray', height: 30}}>
                                    <i style={{cursor: 'pointer'}} className="fa fa-edit" onClick={() => props.openModal(ad)}></i>
                                    <i style={{cursor: 'pointer'}} className="fa fa-trash-alt" onClick={e => props.deleted(e, ad.id)}></i>
                                    <i style={{cursor: 'pointer'}} className="fa fa-eye-slash" onClick={() => window.open(`ads/ad/${ad.id}` , "_blank")}></i>
                                </div>
                            </>
                        )}
                    </div>
                </div>   
                
            ))}
                
            {/* <div className="card" style={{width: '31.7%', marginLeft: 15, marginTop: 15}}>
                <img className="card-img-top" src="https://images.pexels.com/photos/414612/pexels-photo-414612.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" alt="ad_image" />
                <div className="card-body">
                    <span style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <span>Rs <strong style={{fontSize: 20}}>13,500</strong></span>
                        <input type="checkbox" />
                    </span>
                    <span style={{display: 'block', marginTop: 10}}className="card-text">Samsung Galaxy Note 4</span>
                    <span style={{color: '#fa5b23', fontSize: 12}}><i>Mobile Phones</i></span>
                    <span style={{color: 'gray', fontSize: 12, marginTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <span>Abid Market, Lahore</span>
                        <span>Jan 05</span>
                    </span>
                    <hr/>
                    <div style={{display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', color: 'gray', height: 30}}>
                        <i className="fa fa-edit" onClick={props.click}></i>
                        <i className="fa fa-trash-alt"></i>
                        <i className="fa fa-eye-slash"></i>
                    </div>
                </div>
            </div>
            <div className="card" style={{width: '31.6%', marginLeft: 15, marginTop: 15}}>
                <img className="card-img-top" src="https://images.pexels.com/photos/414612/pexels-photo-414612.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" alt="ad_image" />
                <div className="card-body">
                    <span style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <span>Rs <strong style={{fontSize: 20}}>13,500</strong></span>
                        <input type="checkbox" />
                    </span>
                    <span style={{display: 'block', marginTop: 10}}className="card-text">Samsung Galaxy Note 4</span>
                    <span style={{color: '#fa5b23', fontSize: 12}}><i>Mobile Phones</i></span>
                    <span style={{color: 'gray', fontSize: 12, marginTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <span>Abid Market, Lahore</span>
                        <span>Jan 05</span>
                    </span>
                    <hr/>
                    <div className="icons-list" style={{display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', color: 'gray', height: 30}}>
                        <i className="fa fa-edit" onClick={props.click}></i>
                        <i className="fa fa-trash-alt"></i>
                        <i className="fa fa-eye-slash"></i>
                    </div>
                </div>
            </div>
            <div className="card" style={{width: '31.6%', marginLeft: 15, marginTop: 15}}>
                <img className="card-img-top" src="https://images.pexels.com/photos/414612/pexels-photo-414612.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" alt="ad_image" />
                <div className="card-body">
                    <span style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <span>Rs <strong style={{fontSize: 20}}>13,500</strong></span>
                        <input type="checkbox" />
                    </span>
                    <span style={{display: 'block', marginTop: 10}}className="card-text">Samsung Galaxy Note 4</span>
                    <span style={{color: '#fa5b23', fontSize: 12}}><i>Mobile Phones</i></span>
                    <span style={{color: 'gray', fontSize: 12, marginTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <span>Abid Market, Lahore</span>
                        <span>Jan 05</span>
                    </span>
                    <hr/>
                    <div className="icons-list" style={{display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', color: 'gray', height: 30}}>
                        <i className="fa fa-edit" onClick={props.click}></i>
                        <i className="fa fa-trash-alt"></i>
                        <i className="fa fa-eye-slash"></i>
                    </div>
                </div>
            </div>
            <div className="card" style={{width: '31.6%', marginLeft: 15, marginTop: 15}}>
                <img className="card-img-top" src="https://images.pexels.com/photos/414612/pexels-photo-414612.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" alt="ad_image" />
                <div className="card-body">
                    <span style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <span>Rs <strong style={{fontSize: 20}}>13,500</strong></span>
                        <input type="checkbox" />
                    </span>
                    <span style={{display: 'block', marginTop: 10}}className="card-text">Samsung Galaxy Note 4</span>
                    <span style={{color: '#fa5b23', fontSize: 12}}><i>Mobile Phones</i></span>
                    <span style={{color: 'gray', fontSize: 12, marginTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <span>Abid Market, Lahore</span>
                        <span>Jan 05</span>
                    </span>
                    <hr/>
                    <div className="icons-list" style={{display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', color: 'gray', height: 30}}>
                        <i className="fa fa-edit" onClick={props.click}></i>
                        <i className="fa fa-trash-alt"></i>
                        <i className="fa fa-eye-slash"></i>
                    </div>
                </div>
            </div>
            <div className="card" style={{width: '31.6%', marginLeft: 15, marginTop: 15}}>
                <img className="card-img-top" src="https://images.pexels.com/photos/414612/pexels-photo-414612.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" alt="ad_image" />
                <div className="card-body">
                    <span style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <span>Rs <strong style={{fontSize: 20}}>13,500</strong></span>
                        <input type="checkbox" />
                    </span>
                    <span style={{display: 'block', marginTop: 10}}className="card-text">Samsung Galaxy Note 4</span>
                    <span style={{color: '#fa5b23', fontSize: 12}}><i>Mobile Phones</i></span>
                    <span style={{color: 'gray', fontSize: 12, marginTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <span>Abid Market, Lahore</span>
                        <span>Jan 05</span>
                    </span>
                    <hr/>
                    <div className="icons-list" style={{display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', color: 'gray', height: 30}}>
                        <i className="fa fa-edit" onClick={props.click}></i>
                        <i className="fa fa-trash-alt"></i>
                        <i className="fa fa-eye-slash"></i>
                    </div>
                </div>
            </div> */}
            
        </div>
    )
}

export default FilteredAds;