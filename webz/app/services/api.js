import Service from '@ember/service';
import axios from 'axios';


export default Service.extend({

    get(endpoint, data) {
        return axios.get(endpoint, data);
    },
});
