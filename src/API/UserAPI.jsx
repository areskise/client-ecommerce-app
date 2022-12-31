import axiosClient from './axiosClient';

const UserAPI = {
	getAllData: () => {
		const url = '/users';
		return axiosClient.get(url);
	},

	getDetailData: (id) => {
		const url = `/users/${id}`;
		return axiosClient.get(url);
	},

	postSignIn: (body) => {
		const url = `/users/signin`;
		return axiosClient.post(url, body);
	},

	postSignUp: (body) => {
		const url = `/users/signup`;
		return axiosClient.post(url, body);
	},

	postLogOut: () => {
		const url = `/users/logout`;
		return axiosClient.post(url);
	},
};

export default UserAPI;
