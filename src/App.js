import React, { Component } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';
import './App.css';
import { BrowserRouter, Route, Redirect } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import SigninForm from './containers/Registration/SigninForm/SigninForm';
import SignupForm from './containers/Registration/SignupForm/SignupForm';
import AdListing from './components/ads/listing/AdListing';
import AdPosting from './components/ads/posting/AdPosting';
import AdSearching from './components/ads/searching/AdSearching';
import AdComponent from './components/ads/viewAd/AdComponent';
import Profile from './components/profile/Profile';
import { fakeAuthCentralState } from './actions';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'antd/dist/antd.css';


const ProtectedRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={(props) => (
    fakeAuthCentralState.isAuthenticated === true ? 
      <Component {...props} /> : <Redirect to={{ pathname: '/', state: { from: props.location }}} />   
  )} />
);

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      visibleSearchBar: true,
      isAdFormShown: true
    }
    toast.configure();
  }

  adFormShowHandler = () => {
    this.setState({isAdFormShown: !this.state.isAdFormShown});
  };

  render() {
    return (
      <div className="next-container">
        <BrowserRouter>
          <div>
              <Header />
              <Route exact path="/" render={(props) => (fakeAuthCentralState.isAuthenticated ? <Redirect to="/profile" /> : <SigninForm {...props} /> )} />
              <Route exact path="/signup" render={(props) => (fakeAuthCentralState.isAuthenticated ? <Redirect to="/profile" /> : <SignupForm {...props} /> )} />
              <Route exact path="/ads" component={AdListing} />
              <ProtectedRoute exact path="/adPost" component={AdPosting} />
              <ProtectedRoute exact path="/profile" component={Profile} />
              <Route exact path="/search" component={AdSearching} />
              <Route exact path="/ads/ad/:id" component={AdComponent} />
              <Footer />
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
