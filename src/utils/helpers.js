import { toast } from 'react-toastify';

const helpers = {

    toastify: (status, msg) => {
        toast[status](msg, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 3000
        });
    }

}

export default helpers;