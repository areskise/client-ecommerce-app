import React from 'react';
import { Link } from 'react-router-dom';
import UserAPI from '../API/UserAPI';

function LoginLink({setLogin}) {
	const onRedirect = () => {
		UserAPI.postLogOut()
			.then(res => {
				setLogin(false)
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
