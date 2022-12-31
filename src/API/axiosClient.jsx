// api/axiosClient.js
import axios from 'axios';
import queryString from 'query-string';
import Cookies from 'universal-cookie';
// Set up default config for http requests here
// Please have a look at here `https://github.com/axios/axios#requestconfig` for the full list of configs
const axiosClient = axios.create({
	baseURL: 'https://server-ecommerce-app.vercel.app/',
	withCredentials: true,
	headers: {
		'content-type': 'application/json',
	},
	paramsSerializer: (params) => queryString.stringify(params),
});
axiosClient.interceptors.request.use(async (config) => {
	// Handle token here ...
	const cookies = new Cookies();
	const token = cookies.get('access_token');
	if (token) {
		config.headers['Authorization'] = 'Bearer ' + token;
	}
	return config;
});

axiosClient.interceptors.response.use(
	(response) => {
		if (response && response.data) {
			return response.data;
		}
		return response;
	},
	(error) => {
		// Handle errors
		throw error;
	}
);
export default axiosClient;
