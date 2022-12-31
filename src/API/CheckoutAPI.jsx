import axiosClient from './axiosClient';

const CheckoutAPI = {
	postOrder: (query) => {
		const url = `/order${query}`;
		return axiosClient.post(url);
	},
};

export default CheckoutAPI;
