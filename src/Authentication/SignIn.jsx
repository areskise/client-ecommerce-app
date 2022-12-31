import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import UserAPI from '../API/UserAPI';
import './Auth.css';

function SignIn() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const [errorEmail, setErrorEmail] = useState(false);
	const [emailRegex, setEmailRegex] = useState(false);
	const [errorPassword, setErrorPassword] = useState(false);
	const [error, setError] = useState(false);

	const [redirect, setRedirect] = useState(false);

	const onChangeEmail = (e) => {
		setEmail(e.target.value);
	};

	const onChangePassword = (e) => {
		setPassword(e.target.value);
	};

	const onSubmit = () => {
		if (!email) {
			setErrorEmail(true);
			setEmailRegex(false);
			setErrorPassword(false);
			setError(false);
			return;
		} else {
			setErrorEmail(false);
			setEmailRegex(false);
			setErrorPassword(false);
			setError(false);

			if (!validateEmail(email)) {
				setErrorEmail(false);
				setEmailRegex(true);
				setErrorPassword(false);
				setError(false);
				return;
			} else {
				setErrorEmail(false);
				setEmailRegex(false);
				setErrorPassword(false);
				setError(false);

				if (!password) {
					setErrorEmail(false);
					setEmailRegex(false);
					setErrorPassword(true);
					setError(false);
					return;
				} else {
					const fetchSignIn = async () => {
						const body = {
							email: email,
							password: password
						};

						UserAPI.postSignIn(body)
							.then(res => {
								setRedirect(true);
								window.location.reload()
							})
							.catch(err => {
								console.log(err.response.data);
								setError(err.response.data)
								setErrorEmail(false);
								setEmailRegex(false);
								setErrorPassword(false);
							})

					};

					fetchSignIn();
				}
			}
		}
	};

	function validateEmail(email) {
		const re =
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(String(email).toLowerCase());
	}

	return (
		<div className='limiter'>
			<div className='container-login100'>
				<div className='wrap-login100 p-l-55 p-r-55 p-t-65 p-b-50'>
					<span className='login100-form-title p-b-33'>Sign In</span>

					<div className='d-flex justify-content-center pb-5'>
						{emailRegex && (
							<span className='text-danger'>
								* Incorrect Email Format
							</span>
						)}
						{errorEmail && (
							<span className='text-danger'>
								* Please Check Your Email
							</span>
						)}
						{errorPassword && (
							<span className='text-danger'>
								* Please Check Your Password
							</span>
						)}
						{error && (
							<span className='text-danger'>
								{error}
							</span>
						)}
					</div>

					<div className='wrap-input100 validate-input'>
						<input
							className='input100'
							type='text'
							placeholder='Email'
							value={email}
							onChange={onChangeEmail}
						/>
					</div>

					<div className='wrap-input100 rs1 validate-input'>
						<input
							className='input100'
							type='password'
							placeholder='Password'
							value={password}
							onChange={onChangePassword}
						/>
					</div>

					<div className='container-login100-form-btn m-t-20'>
						{redirect && <Redirect to={`/`} />}
						<button className='login100-form-btn' onClick={onSubmit}>
							Sign in
						</button>
					</div>

					<div className='text-center p-t-45 p-b-4'>
						<span className='txt1'>Create an account?</span>
						&nbsp;
						<Link to='/signup' className='txt2 hov1'>
							Sign up
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}

export default SignIn;
