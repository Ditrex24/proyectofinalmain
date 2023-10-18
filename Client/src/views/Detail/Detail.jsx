import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import {
	getPropertyDetail,
	cleanDetail,
	addNewBooking,
	getAllBookings,
} from "../../redux/actions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faHouse,
	faLocationDot,
	faBed,
	faBath,
	faRulerCombined,
	faWarehouse,
	faHourglassHalf,
	faFireBurner,
	faTemperatureLow,
	faCheck,
	faXmark,
} from "@fortawesome/free-solid-svg-icons";
import ImageCarousel from "../../components/Card/ImageCarousel";
import ImageGalleryModal from "./Modal";
import PropertyMap from "./PropertyMap";
import NavBar from "../../components/NavBar/NavBar";
import { FadeLoader } from "react-spinners";
import moment from "moment";
import { DatePicker } from "antd";

const Detail = () => {
	const { id } = useParams();
	const dispatch = useDispatch();

	const property = useSelector((state) => state.propertyDetail);

	useEffect(() => {
		dispatch(getPropertyDetail(id));
		return () => {
			dispatch(cleanDetail());
		};
	}, [dispatch, id]);

	const [totalAmount, setTotalAmount] = useState(0);
	const [totalDays, setTotalDays] = useState(0);
	const [selectedDates, setSelectedDates] = useState(null);
	const [reservationDetails, setReservationDetails] = useState(false);

	const calculateDaysInBetween = (startDate, endDate) => {
		const start = new Date(startDate.format("YYYY-MM-DD"));
		const end = new Date(endDate.format("YYYY-MM-DD"));
		const daysInBetween = Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1;
		setTotalDays(daysInBetween);
		setTotalAmount(daysInBetween * property.price);
		setReservationDetails(true);
		return daysInBetween;
	};

	const handleDateChange = ([startDate, endDate]) => {
		console.log("From: ", startDate, "To:", endDate);
		if (startDate && endDate) {
			const daysInBetween = calculateDaysInBetween(startDate, endDate);
			console.log("Days in between:", daysInBetween);
		}
		setSelectedDates([startDate, endDate]);
	};

	const clearValues = () => {
		setTotalAmount(0);
		setTotalDays(0);
		setSelectedDates(null);
		setReservationVisible(false);
		setReservationDetails(false);
	};

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedImage, setSelectedImage] = useState(null);

	const openModal = (image) => {
		setSelectedImage(image);
		setIsModalOpen(true);
	};

	const closeModal = () => {
		setSelectedImage(null);
		setIsModalOpen(false);
	};

	const [showAmenities, setShowAmenities] = useState(true);

	const toggleCharacteristics = () => {
		setShowAmenities(!showAmenities);
	};

	console.log("property detail", property);

	const originalStartDate =
		property && property.availableDays && property.availableDays[0];
	const formattedStartDate = originalStartDate
		? new Date(originalStartDate).toLocaleDateString("en-US", {
				year: "numeric",
				month: "long",
				day: "numeric",
		  })
		: "N/A";

	const originalEndDate =
		property &&
		property.availableDays &&
		property.availableDays[property.availableDays.length - 1];
	const formattedEndDate = originalEndDate
		? new Date(originalEndDate).toLocaleDateString("en-US", {
				year: "numeric",
				month: "long",
				day: "numeric",
		  })
		: "N/A";

	const bookings = useSelector((state) => state.bookings);
	const lastBookingId = bookings?.map((booking) => booking._id);
	const bookingId =
		bookings?.length > 0 ? lastBookingId[lastBookingId.length - 1] : "";
	console.log(lastBookingId, bookingId);

	console.log(bookings);
	const guest = useSelector((state) => state.user);
	const [isReservationVisible, setReservationVisible] = useState(false);
	const handleBookNow = async () => {
		try {
			if (selectedDates && totalAmount > 0) {
				const start = new Date(selectedDates[0]);
				const end = new Date(selectedDates[1]);
				const startDate = moment(start).format("DD-MM-YYYY");
				const endDate = moment(end).format("DD-MM-YYYY");

				const bookingDetails = {
					startDate: startDate,
					endDate: endDate,
					guest: guest,
					owner: property?.owner,
					property: property,
					totalDays: totalDays,
					totalAmount: totalAmount,
					isPayed: false,
					transactionId: "",
					status: "reserved",
				};
				console.log("booking details", bookingDetails);
				await dispatch(addNewBooking(bookingDetails));
				await dispatch(getAllBookings());
				setReservationVisible(true);
			}
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		dispatch(getAllBookings());
	}, [dispatch]);

	return (
		<div className="bg-white w-screen h-screen overflow-x-hidden">
			<NavBar />
			{property && property.title ? (
				<div className="w-full px-10 mx-10 py-20">
					<div>
						<div className="w-full mb-7 flex justify-between">
							<div>
								<h1 className="text-5xl font-onest font-extrabold uppercase text-cyan">
									{property.title}
								</h1>
							</div>
							<div className="">
								<button className=" flex justify-end text-white bg-transparent rounded-full mr-6">
									<Link
										to="/"
										className="mt-1 mr-2 justify-center text-blue font-onest font-semibold"
									>
										RETURN
									</Link>
									<FontAwesomeIcon
										icon={faHouse}
										className="bg-cyan text-blue  py-2 px-2 rounded-full justify-center shadow-lg"
									/>
								</button>
							</div>
						</div>
						<div className="mb-5">
							<div className="flex flex-row h-[500px]">
								<div className="w-full overflow-hidden rounded-xl shadow-xl">
									<ImageCarousel images={property.images} />
								</div>
								<div className="w-full flex flex-row flex-wrap justify-start overflow-x-hidden overflow-y-scroll">
									<p className="ml-5 text-blue font-onest font-bold underline pb-3">
										♥︎SAVE PROPERTY
									</p>
									<div className="flex flex-row flex-wrap">
										{property.images.map((image, index) => (
											<div className="flex flex-row flex-wrap ">
												<img
													key={index}
													src={image.imageUrl}
													alt={`Thumbnail ${index + 1}`}
													className="h-[250px] w-[300px] cursor-pointer m-1 filter grayscale hover:grayscale-0 rounded-md"
													onClick={() => openModal(image)}
												/>
											</div>
										))}
									</div>
								</div>
							</div>
						</div>
						<div className="w-full">
							<p className="text-blue font-noto font-bold pb-3">
								Available from {formattedStartDate || "null"} to{" "}
								{formattedEndDate || "null"}
							</p>
							<div className="w-1/2 h-10 grid grid-cols-3 gap-3 place-items-stretch">
								<div className="flex justify-center items-center rounded-md bg-cyan uppercase">
									<p className="text-sm text-blue text-center font-bold">
										<FontAwesomeIcon icon={faBed} className="mr-2" />{" "}
										{property.bedrooms} Bedroom/s
									</p>
								</div>
								<div className="flex justify-center items-center rounded-md bg-cyan uppercase">
									<p className="text-sm font-bold text-blue text-center">
										<FontAwesomeIcon icon={faBath} className="mr-2" />
										{property.bathrooms} Bathroom/s
									</p>
								</div>
								<div className="flex justify-center items-center rounded-md bg-cyan">
									<p className="text-sm font-bold text-blue text-center">
										<FontAwesomeIcon icon={faRulerCombined} />{" "}
										{property.amenities.covered_area} m²
									</p>
								</div>
							</div>
							<p className="flex justify-end text-4xl text-blue font-onest font-extrabold mr-2 pr-20 py-3">
								U$D {property.price}
							</p>
							<div className="w-full justify-center align-middle items-center flex flex-row pr-20">
								<div className="w-1/2 flex flex-col mr-11">
									<p className="text-3xl text-blue font-onest font-extrabold pt-3">
										DESCRIPTION
									</p>
									<p className="text-md text-blue font-noto text-justify font-light pb-3">
										{property.description}
									</p>
								</div>
								<div className="w-1/4 h-full border-2 border-cyan rounded-xl mt-3 pb-5">
									<p className="text-xl text-blue font-onest font-extrabold pt-3 px-5">
										PROPERTY OWNER
									</p>
									<div className="flex flex-row justify-items-center pl-5">
										{property.owner.images > 0 ? (
											<img
												src={property.owner.images[0]}
												alt="Placeholder"
												className="rounded-full object-cover w-11 h-11"
											/>
										) : (
											<img
												src="https://via.placeholder.com/150"
												alt="Placeholder"
												className="rounded-full object-cover w-11 h-11"
											/>
										)}

										<p className="text-xs text-blue font-noto text-left font-light py-2 px-2">
											{property.owner.name} from {property.owner.city},{" "}
											{property.owner.country}
										</p>
									</div>
								</div>
								<div className="w-1/4 h-full border-2 border-cyan rounded-xl ml-3 mt-3">
									<p className="text-xl text-blue font-onest font-extrabold pt-3 px-5">
										PROPERTY REVIEWS
									</p>
									<div className="flex items-center justify-start pb-5">
										<div className="flex flex-row justify-items-center pl-5">
											<img
												src="https://via.placeholder.com/150"
												alt="Placeholder"
												className="rounded-full object-cover w-11 h-11"
											/>
											<p className="text-xs text-blue font-noto text-left font-light pl-2 pt-2">
												"Lorem ipsum dolor sit amet consectetur adipisicing
												elit. Iste"
											</p>
										</div>
									</div>
								</div>
							</div>
							<div className="w-full flex flex-row mt-8 pr-20">
								<div className="w-1/2">
									<p className="text-4xl text-blue font-onest font-extrabold py-3">
										LOCATION
									</p>
									<p className="text-md mt-1 pb-0 mb-0 font-noto font-medium text-blue uppercase">
										<FontAwesomeIcon icon={faLocationDot} />{" "}
										{property.type || "Property"} in {property.address.state},{" "}
										{property.address.city}
									</p>
									{/* <div>
										<PropertyMap property={property} />
									</div> */}
								</div>
								<div className="w-1/2 ml-7">
									<p className="text-4xl text-blue font-onest font-extrabold pt-3">
										OTHER CHARACTERISTICS
									</p>
									<div className="bg-blue bg-opacity-10 p-5 rounded-t-md flex flex-row ">
										<p
											className={`text-md font-bold text-blue font-onest cursor-pointer pr-5 ${
												showAmenities
													? "underline text-cyan cursor-pointer"
													: ""
											}`}
											onClick={() => setShowAmenities(true)}
										>
											AMENITIES
										</p>
										<p
											className={`text-md font-bold text-blue font-onest cursor-pointer  ${
												!showAmenities
													? "underline text-cyan cursor-pointer"
													: ""
											}`}
											onClick={() => setShowAmenities(false)}
										>
											ADDITIONAL FEATURES
										</p>
									</div>
									<div className="bg-blue bg-opacity-5 flex px-4 rounded-b-md py-5">
										{showAmenities ? (
											<div className="flex flex-col justify-start font-noto">
												<div className="flex flex-row items-center text-sm font-medium text-blue pb-4">
													<FontAwesomeIcon
														icon={faWarehouse}
														className="w-10"
													/>
													<p>
														Garage/Parking Spot:{" "}
														{property.amenities.garage ? "Yes" : "No"}
													</p>
												</div>
												<div className="flex flex-row items-center text-sm font-medium text-blue pb-4">
													<FontAwesomeIcon
														icon={faHourglassHalf}
														className="w-10"
													/>
													<p>Antiquity: {property.amenities.antique}</p>
												</div>
												<div className="flex flex-row items-center text-sm font-medium text-blue pb-4">
													<FontAwesomeIcon
														icon={faFireBurner}
														className="w-10"
													/>
													<p>
														Grill: {property.amenities.grill ? "Yes" : "No"}
													</p>
												</div>
												<div className="flex flex-row items-center text-sm font-medium text-blue pb-4">
													<FontAwesomeIcon
														icon={faTemperatureLow}
														className="w-10"
													/>
													<p>
														Heat/Cool System:{" "}
														{property.amenities.grill ? "Yes" : "No"}
													</p>
												</div>
											</div>
										) : (
											<div className="flex flex-col font-noto ">
												<p>
													{property.additional.swimmingpool ? (
														<FontAwesomeIcon icon={faCheck} className="w-5" />
													) : (
														<FontAwesomeIcon icon={faXmark} className="w-5" />
													)}
													Swimming Pool
												</p>
												<p>
													{property.additional.terrace ? (
														<FontAwesomeIcon icon={faCheck} className="w-5" />
													) : (
														<FontAwesomeIcon icon={faXmark} className="w-5" />
													)}
													Terrace
												</p>
												<p>
													{property.additional.balcony_patio ? (
														<FontAwesomeIcon icon={faCheck} className="w-5" />
													) : (
														<FontAwesomeIcon icon={faXmark} className="w-5" />
													)}
													Balcony
												</p>
												<p>
													{property.additional.patio ? (
														<FontAwesomeIcon icon={faCheck} className="w-5" />
													) : (
														<FontAwesomeIcon icon={faXmark} className="w-5" />
													)}
													Patio or Garden
												</p>
												<p>
													{property.additional.dining_room ? (
														<FontAwesomeIcon icon={faCheck} className="w-5" />
													) : (
														<FontAwesomeIcon icon={faXmark} className="w-5" />
													)}
													Dining Room
												</p>
												<p>
													{property.additional.washing_machine ? (
														<FontAwesomeIcon icon={faCheck} className="w-5" />
													) : (
														<FontAwesomeIcon icon={faXmark} className="w-5" />
													)}
													Washing Machine
												</p>
												<p>
													{property.additional.internet_wifi ? (
														<FontAwesomeIcon icon={faCheck} className="w-5" />
													) : (
														<FontAwesomeIcon icon={faXmark} className="w-5" />
													)}
													Internet and WiFi
												</p>
												<p>
													{property.additional.refrigerator ? (
														<FontAwesomeIcon icon={faCheck} className="w-5" />
													) : (
														<FontAwesomeIcon icon={faXmark} className="w-5" />
													)}
													Refigerator
												</p>
												<p>
													{property.additional.microwave ? (
														<FontAwesomeIcon icon={faCheck} className="w-5" />
													) : (
														<FontAwesomeIcon icon={faXmark} className="w-5" />
													)}
													Microwave
												</p>
												<p>
													{property.additional.coffee_maker ? (
														<FontAwesomeIcon icon={faCheck} className="w-5" />
													) : (
														<FontAwesomeIcon icon={faXmark} className="w-5" />
													)}
													Coffee Maker
												</p>
											</div>
										)}
									</div>
								</div>
							</div>
							<div className="w-full flex flex-col items-end justify-end pr-20 pt-11">
								<div className="flex flex-col w-2/3 items-end pl-7">
									<div className="flex flex-col justify-start pb-5 mr-5">
										<p className="text-4xl text-blue font-onest text-right font-extrabold pb-3">
											SELECT DATES
										</p>
										<div className="flex">
											<DatePicker.RangePicker
												format="DD-MM-YYYY"
												onChange={handleDateChange}
												value={selectedDates}
												className="rounded-full py-2 mr-5 border-2 border-cyan font-onest text-blue"
												disabledDate={(current) =>
													current &&
													(current < moment(property.availableDays[0]) ||
														current >
															moment(
																property.availableDays[
																	property.availableDays.length - 1
																]
															))
												}
											/>
											<button
												onClick={clearValues}
												className="rounded-full text-center justify-center text-white font-onest bg-blue py-1 flex flex-col hover:bg-cyan"
											>
												Clear
											</button>
										</div>
									</div>
								</div>
								{reservationDetails && (
									<div className="w-2/3 flex flex-col justify-start items-start text-left my-4 mr-4">
										<p className="text-4xl text-blue font-onest text-right font-extrabold">
											RESERVATION DETAILS
										</p>
										<div className="bg-blue bg-opacity-5 rounded-md shadow-lg flex flex-col justify-between items-center w-full text-left mb-4 mr-4">
											<div className="p-5 flex flex-row w-full justify-between">
												<div className="">
													<p className="text-2xl text-blue font-onest font-extrabold">
														{property.title}
													</p>
													<p className="text-md text-cyan font-noto font-extrabold ">
														From:{" "}
														{selectedDates &&
															selectedDates[0].format("dddd, MMMM Do YYYY")}
													</p>
													<p className="text-md text-cyan font-noto font-extrabold ">
														To:{" "}
														{selectedDates &&
															selectedDates[1].format("dddd, MMMM Do YYYY")}
													</p>
												</div>
												<div className=" flex px-5">
													<p className="text-2xl text-blue font-onest font-extrabold px-3">
														DAYS:
													</p>
													<p className="text-2xl text-cyan font-onest font-extrabold">
														{totalDays}
													</p>
												</div>
												<div className="flex px-5">
													<p className="text-2xl text-blue font-onest font-extrabold px-3">
														TOTAL:
													</p>
													<p className="text-2xl text-cyan font-onest font-extrabold">
														U$D {totalAmount.toFixed(2)}
													</p>
												</div>
											</div>
											<div className="w-full flex flex-col items-end pr-8">
												<button
													onClick={selectedDates ? handleBookNow : null}
													disabled={!selectedDates}
													className={`rounded-full text-white font-onest py-1 flex flex-col ${
														!selectedDates
															? " bg-gray-500 "
															: "bg-blue hover:bg-cyan"
													}`}
												>
													CONFIRM RESERVATION
												</button>
											</div>
											<div className="flex flex-col w-full p-5">
												{isReservationVisible && (
													<div>
														<p className="text-2xl text-right text-blue font-onest font-extrabold px-3 uppercase">
															Your reservation has been confirmed!
														</p>
														<p className="text-xl text-right text-cyan font-onest uppercase font-bold px-3">
															Reservation Number: #{bookingId}
														</p>
													</div>
												)}
											</div>
										</div>
									</div>
								)}
								<div className="flex flex-col justify-start pb-11 mr-5">
									<Link to={`/detail/reservations/${bookingId}`}>
										<button className="rounded-full text-white font-onest bg-blue py-1 flex flex-col hover-bg-cyan">
											BOOK NOW
										</button>
									</Link>
								</div>
							</div>
						</div>
						{isModalOpen && (
							<ImageGalleryModal
								images={property.images}
								selectedImage={selectedImage}
								onClose={closeModal}
							/>
						)}
					</div>
				</div>
			) : (
				<div className="flex flex-col items-center w-full h-screen">
					<FadeLoader color="#54086B" />
				</div>
			)}
		</div>
	);
};

export default Detail;
