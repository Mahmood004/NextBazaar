import React, {Component} from 'react';

import Aux from '../../hoc/Aux';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import styles from './Layout.module.css';

class Layout extends Component {

    render () {
        return (
            <Aux>
                <Header 
                    isSearchShow={this.props.isSearchShow}
                    adFormTrigger={this.props.adFormTrigger} />

                    <main className={styles.mainContent}>
                        {this.props.children}
                    </main>

                <Footer />
            </Aux>
        );
    }
}

export default Layout;