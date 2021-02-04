import React from 'react';
import { MDBRow, MDBCol, MDBDropdown, MDBDropdownToggle, MDBDropdownMenu, MDBDropdownItem } from "mdbreact";
import { Link } from 'react-router-dom';

const TopLinks = (props) => (
    
    <MDBRow className={props.styles.linksBlock}>
        
        <MDBCol md="4">
            {props.logo}
        </MDBCol>
        
        <MDBCol md="8">
            <div className={props.styles.headerRight}>
                
                <div className={props.styles.countrySelection}>
                    {props.flagDropDown}
                </div>

                <div className={props.styles.lanSelection}>
                    <MDBDropdown size="sm" className={props.styles.lanDropDown}>
                        <MDBDropdownToggle className={props.styles.removeExtraStyles}>{props.language.toUpperCase()}</MDBDropdownToggle>
                        <MDBDropdownMenu className={props.styles.ddMenu}>
                            <MDBDropdownItem className={props.styles.ddMenuItem} onClick={props.languageChange}>EN</MDBDropdownItem>
                            <MDBDropdownItem className={props.styles.ddMenuItem} onClick={props.languageChange}>FR</MDBDropdownItem>
                            <MDBDropdownItem className={props.styles.ddMenuItem} onClick={props.languageChange}>SP</MDBDropdownItem>
                        </MDBDropdownMenu>
                    </MDBDropdown>
                </div>

                <div className={props.styles.themelinkBtn}>
                    { !props.authState.auth && (
                        <>
                            <Link className="btn btn-default Ripple-parent Header_removeExtraStyles__3p6cX" to="/signup">Register</Link>
                            <span>or</span>
                            <Link className="btn btn-default Ripple-parent Header_removeExtraStyles__3p6cX" to="/">Sign In</Link>
                        </>
                    )}
                </div>

                <div className={props.styles.themeBtn}>
                    
                    <Link className="btn btn-default" to="/ads">Ads</Link>
                    { props.authState.auth && (
                        <Link className="btn btn-default" to="/adPost">Post ad</Link>
                    )}
                </div>

            </div>

        </MDBCol>

    </MDBRow>
);

export default TopLinks;