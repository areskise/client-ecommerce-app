import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import alertify from 'alertifyjs';
import queryString from 'query-string';
import CartAPI from '../API/CartAPI';
import Cookies from 'universal-cookie';
import CheckoutAPI from '../API/CheckoutAPI';
import convertMoney from '../convertMoney';
import './Checkout.css';

function Checkout(props) {
	const cookies = new Cookies();
	const user = cookies.get('user');
	const [carts, setCarts] = useState([]);

	const [total, setTotal] = useState(0);

	const [fullName, setFullName] = useState('');
	const [fullNameError, setFullNameError] = useState(false);

	const [email, setEmail] = useState('');
	const [emailError, setEmailError] = useState(false);

	const [emailRegex, setEmailRegex] = useState(false);

	const [phone, setPhone] = useState('');
	const [phoneError, setPhoneError] = useState(false);

	const [address, setAddress] = useState('');
	const [addressError, setAddressError] = useState(false);

	const [success, setSuccess] = useState(false);

	//Hàm này dùng để gọi API và render số sản phẩm
	useEffect(() => {
		if (user) {
			const fetchData = async () => {
				const response = await CartAPI.getCarts();
				setCarts(response);
				getTotal(response);
				if (response.length === 0) {
					window.location.replace('/cart');
				}
			};
			fetchData();
		}
	}, []);

	//Hàm này dùng để tính tổng tiền carts
	function getTotal(carts) {
		let sub_total = 0;

		const sum_total = carts.map((value) => {
			return (sub_total +=
				parseInt(value.productId.price) * parseInt(value.quantity));
		});

		setTotal(sub_total);
	}

	//Check Validation
	const handlerSubmit = () => {
		if (!fullName) {
			setFullNameError(true);
			setEmailError(false);
			setPhoneError(false);
			setAddressError(false);
			return;
		} else {
			if (!email) {
				setFullNameError(false);
				setEmailError(true);
				setPhoneError(false);
				setAddressError(false);
				return;
			} else {
				setPhoneError(false);
				setAddressError(false);
				setFullNameError(false);

				if (!validateEmail(email)) {
					setEmailRegex(true);
					setFullNameError(false);
					setEmailError(false);
					setPhoneError(false);
					setAddressError(false);
					return;
				} else {
					setEmailRegex(false);

					if (!phone) {
						setFullNameError(false);
						setEmailError(false);
						setPhoneError(true);
						setAddressError(false);
						return;
					} else {
						setFullNameError(false);
						setEmailError(false);
						setPhoneError(false);
						setAddressError(false);

						if (!address) {
							setFullNameError(false);
							setEmailError(false);
							setPhoneError(false);
							setAddressError(true);
						} else {	
							const params = {
								fullName: fullName,
								email: email,
								phone: phone,
								address: address,
								total: total
							};
			
							const query = '?' + queryString.stringify(params);
							
							CheckoutAPI.postOrder(query)
								.then(res=> console.log('test'))
							window.location.replace('/history')
						}
					}
				}
			}
		}
	};

	const onChangeName = (e) => {
		setFullName(e.target.value);
	};

	const onChangeEmail = (e) => {
		setEmail(e.target.value);
	};

	const onChangePhone = (e) => {
		setPhone(e.target.value);
	};

	const onChangeAddress = (e) => {
		setAddress(e.target.value);
	};

	function validateEmail(email) {
		const re =
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(String(email).toLowerCase());
	}

	return (
		<div>
			<div className='container'>
				<section className='py-5 bg-light'>
					<div className='container'>
						<div className='row px-4 px-lg-5 py-lg-4 align-items-center'>
							<div className='col-lg-6'>
								<h1 className='h2 text-uppercase mb-0'>Checkout</h1>
							</div>
							<div className='col-lg-6 text-lg-right'>
								<nav aria-label='breadcrumb'>
									<ol className='breadcrumb justify-content-lg-end mb-0 px-0'>
										<li className='breadcrumb-item'>
											<a href='index.html'>Home</a>
										</li>
										<li className='breadcrumb-item'>
											<a href='cart.html'>Cart</a>
										</li>
										<li
											className='breadcrumb-item active'
											aria-current='page'>
											Checkout
										</li>
									</ol>
								</nav>
							</div>
						</div>
					</div>
				</section>
				<section className='py-5'>
					<h2 className='h5 text-uppercase mb-4'>Billing details</h2>
					<div className='row'>
						<div className='col-lg-7'>
							<form>
								<div className='row'>
									<div className='col-lg-12 form-group'>
										<label
											className='text-small text-uppercase'
											htmlFor='FullName'>
											Full Name:
										</label>
										<input
											className='form-control form-control-lg'
											value={fullName}
											onChange={onChangeName}
											type='text'
											placeholder='Enter Your Full Name Here!'
										/>
										{fullNameError && (
											<span className='text-danger'>
												* Please Check Your Full Name!
											</span>
										)}
									</div>
									<div className='col-lg-12 form-group'>
										<label
											className='text-small text-uppercase'
											htmlFor='Email'>
											Email:{' '}
										</label>
										<input
											className='form-control form-control-lg'
											value={email}
											onChange={onChangeEmail}
											type='text'
											placeholder='Enter Your Email Here!'
										/>
										{emailError && (
											<span className='text-danger'>
												* Please Check Your Email!
											</span>
										)}
										{emailRegex && (
											<span className='text-danger'>
												* Incorrect Email Format
											</span>
										)}
									</div>
									<div className='col-lg-12 form-group'>
										<label
											className='text-small text-uppercase'
											htmlFor='Phone'>
											Phone Number:{' '}
										</label>
										<input
											className='form-control form-control-lg'
											value={phone}
											onChange={onChangePhone}
											type='number'
											placeholder='Enter Your Phone Number Here!'
										/>
										{phoneError && (
											<span className='text-danger'>
												* Please Check Your Phone Number!
											</span>
										)}
									</div>
									<div className='col-lg-12 form-group'>
										<label
											className='text-small text-uppercase'
											htmlFor='Address'>
											Address:{' '}
										</label>
										<input
											className='form-control form-control-lg'
											value={address}
											onChange={onChangeAddress}
											type='text'
											placeholder='Enter Your Address Here!'
										/>
										{addressError && (
											<span className='text-danger'>
												* Please Check Your Address!
											</span>
										)}
									</div>
									<div className='col-lg-12 form-group'>
									{success && <Redirect to={'/history'} />}
										<a
											className='btn btn-dark'
											style={{ color: 'white' }}
											type='submit'
											onClick={handlerSubmit}>
											Place order
										</a>
									</div>
								</div>
							</form>
						</div>
						<div className='col-lg-5'>
							<div className='card border-0 rounded-0 p-lg-6 bg-light'>
								<div className='card-body'>
									<h5 className='text-uppercase mb-4'>
										Your order
									</h5>
									<ul className='list-unstyled mb-0'>
										{carts &&
											carts.map((value) => (
												<div key={value._id}>
													<li className='d-flex align-items-center justify-content-between'>
														<strong className='small font-weight-bold'>
															{value.productId.name}
														</strong>
														<br></br>
														<span className='text-muted small'>
															{convertMoney(
																value.productId.price
															)}{' '}
															VND x {value.quantity}
														</span>
													</li>
													<li className='border-bottom my-2'></li>
												</div>
											))}
										<li className='d-flex align-items-center justify-content-between'>
											<strong className='text-uppercase small font-weight-bold'>
												Total
											</strong>
											<span>{convertMoney(total)} VND</span>
										</li>
									</ul>
								</div>
							</div>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
}

export default Checkout;
