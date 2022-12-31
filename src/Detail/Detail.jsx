import React, { useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import ProductAPI from '../API/ProductAPI';
import { Link, useParams, Redirect } from 'react-router-dom';
import alertify from 'alertifyjs';
import CartAPI from '../API/CartAPI';
import queryString from 'query-string';
import convertMoney from '../convertMoney';

function Detail(props) {
	const cookies = new Cookies();
	const user = cookies.get('user');
	const [detail, setDetail] = useState({});
	const [login, setLogin] = useState(true);

	//id params cho từng sản phẩm
	const { id } = useParams();

	const [product, setProduct] = useState([]);

	//Hàm này để lấy dữ liệu chi tiết sản phẩm
	useEffect(() => {
		const fetchData = async () => {
			const response = await ProductAPI.getDetail(id);
			setDetail(response);
		};

		fetchData();
	}, [id]);

	//Hàm này lấy 4 sản phẩm khác cùng loại
	useEffect(() => {
		const fetchData = async () => {
			const params = {
				detailId: detail._id,
				category: detail.category
			};
			const query = '?' + queryString.stringify(params);
			const response = await ProductAPI.getCategory(query);
			const data = response;
			setProduct(data);
		};

		fetchData();
	}, [detail]);

	//Phần này là để thay đổi số lượng khi mua sản phẩm
	const [text, setText] = useState(1);
	const onChangeText = (e) => {
		setText(e.target.value);
	};

	//Tăng lên 1 đơn vị
	const upText = () => {
		const value = parseInt(text) + 1;

		setText(value);
	};

	//Giảm 1 đơn vị
	const downText = () => {
		const value = parseInt(text) - 1;

		if (value === 0) return;

		setText(value);
	};

	//Hàm này là Thêm Sản Phẩm
	const addToCart = () => {
		if (user) {
			const fetchPost = () => {
				const params = {
					productId: detail._id, // Lấy idProduct
					quantity: text, // Lấy số lượng
				};

				const query = '?' + queryString.stringify(params);

				CartAPI.postAddToCart(query)
					.then(res => {
						console.log(res);
						alertify.set('notifier', 'position', 'bottom-left');
						alertify.success('Bạn Đã Thêm Hàng Thành Công!');
					})
					.catch(err => {
						console.log(err);
						alertify.set('notifier', 'position', 'bottom-left');
						alertify.error('Hàng trong kho không đủ số lượng!');
					})
			};

			fetchPost();
		} else {
			setLogin(false);
		}

		
	};

	return (
		<section className='py-5'>
			<div className='container'>
				<div className='row mb-5'>
					<div className='col-lg-6'>
						<div className='row m-sm-0'>
							<div className='col-sm-2 p-sm-0 order-2 order-sm-1 mt-2 mt-sm-0'>
								<div
									className='owl-thumbs d-flex flex-row flex-sm-column'
									data-slider-id='1'>
									<div className='owl-thumb-item flex-fill mb-2 mr-2 mr-sm-0'>
										<img
											className='w-100'
											src={detail.img1}
											alt='...'
										/>
									</div>
									<div className='owl-thumb-item flex-fill mb-2 mr-2 mr-sm-0'>
										<img
											className='w-100'
											src={detail.img2}
											alt='...'
										/>
									</div>
									<div className='owl-thumb-item flex-fill mb-2 mr-2 mr-sm-0'>
										<img
											className='w-100'
											src={detail.img3}
											alt='...'
										/>
									</div>
									<div className='owl-thumb-item flex-fill mb-2 mr-2 mr-sm-0'>
										<img
											className='w-100'
											src={detail.img4}
											alt='...'
										/>
									</div>
								</div>
							</div>

							<div
								id='carouselExampleControls'
								className='carousel slide col-sm-10 order-1 order-sm-2'
								data-ride='carousel'>
								<div className='carousel-inner owl-carousel product-slider'>
									<div className='carousel-item active'>
										<img
											className='d-block w-100'
											src={detail.img1}
											alt='First slide'
										/>
									</div>
									<div className='carousel-item'>
										<img
											className='d-block w-100'
											src={detail.img2}
											alt='Second slide'
										/>
									</div>
									<div className='carousel-item'>
										<img
											className='d-block w-100'
											src={detail.img3}
											alt='Third slide'
										/>
									</div>
									<div className='carousel-item'>
										<img
											className='d-block w-100'
											src={detail.img4}
											alt='Third slide'
										/>
									</div>
								</div>
								<a
									className='carousel-control-prev'
									href='#carouselExampleControls'
									role='button'
									data-slide='prev'>
									<span
										className='carousel-control-prev-icon'
										aria-hidden='true'></span>
									<span className='sr-only'>Previous</span>
								</a>
								<a
									className='carousel-control-next'
									href='#carouselExampleControls'
									role='button'
									data-slide='next'>
									<span
										className='carousel-control-next-icon'
										aria-hidden='true'></span>
									<span className='sr-only'>Next</span>
								</a>
							</div>
						</div>
					</div>
					<div className='col-lg-6'>
						<br></br>
						<h1>{detail.name}</h1>
						<br></br>
						<p className='text-muted lead'>
							{convertMoney(detail.price)} VND
						</p>
						<br></br>
						<p className='text-small mb-4'>{detail.short_desc}</p>
						<ul className='list-unstyled small d-inline-block'>
							<li className='mb-3 bg-white text-muted'>
								<strong className='text-uppercase text-dark'>
									Category:
								</strong>
								<a className='reset-anchor ml-2' href={`/shop?category=${detail.category}`}>{detail.category}s</a>
							</li>
						</ul>
						<div className='row align-items-stretch mb-4'>
							<div className='col-sm-5 pr-sm-0'>
								<div className='border d-flex align-items-center justify-content-between py-1 px-3 bg-white border-white'>
									<span className='small text-uppercase text-gray mr-4 no-select'>
										Quantity
									</span>
									<div className='quantity'>
										<button
											className='dec-btn p-0'
											style={{ cursor: 'pointer' }}>
											<i
												className='fas fa-caret-left'
												onClick={downText}></i>
										</button>
										<input
											className='form-control border-0 shadow-0 p-0'
											type='text'
											value={text}
											onChange={onChangeText}
										/>
										<button
											className='inc-btn p-0'
											style={{ cursor: 'pointer' }}>
											<i
												className='fas fa-caret-right'
												onClick={upText}></i>
										</button>
									</div>
								</div>
							</div>
							<div className='col-sm-3 pl-sm-0'>
								{!login && <Redirect to={'/signin'} />}
								<p
									className='btn btn-dark btn-sm btn-block d-flex align-items-center justify-content-center px-0 text-white'
									onClick={addToCart}>
									Add to cart
								</p>
							</div>
							<br></br>
							<br></br>
						</div>
					</div>
				</div>
				{/* <div className='form-group'>
					<label htmlFor='exampleFormControlTextarea1'>Comment:</label>
					<textarea
						className='form-control'
						rows='3'
						onChange={onChangeComment}
						value={comment}></textarea>
				</div> */}
				{/* <div className='d-flex justify-content-between'>
					<div className='d-flex w-25'>
						<span className='mt-2'>Evaluate: </span>
						&nbsp; &nbsp;
						<input
							className='form-control w-25'
							type='number'
							min='1'
							max='5'
							value={star}
							onChange={onChangeStar}
						/>
						&nbsp; &nbsp;
						<span className='mt-2'>Star</span>
					</div>
					<div>
						<a
							className='btn btn-dark btn-sm btn-block px-0 text-white'
							style={{ width: '12rem' }}
							onClick={handlerComment}>
							Send
						</a>
					</div>
				</div> */}
				<br />
				<ul className='nav nav-tabs border-0'>
					<li className='nav-item'>
						<p
							className='nav-link fix_comment'
							// onClick={() => handlerReview('description')}
							style={
								// review === 'description'
								// 	? 
									{ backgroundColor: '#383838', color: '#ffffff' }
									// : { color: '#383838' }
							}>
							Description
						</p>
					</li>
					{/* <li className='nav-item'>
						<a
							className='nav-link fix_comment'
							onClick={() => handlerReview('review')}
							style={
								review === 'review'
									? { backgroundColor: '#383838', color: '#ffffff' }
									: { color: '#383838' }
							}>
							Reviews
						</a>
					</li> */}
				</ul>
				<div className='tab-content mb-5'>
					{/* {review === 'description' ? ( */}
						<div className='tab-pane fade show active'>
							<div className='pt-4 pb-4 bg-white'>
								<h6 className='text-uppercase'>Product description </h6>
								<br></br>
								<p
									className='text-muted text-small mb-0'
									style={{ whiteSpace: 'pre-wrap' }}>
									{detail.long_desc}
								</p>
							</div>
						</div>
					{/* ) : (
						<div className='tab-pane fade show active'>
							<div className='p-4 p-lg-5 bg-white'>
								<div className='row'>
									<div className='col-lg-8'>
										{list_comment &&
											list_comment.map((value) => (
												<div className='media mb-3' key={value._id}>
													<img
														className='rounded-circle'
														src='https://img.icons8.com/color/36/000000/administrator-male.png'
														alt=''
														width='50'
													/>
													<div className='media-body ml-3'>
														<h6 className='mb-0 text-uppercase'>
															{value.fullName}
														</h6>
														<p className='small text-muted mb-0 text-uppercase'>
															dd/mm/yyyy
														</p>
														<ul className='list-inline mb-1 text-xs'>
															<li className='list-inline-item m-0'>
																<i className={value.star1}></i>
															</li>
															<li className='list-inline-item m-0'>
																<i className={value.star2}></i>
															</li>
															<li className='list-inline-item m-0'>
																<i className={value.star3}></i>
															</li>
															<li className='list-inline-item m-0'>
																<i className={value.star4}></i>
															</li>
															<li className='list-inline-item m-0'>
																<i className={value.star5}></i>
															</li>
														</ul>
														<p className='text-small mb-0 text-muted'>
															{value.content}
														</p>
													</div>
												</div>
											))}
									</div>
								</div>
							</div>
						</div>
					)} */}
				</div>
				<h2 className='h5 text-uppercase mb-4'>Related products</h2>
				<div className='row'>
					{product &&
						product.map((value) => (
							<div className='col-lg-3 col-sm-6' key={value._id}>
								<Link
									className='reset-anchor'
									to={`/detail/${value._id}`}
								>
									<div className='product text-center skel-loader'>
										<div className='d-block mb-3 position-relative'>
											<img
												className='img-fluid w-100'
												src={value.img1}
												alt='...'
											/>
											<div className='product-overlay'>
												<ul className='mb-0 list-inline'></ul>
											</div>
										</div>
										<h6>
												{value.name}
										</h6>
										<p className='small text-muted'>
											{convertMoney(value.price)} VND
										</p>
									</div>
								</Link>
							</div>
						))}
				</div>
			</div>
		</section>
	);
}

export default Detail;
