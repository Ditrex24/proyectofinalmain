import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import {
	getPropertyDetail,
	cleanDetail,
	addNewBooking,
	getAllBookings,
} from "../../redux/actions";
import moment from "moment";
import { DatePicker } from "antd";

function BookingDetails({ property }) {
	const dispatch = useDispatch();

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

	const bookings = useSelector((state) => state.bookings);
	const lastBookingId = bookings?.map((booking) => booking._id);
	const bookingId =
		bookings?.length > 0 ? lastBookingId[lastBookingId.length - 1] : "";

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

	const clearValues = () => {
		setTotalAmount(0);
		setTotalDays(0);
		setSelectedDates(null);
		setReservationVisible(false);
		setReservationDetails(false);
	};

	return (
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
											property.availableDays[property.availableDays.length - 1]
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
								className={`rounded-full text-white font-onest py-1 px-3 flex flex-col ${
									!selectedDates ? " bg-gray-500 " : "bg-blue hover:bg-cyan"
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
					<button
						disabled={!selectedDates}
						className={`rounded-full font-onest flex flex-col ${
							!selectedDates
								? "text-red-600 text-sm"
								: "text-white bg-violet hover:bg-pink py-1 px-3"
						}`}
					>
						{selectedDates
							? "BOOK NOW"
							: "please choose valid reservation dates"}
					</button>
				</Link>
			</div>
		</div>
	);
}
export default BookingDetails;
