import React from 'react';
import siteLogo from '../../assets/images/nextbazaar-logo.png';
import siteFooterLogo from '../../assets/images/nextbazaar-logo2.png';
import styles from './Logo.module.css';

const Logo = (props) => (
    <div className={styles.logoWrap}>
        <a href={props.logoLink}>
            {props.logoType==='footer' ? (
                <img src={siteFooterLogo} alt="NextBazaar Logo" />
            ) : (
                <img src={siteLogo} alt="NextBazaar Logo" />
            )}
        </a>
    </div>
);

export default Logo;