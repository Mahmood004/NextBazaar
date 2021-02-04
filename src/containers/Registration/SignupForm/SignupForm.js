import React, { Component } from 'react';
import { MDBContainer, MDBRow, MDBCol, MDBBtn } from 'mdbreact';
import { hosted_ip_address } from '../../../utils/development.json';
import styles from './SignupForm.module.css';
import { toast } from 'react-toastify';
import { signup } from '../../../actions';
import { Link } from 'react-router-dom';
import _ from 'lodash';

class SignupForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            email: {
                value: '',
                error: null
            },
            name: {
                value: '',
                error: null
            },
            password: {
                value: '',
                error: null
            },
            passwordConfirmation: {
                value: '',
                error: null
            }
        }
    }

    checkValidation = () => {
       
        let flag = false;
        if (!this.state.email.value) {
            
            this.setState({
                email: {
                    ...this.state.email,
                    error: 'Email field is mandatory'
                }
            });
            flag = true;
        }
        if (!this.state.name.value) {
            
            this.setState({
                name: {
                    ...this.state.name,
                    error: 'Name field is mandatory'
                }
            });
            flag = true;
        }
        if (!this.state.password.value) {
            
            this.setState({
                password: {
                    ...this.state.password,
                    error: 'Password field is mandatory'
                }
            });
            flag = true;
        }
        if (this.state.password.value && _.size(this.state.password.value) < 6) {
            this.setState({
                password: {
                    ...this.state.password,
                    error: 'Password field must be six characters long'
                }
            });
            flag = true;
        }
        if (!this.state.passwordConfirmation.value) {
            
            this.setState({
                passwordConfirmation: {
                    ...this.state.passwordConfirmation,
                    error: 'Confirm Password field is mandatory'
                }
            });
            flag = true;
        }
        if (this.state.password.value && this.state.passwordConfirmation.value && this.state.passwordConfirmation.value !== this.state.password.value) {
            this.setState({
                passwordConfirmation: {
                    ...this.state.passwordConfirmation,
                    error: 'Confirm Password must match to Password'
                }
            });
            flag = true;
        }

        return flag;
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
        this.setState({
            loading: true
        })
        let result = await this.checkValidation();

        if (!result) {
            const user = {
                email: this.state.email.value,
                name: this.state.name.value,
                password: this.state.password.value,
                password_confirmation: this.state.passwordConfirmation.value,
                hosted_ip_address
            }
    
            const result = await signup(user);
            console.log(result);

            if (result.status && result.status === 200) {

                if (result.status && result.status === 200) {
                    this.setState({
                        loading: false
                    });

                    this.props.history.push('/');
                }

            } else {
                this.setState({
                    loading: false
                });
                
                toast.error(result.message, {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 3000
                });
            }
        }
        
    }

    render() {
        
        return (
            
            <div className={styles.RegistrationContainer}>
                <MDBContainer>
                    <form onSubmit={this.submitHandler}>
                        <MDBRow>
                            <MDBCol md="6" className="offset-md-3">
                                <div className={styles.RegisterForm}>
                                    <h2>Register yourself</h2>
                                    <div className={[styles.formElement, 'form-group'].join(' ')}>
                                        <label htmlFor="email">Email address</label>
                                        <input type="email" name="email" onChange={e => this.setState({ email: { value: e.target.value, error: null } })} onBlur={() => this.validateField('Email')} className="form-control" />
                                        <span style={{ color: 'red', fontSize: 'small' }}>{this.state.email.error && this.state.email.error}</span>
                                    </div>
                                    <div className={[styles.formElement, 'form-group'].join(' ')}>
                                        <label htmlFor="name">Name</label>
                                        <input type="text" name="name" onChange={e => this.setState({ name: { value: e.target.value, error: null } })} onBlur={() => this.validateField('Name')} className="form-control" />
                                        <span style={{ color: 'red', fontSize: 'small' }}>{this.state.name.error && this.state.name.error}</span>
                                    </div>
                                    <div className={[styles.formElement, 'form-group'].join(' ')}>
                                        <label htmlFor="password">Password</label>
                                        <input type="password" name="password" onChange={e => this.setState({ password: { value: e.target.value, error: null } })} onBlur={() => this.validateField('Password')} className="form-control" />
                                        <span style={{ color: 'red', fontSize: 'small' }}>{this.state.password.error && this.state.password.error}</span>
                                    </div>
                                    <div className={[styles.formElement, 'form-group'].join(' ')}>
                                        <label htmlFor="passwordConfirmation">Confirm Password</label>
                                        <input type="password" name="passwordConfirmation" onChange={e => this.setState({ passwordConfirmation: { value: e.target.value, error: null } })} onBlur={() => this.validateField('Password Confirmation')} className="form-control" />
                                        <span style={{ color: 'red', fontSize: 'small' }}>{this.state.passwordConfirmation.error && this.state.passwordConfirmation.error}</span>
                                    </div>
                                    <div className={styles.registerBtnRow}>
                                        <MDBBtn type="submit" className={styles.loginBtn} disabled={this.state.loading ? true : false}>Sign Up</MDBBtn>
                                        
                                        <div>
                                            Already registered? 
                                            <Link className="btn btn-link Ripple-parent" to="login">Click here</Link>
                                        </div>
                                    </div>
                                </div>
                            </MDBCol>
                        </MDBRow>
                    </form>
                </MDBContainer>
            </div>
        )
    }
}

export default SignupForm