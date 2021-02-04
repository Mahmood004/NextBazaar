import React from 'react';
import { MDBContainer, MDBRow, MDBCol } from "mdbreact";
import Logo from '../../Logo/Logo';
import styles from './FooterCopyrightBlock.module.css';

const FooterCopyrightBlock = (props) => (
    <div className={styles.copyrightWrapper}>
        <MDBContainer>
            <MDBRow className={styles.copyrightRow}>
                <MDBCol md="6">
                    <Logo logoType={'footer'} logoLink={'/'} />
                </MDBCol>
                <MDBCol md="6">
                    <div className={[styles.copyright, 'text-right'].join(' ')}>
                        Copyright 2019 &copy; All Rights Reserved.
                    </div>
                </MDBCol>
            </MDBRow>
        </MDBContainer>
    </div>
);

export default FooterCopyrightBlock;