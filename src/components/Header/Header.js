import React, {Component} from 'react';
import Aux from '../../hoc/Aux';
import styles from './Header.module.css';
import Logo from '../Logo/Logo';
import { MDBContainer } from "mdbreact";
import ReactFlagsSelect from 'react-flags-select';
import '../../assets/css/react-flags-select.css';
import TopLinks from './TopLinks/TopLinks';
import { connect } from 'react-redux';
import { fakeAuthCentralState, authenticate, fetchCountries, fetchCitiesByCountryCode, storeCountry, getCategories, getAuthUser } from '../../actions';
import _ from 'lodash';


class Header extends Component {

    state = {
        language: 'en',
        countries: []

    };

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    onFlagSelect = (selection) => {
        this.props.fetchCitiesByCountryCode(selection);
        this.props.storeCountry({country_code: selection});
    };

    onChangeLanguage = (event) => {
        let selectedLanguage = event.currentTarget.textContent.toLowerCase();
        if (selectedLanguage!==this.state.language) {
            this.setState({language: selectedLanguage});
        }
    };

    componentDidMount() {
        this.props.fetchCountries();
        this.props.getCategories();
        this.props.authenticate();
        if (fakeAuthCentralState.isAuthenticated) {
            this.props.getAuthUser(localStorage.getItem('token'));
        }
    }

    UNSAFE_componentWillReceiveProps(props) {
        console.log('props', props);
        if (!_.isEmpty(props.countries) && _.isEmpty(this.state.countries)) {
            this.setState({
                countries: props.countries
            });
        }
    }

    render() {

        const countries = this.state.countries.map(country => country.id);

        const flagsComponent = <ReactFlagsSelect 
                                placeholder="Select Region"
                                countries={countries}
                                onSelect={this.onFlagSelect} />;

        const logoComponent = <Logo logoType={'header'} logoLink={'/'} />;

        return (
            <Aux>
                <div className={styles.headerContainer}>
                    <MDBContainer>
                        <TopLinks 
                            flagDropDown={flagsComponent} 
                            styles={styles}
                            logo={logoComponent}
                            language={this.state.language}
                            languageChange={this.onChangeLanguage}
                            adFormTrigger={this.props.adFormTrigger} 
                            authState={this.props.authState} />
                            
                    </MDBContainer>
                </div>
            </Aux>
        );
    }
}

function mapStateToProps({ countries, authState }) {
    return {
        countries,
        authState
    }
}

export default connect(mapStateToProps, { authenticate, fetchCountries, fetchCitiesByCountryCode, storeCountry, getCategories, getAuthUser })(Header);