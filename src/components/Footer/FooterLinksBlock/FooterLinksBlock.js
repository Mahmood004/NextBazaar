import React from 'react';
import Aux from '../../../hoc/Aux';
import styles from './FooterLinksBlock.module.css';
import { MDBContainer, MDBRow, MDBCol, MDBIcon } from "mdbreact";

const FooterLinksBlock = (props) => (
    <Aux>
        <div className={styles.linksWrapper}>
            <MDBContainer>
                <MDBRow className={styles.linksBlock}>
                    <MDBCol md="3">
                        <div className={styles.footerBlock}>
                            <h2>Popular Categories</h2>
                            <ul>
                                <li><a href="/">Real Estate</a></li>
                                <li><a href="/">Cars and Automotives</a></li>
                                <li><a href="/">Mobile Phone and Tablets</a></li>
                                <li><a href="/">Services</a></li>
                            </ul>
                        </div>
                    </MDBCol>
                    <MDBCol md="2">
                        <div className={styles.footerBlock}>
                            <h2>About us</h2>
                            <ul>
                                <li><a href="/">Anti-Scam</a></li>
                                <li><a href="/">Terms</a></li>
                                <li><a href="/">FAQ</a></li>
                                <li><a href="/">Privacy</a></li>
                            </ul>
                        </div>
                    </MDBCol>
                    <MDBCol md="2">
                        <div className={styles.footerBlock}>
                            <h2>Contact & Sitemap</h2>
                            <ul>
                                <li><a href="/">Contact us</a></li>
                                <li><a href="/">Sitemap</a></li>
                                <li><a href="/">Countries</a></li>
                            </ul>
                        </div>
                    </MDBCol>
                    <MDBCol md="2">
                        <div className={styles.footerBlock}>
                            <h2>My Account</h2>
                            <ul>
                                <li><a href="/">Login In</a></li>
                                <li><a href="/">Register</a></li>
                            </ul>
                        </div>
                    </MDBCol>
                    <MDBCol md="3">
                        <div className={[styles.footerBlock, styles.socialLinksBlock].join(' ')}>
                            <h2>Follow us</h2>
                            <ul>
                                <li><a href="/"><MDBIcon fab icon="facebook-f" size="2x" /></a></li>
                                <li><a href="/"><MDBIcon fab icon="twitter" size="2x" /></a></li>
                                <li><a href="/"><MDBIcon fab icon="instagram" size="2x" /></a></li>
                            </ul>
                            <div className={styles.appIcons}>
                                <a href="/" className={styles.appStore}>&nbsp;</a>
                                <a href="/" className={styles.playStore}>&nbsp;</a>
                            </div>
                        </div>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
        </div>
    </Aux>
);

export default FooterLinksBlock;