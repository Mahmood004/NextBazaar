import React, { Component } from 'react';
import { MDBContainer, MDBRow, MDBCol, MDBIcon, MDBBtn } from 'mdbreact';
import Aux from '../../../hoc/Aux';
import styles from './SigninForm.module.css';
import { withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { login, authenticate, fakeAuthCentralState } from '../../../actions';
import { connect } from 'react-redux';
import helpers from '../../../utils/helpers';
import _ from 'lodash';

class SigninForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: {
                value: '',
                error: null
            },
            password: {
                value: '',
                error: null
            },
            signedIn: false
        }
    }

    checkValidation = () => {
       console.log(this.state);
       let error = false;
        
        if (!this.state.email.value) {
            
            this.setState({
                email: {
                    ...this.state.email,
                    error: 'Email field is mandatory'
                }
            });
            error = true;
        }
        if (!this.state.password.value) {
            
            this.setState({
                password: {
                    ...this.state.password,
                    error: 'Password field is mandatory'
                }
            });
            error = true;
        }

        return error;
    }

    validateField = key => {
        console.log(_.camelCase(key));
        if (!this.state[_.camelCase(key)].value) {

            this.setState({
                [_.camelCase(key)]: {
                    ...this.state[_.camelCase(key)],
                    error: `${key} field is mandatory`
                }
            })
            
        }
    }

    submitHandler = async event => {

        event.preventDefault();
        const result = await this.checkValidation();

        if (!result) {
            const user = {
                email: this.state.email.value,
                password: this.state.password.value
            }

            const result = await login(user);
            console.log(result);

            if (result.status && result.status === 200) {

                localStorage.setItem('token', result.data.token);
                fakeAuthCentralState.isAuthenticated = true;
                helpers.toastify('success', 'Successfully Logged In !');
                this.props.authenticate();
                this.props.history.push('/profile');

            } else {
                helpers.toastify('error', result.error);
            }
        }
    }

    render() {
        return (
            <div className={styles.RegistrationContainer}>       
                <MDBContainer>
                    <form onSubmit={this.submitHandler}>
                        <MDBRow>
                            <MDBCol md="7" className="offset-md-1">
                                <div className={styles.RegistrationForm}>
                                    <MDBRow>
                                        <MDBCol md="12">
                                            <h2>Sign In</h2>
                                            <div className={[styles.formElement, 'form-group'].join(' ')}>
                                                <label htmlFor="emailAddressID">Email address</label>
                                                <input type="email" name="email" onChange={e => this.setState({ email: { value: e.target.value, error: null } })} onBlur={() => this.validateField('Email')} className="form-control" />
                                                <span style={{ color: 'red', fontSize: 'small' }}>{this.state.email.error && this.state.email.error}</span>
                                            </div>
                                            <div className={[styles.formElement, 'form-group'].join(' ')}>
                                                <label htmlFor="passwordID">Password</label>
                                                <input type="password" name="password" onChange={e => this.setState({ password: { value: e.target.value, error: null } })} onBlur={() => this.validateField('Password')} className="form-control" />
                                                <span style={{ color: 'red', fontSize: 'small' }}>{this.state.password.error && this.state.password.error}</span>
                                            </div>
                                        </MDBCol>
                                    </MDBRow>

                                    <MDBRow>
                                        <MDBCol md="6">
                                            <div className={[styles.formElement, styles.customCheckbox, "custom-control custom-checkbox"].join(' ')}>
                                                <input type="checkbox" className="custom-control-input" name="signedIn" />
                                                <label className="custom-control-label" htmlFor="signedIn">keep me signed in</label>
                                            </div>
                                        </MDBCol>
                                        <MDBCol md="6" className="text-right">
                                            <a href="/" className={styles.forgetPass}>Forget your password?</a>
                                        </MDBCol>
                                    </MDBRow>
                                    <MDBRow className={styles.submitBtnRow}>
                                        <MDBCol md="4">
                                            <MDBBtn type="submit" className={[styles.themeBtnStyle, styles.loginBtn].join(' ')}>Sign In</MDBBtn>
                                        </MDBCol>
                                        <MDBCol md="8" className={styles.socialLoginLinks}>
                                            <Aux>
                                                <div className={styles.socialLoginText}>or <span>Sign In with</span></div>
                                                <div className={[styles.socialLoginIcon, styles.fbIcon].join(' ')}>
                                                    <a href="/"><MDBIcon fab icon="facebook-f" /></a>
                                                </div>
                                                <div className={[styles.socialLoginIcon, styles.gplusIcon].join(' ')}>
                                                    <a href="/"><MDBIcon fab icon="google-plus-g" /></a>
                                                </div>
                                            </Aux>
                                        </MDBCol>
                                    </MDBRow>    
                                </div>
                            </MDBCol>
                            <MDBCol md="3">
                                <div className={styles.signRightBlock}>
                                    <h3>Not registered yet?</h3>
                                    <p>Register now to post, edit, and manage ads. It’s quick, easy, and free!</p>
                                    <Link className="btn btn-default btn-lg Ripple-parent SigninForm_themeBtnStyle__s5OW0 btn-block" to="signup">Register Now</Link>
                                </div>
                                <div className={styles.signRightBlockTwo}>
                                    <h3>Protect your account</h3>
                                    <p>Ensure that whenever you sign in to NextBazaar, the Web Address in your browser starts with <a href="https://www.nextbazaar.com/">https://www.nextbazaar.com/</a></p>
                                </div>
                            </MDBCol>
                            
                        </MDBRow>
                    </form>
                </MDBContainer>   
            </div>
        )
    }
}

export default connect(null, { authenticate })(withRouter(SigninForm))