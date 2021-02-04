import React from 'react';
import Aux from '../../hoc/Aux';
import styles from './Footer.module.css';
import FooterLinksBlock from './FooterLinksBlock/FooterLinksBlock';
import FooterCopyrightBlock from './FooterCopyrightBlock/FooterCopyrightBlock';

const Footer = (props) => (
    <Aux>
        <div className={styles.footerContainer}>

            <FooterLinksBlock />

            <FooterCopyrightBlock />

        </div>
    </Aux>
);

export default Footer;