import React from 'react';
import { css } from 'emotion';
import FaTwitter from 'react-icons/lib/fa/twitter';
import FaFacebook from 'react-icons/lib/fa/facebook';
import FaGooglePlus from 'react-icons/lib/fa/google-plus';
import FaEnvelope from 'react-icons/lib/fa/envelope';
import FaPinterest from 'react-icons/lib/fa/pinterest';
import FaLinkedin from 'react-icons/lib/fa/linkedin';

import { ShareButtonCircle, ShareBlockStandard } from 'react-custom-share';

const CustomShareIcons = props => {
    const shareBlockProps = {
        url: 'https://github.com/greglobinski/react-custom-share',
        button: ShareButtonCircle,
        buttons: [
            { network: 'Twitter', icon: FaTwitter },
            { network: 'Facebook', icon: FaFacebook },
            { network: 'GooglePlus', icon: FaGooglePlus },
            { network: 'Email', icon: FaEnvelope },
            { network: 'Pinterest', icon: FaPinterest, media: 'https://raw.githubusercontent.com/greglobinski/react-custom-share/master/static/react-custom-share.gif' },
            { network: 'Linkedin', icon: FaLinkedin }
        ]
    }

    return <ShareBlockStandard {...shareBlockProps} />;
};

export default CustomShareIcons;