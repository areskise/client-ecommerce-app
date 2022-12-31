import React from 'react';
import Cookies from 'universal-cookie';
import { Link } from 'react-router-dom';
import UserAPI from '../API/UserAPI';

function LoginLink({setLogin}) {
	const cookies = new Cookies();

	const onRedirect = () => {
		UserAPI.postLogOut()
			.then(res => {
				setLogin(false)
				cookies.remove('access_token')
				cookies.remove('user')
				cookies.remove('roomId')
				window.location.replace('/signin')
			})
			.catch(err => {
				console.log(err.response.data);
			})
	};

	return (
		<li className='nav-item' onClick={onRedirect}>
			<Link className='nav-link' to='/signin'>
				( Logout )
			</Link>
		</li>
	);
}

export default LoginLink;
