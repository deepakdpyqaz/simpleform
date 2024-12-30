"use client";

import { AccommodationType, priceList, TravelType, YesNoType, BedType, OperationType } from "./constants";
import { ISlot } from "./api/models/Slot";
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import PersonalDetailsForm, { PersonalDetails } from "./components/PersonalDetailsForm";


type RoomQuantity = {
    [key in BedType]: number
}

const defaultRoomQuantity: RoomQuantity = {
    [BedType.AB2]: 0,
    [BedType.AB3]: 0,
    [BedType.AB4]: 0,
    [BedType.NAB6]: 0
}



interface UserData {
    email: string;
    groupSize: number;
    travelType: TravelType | null;
    isAccommodationRequired: YesNoType | null;
    roomQuantity: RoomQuantity | null;
    isFoodRequired: YesNoType | null;
    isPartialRetreat: YesNoType | null;
    startDate: string | undefined;
    endDate: string | undefined;
    isArrivalLunchRequired: YesNoType | null;
    isDepartureLunchRequired: YesNoType | null;
    donationAmount: number | undefined;
    suggestions: string;
    coupon: string;
}

const defaultUserData: UserData = {
    email: "",
    groupSize: 1,
    travelType: null,
    isAccommodationRequired: null,
    roomQuantity: defaultRoomQuantity,
    isFoodRequired: null,
    isPartialRetreat: null,
    startDate: "2025-02-23",
    endDate: "2025-03-01",
    isArrivalLunchRequired: null,
    isDepartureLunchRequired: null,
    donationAmount: 0,
    suggestions: "",
    coupon: ""
}
const defaultPersonalDetails: PersonalDetails = {
    devoteeName: "",
    name: "",
    dob: "",
    nationality: "",
    gender: null,
    spiritualMaster: "",
    findRetreat: "",
    startYear: "",
    address: "",
    whatsappNumber: "",
    isSnore: null,
    idCopy: "",
    isVolunteer: null,
    occupation: "",
    sevaType: "",
    otherSevaType: ""
}

interface Slot {
    [BedType.AB2]: { price: number, available: number },
    [BedType.AB3]: { price: number, available: number },
    [BedType.AB4]: { price: number, available: number },
    [BedType.NAB6]: { price: number, available: number }
}

const defaultSlot: Slot = {
    [BedType.AB2]: {
        price: 0,
        available: 0
    },
    [BedType.AB3]: {
        price: 0,
        available: 0
    },
    [BedType.AB4]: {
        price: 0,
        available: 0
    },
    [BedType.NAB6]: {
        price: 0,
        available: 0
    }
}

function getDateDifferenceFromString(
    date1Str: string | undefined,
    date2Str: string | undefined
): number {
    if (date1Str === undefined || date2Str === undefined) {
        return 0;
    }
    // Parse the string dates into Date objects
    const date1 = new Date(date1Str);
    const date2 = new Date(date2Str);

    const diffInMilliseconds = Math.abs(date1.getTime() - date2.getTime());

    const minutes = Math.floor(diffInMilliseconds / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    return days;
}
export default function Home() {
    const router = useRouter();
    const [userData, setUserData] = useState<UserData>(defaultUserData);
    const [charges, setCharges] = useState<Number>(0);
    const [foodCharges, setFoodCharges] = useState<Number>(0);
    const [roomCharges, setRoomCharges] = useState<Number>(0);
    const [tarrifMessage, setTarrifMessage] = useState<String>("");
    const [personalDetails, setPersonalDetails] = useState<PersonalDetails[]>([]);
    const [submitStatus, setSubmitStatus] = useState<String>("");
    const [slotList, setSlotList] = useState<Slot>(defaultSlot);
    const [roomQuantity, setRoomQuantity] = useState<RoomQuantity>(defaultRoomQuantity);
    const [couponPct, setCouponPct] = useState<number>(0);
    const fetchSlots = async () => {
        try {
            const res = await fetch('/api/slot', { cache: 'reload' });
            const slots: ISlot[] = (await res.json())?.slots as ISlot[];
            const bedPriceList = slots.reduce((acc, slot) => {
                acc[slot.bedType] = {
                    price: slot?.price,
                    available: slot?.available
                }
                return acc;
            }, {} as Slot);
            setSlotList(bedPriceList);
        }
        catch (error) {
            console.error(error);
            alert("Error in fetching slot list");
        }
    }
    const tarrifCalculator = () => {

    }
    useEffect(tarrifCalculator, [userData.roomQuantity, userData.groupSize, userData.isAccommodationRequired, userData.travelType]);
    useEffect(() => {
        if (userData.groupSize == null || userData.groupSize == undefined || userData.groupSize < 2) {
            setPersonalDetails([]);
            if (userData.travelType === TravelType.Group) {
                alert("Minimum 2 people for group booking");
                setUserData(userData => {
                    return { ...userData, groupSize: 2 } as UserData;
                })
            }
        }
        setPersonalDetails(personalDetails => {
            const personalDetailsCopy = [...personalDetails];
            if (userData.groupSize === personalDetailsCopy.length) {
                return personalDetailsCopy as PersonalDetails[];
            }
            else if (userData.groupSize < personalDetailsCopy.length) {
                return personalDetailsCopy.splice(userData.groupSize) as PersonalDetails[];
            } else {
                const newPersonalDetails = Array(userData.groupSize - personalDetails.length).fill(defaultPersonalDetails);
                return [...personalDetailsCopy, ...newPersonalDetails] as PersonalDetails[];
            }
        })
        setUserData((userData) => {
            return { ...userData, roomQuantity: defaultRoomQuantity }
        })
        setRoomQuantity(defaultRoomQuantity);
    }, [userData.groupSize]);
    useEffect(() => {
        setUserData(userData => {
            return { ...userData, groupSize: userData.travelType === TravelType.Group ? 2 : 1 } as UserData;
        })
    }, [userData.travelType])
    useEffect(() => {
        setUserData(userData => {
            return { ...userData, isAccommodationRequired: YesNoType.No, roomQuantity: defaultRoomQuantity } as UserData;
        })
    }, [userData.isPartialRetreat])
    useEffect(() => {
        if (userData.startDate != null && userData.endDate != null && defaultUserData.startDate != null && defaultUserData.endDate != null) {
            let startDate = new Date(userData.startDate);
            let endDate = new Date(userData.endDate);
            let defaultStartDate = new Date(defaultUserData.startDate);
            let defaultEndDate = new Date(defaultUserData.endDate);
            if ((startDate <= endDate) && (startDate >= defaultStartDate) && (endDate <= defaultEndDate)) {
                return;
            }
            else if (endDate < startDate) {
                alert("End date cannot be before the start date");
            }
            else if (startDate < defaultStartDate) {
                alert(`Start date cannot be before ${defaultUserData.startDate}`);
            }
            else if (endDate > defaultEndDate) {
                alert(`End date cannot be after ${defaultUserData.endDate}`);
            }
            else {
                alert("Invalid date range");
            }

        }
        setUserData(userData => {
            return { ...userData, startDate: defaultUserData.startDate, endDate: defaultUserData.endDate } as UserData;
        })

    }, [userData.startDate, userData.endDate])
    useEffect(() => {
        fetchSlots();
    }, [])
    const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setUserData((prevState: UserData | undefined) => ({
            ...prevState,
            [name]: value,
        }) as UserData);
    };
    const handlePersonalDetailsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, index: number) => {
        const { name, value } = e.target;
        let personalDetailsCopy = [...personalDetails]
        let formData: any = { ...personalDetails[index] };
        formData[name] = value;
        personalDetailsCopy[index] = formData;
        setPersonalDetails(personalDetailsCopy);
    };

    const [activeTab, setActiveTab] = useState<number>(0);


    const handleTabClick = (index: number) => {
        setActiveTab(index);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(userData);
        let body = { ...userData, personalDetails: personalDetails, charges: charges }
        try {
            const response = await fetch("/api/form", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });

            if (response.ok) {
                setSubmitStatus("Submitted");
                setUserData(defaultUserData);
                setPersonalDetails([]);
                setCharges(0);
                alert("Form submitted successfully");
                const body = await response.json();
                const query = new URLSearchParams({ id: body.id }).toString();
                router.push(`/payment?${query}`);
            } else {
                const errorData = await response.json();
                setSubmitStatus(`Error: ${errorData.error}`);
                alert("Error in submitting form")
            }
        } catch (error) {
            setSubmitStatus("An error occurred. Please try again.");
            alert("Error in submitting form")
        }
    };

    const validateRoomQuantity = (roomQty: RoomQuantity): boolean => {
        if (userData.groupSize < (roomQty["2AB"] + roomQty["3AB"] + roomQty["4AB"] + roomQty["6NAB"])) return false;
        if (userData.travelType === TravelType.Individual && roomQty["4AB"] > 0) return false;
        return true;
    }
    const handleQuantityChange = (btype: BedType, operation: OperationType) => {
        try {
            setRoomQuantity((roomQuantity): RoomQuantity => {
                let roomQty: RoomQuantity = { ...roomQuantity }
                if (operation === OperationType.Increase) {
                    if (slotList[btype].available <= roomQty[btype]) {
                        alert("Not enough slots available");
                    }
                    else {
                        roomQty[btype] = roomQty[btype] + 1;
                    }
                } else if (operation === OperationType.Decrease) {
                    if (roomQty[btype] > 0) {
                        roomQty[btype] = roomQty[btype] - 1;
                    } else {
                        alert("Cannot decrease beyond 0");
                    }
                } else {
                    alert("Wrong operation")
                }
                if (validateRoomQuantity(roomQty)) {
                    setUserData((userData) => {
                        return { ...userData, roomQuantity: roomQty } as UserData;
                    })
                    return roomQty;
                }
                else {
                    alert("Can't book more slots than required");
                    return roomQuantity;
                }
            });
        }
        catch (error) {
            console.error(error);
            alert("Error in updating quantity");
        }
    }
    const handleApplyCoupon = async () => {
        if (userData.coupon === "") {
            alert("Please enter a coupon code");
            return;
        }
        try {
            const response = await fetch(`/api/coupon?coupon=${userData.coupon}`);
            if (response.ok) {
                const data = await response.json();
                if (data.error) {
                    alert(data.error);
                } else {
                    setCouponPct(data?.pct);
                    alert("Coupon applied successfully");
                }
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message}`);
            }
        } catch (error) {
            console.error(error);
            alert("Error in applying coupon");
        }
    }
    return (
        <form onSubmit={handleSubmit} className="bg-white shadow-2xl rounded-xl p-8 max-w-lg mx-auto border border-teal-300">
            <div className="mb-8">
                <label htmlFor="email" className="block text-sm font-semibold text-teal-800">Email*</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    onChange={handleChange}
                    value={userData?.email}
                    className="mt-2 block w-full rounded-lg border border-teal-400 shadow-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-300 transition-all duration-200"
                />
            </div>

            <div className="mb-8">
                <label className="block text-sm font-semibold text-teal-800">Are you registering for an individual or group?*</label>
                <div className="mt-4 flex items-center gap-6">
                    <label className="flex items-center cursor-pointer">
                        <input
                            type="radio"
                            name="travelType"
                            value={TravelType.Individual}
                            checked={userData?.travelType === TravelType.Individual}
                            required
                            onChange={handleChange}
                            className="text-teal-500 focus:ring-teal-500"
                        />
                        <span className="ml-2 text-teal-700">Individual</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                        <input
                            type="radio"
                            name="travelType"
                            value={TravelType.Group}
                            onChange={handleChange}
                            checked={userData?.travelType === TravelType.Group}
                            className="text-teal-500 focus:ring-teal-500"
                        />
                        <span className="ml-2 text-teal-700">Group</span>
                    </label>
                </div>
            </div>
            {
                userData?.travelType === TravelType.Group ?
                    <div id="group-registration" className="mb-8">
                        <label htmlFor="group-size" className="block text-sm font-semibold text-teal-800">Number of group members (2-6)</label>
                        <input
                            type="number"
                            id="group-size"
                            name="groupSize"
                            value={userData?.groupSize}
                            onChange={handleChange}
                            className="mt-2 block w-full rounded-lg border border-teal-400 shadow-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-300 transition-all duration-200"
                        />
                    </div> : null
            }
            <div className="mb-8">
                <label className="block text-sm font-semibold text-teal-800">Would you like to opt for a partial registration for the Sarnagati retreat?*</label>
                <div className="mt-4 flex items-center gap-6">
                    <label className="flex items-center cursor-pointer">
                        <input
                            type="radio"
                            name="isPartialRetreat"
                            value={YesNoType.Yes}
                            required
                            checked={userData?.isPartialRetreat === YesNoType.Yes}
                            onChange={handleChange}
                            className="text-teal-500 focus:ring-teal-500"
                        />
                        <span className="ml-2 text-teal-700">Yes</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                        <input
                            type="radio"
                            name="isPartialRetreat"
                            value={YesNoType.No}
                            checked={userData?.isPartialRetreat === YesNoType.No}
                            onChange={handleChange}
                            className="text-teal-500 focus:ring-teal-500"
                        />
                        <span className="ml-2 text-teal-700">No</span>
                    </label>
                </div>
            </div>
            {userData?.isPartialRetreat === YesNoType.Yes ?
                <div className="mb-8 flex gap-6">
                    <div className="flex-1">
                        <label className="block text-sm font-semibold text-teal-800">Start Date*</label>
                        <input
                            type="date"
                            name="startDate"
                            value={userData?.startDate}
                            onChange={handleChange}
                            required
                            className="mt-2 px-3 py-2 border border-teal-500 rounded-md w-full"
                        />
                    </div>
                    <div className="flex-1">
                        <label className="block text-sm font-semibold text-teal-800">End Date*</label>
                        <input
                            type="date"
                            name="endDate"
                            value={userData?.endDate}
                            onChange={handleChange}
                            required
                            className="mt-2 px-3 py-2 border border-teal-500 rounded-md w-full"
                        />
                    </div>
                </div> : null}
            <div className="mb-8">
                <label className="block text-sm font-semibold text-teal-800">Do you require prasad during retreat? (Rs. {priceList.foodFees}/- per day per person)*</label>
                <div className="mt-4 flex items-center gap-6">
                    <label className="flex items-center cursor-pointer">
                        <input
                            type="radio"
                            name="isFoodRequired"
                            value={YesNoType.Yes}
                            required
                            checked={userData?.isFoodRequired === YesNoType.Yes}
                            onChange={handleChange}
                            className="text-teal-500 focus:ring-teal-500"
                        />
                        <span className="ml-2 text-teal-700">Yes</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                        <input
                            type="radio"
                            name="isFoodRequired"
                            value={YesNoType.No}
                            checked={userData?.isFoodRequired === YesNoType.No}
                            onChange={handleChange}
                            className="text-teal-500 focus:ring-teal-500"
                        />
                        <span className="ml-2 text-teal-700">No</span>
                    </label>
                </div>
                {userData?.isFoodRequired === YesNoType.Yes ?
                    <div className="mt">
                        <div className="flex items-center justify-between">
                            <span className="mt-2 text-teal-800">Contribution:
                                Rs. {priceList.foodFees * userData?.groupSize * getDateDifferenceFromString(userData?.startDate, userData?.endDate)} /-
                            </span>
                        </div>
                    </div> : null
                }
            </div>
            <div className="mb-8">
                <label className="block text-sm font-semibold text-teal-800">Do you require lunch on the day of arrival?(Rs. {priceList.arrivalLunch} /- per person) *</label>
                <div className="mt-4 flex items-center gap-6">
                    <label className="flex items-center cursor-pointer">
                        <input
                            type="radio"
                            name="isArrivalLunchRequired"
                            value={YesNoType.Yes}
                            required
                            checked={userData?.isArrivalLunchRequired === YesNoType.Yes}
                            onChange={handleChange}
                            className="text-teal-500 focus:ring-teal-500"
                        />
                        <span className="ml-2 text-teal-700">Yes</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                        <input
                            type="radio"
                            name="isArrivalLunchRequired"
                            value={YesNoType.No}
                            checked={userData?.isArrivalLunchRequired === YesNoType.No}
                            onChange={handleChange}
                            className="text-teal-500 focus:ring-teal-500"
                        />
                        <span className="ml-2 text-teal-700">No</span>
                    </label>
                </div>
                {userData?.isArrivalLunchRequired === YesNoType.Yes ?
                    <div className="mt">
                        <div className="flex items-center justify-between">
                            <span className="mt-2 text-teal-800">Contribution:
                                Rs. {priceList.arrivalLunch * userData?.groupSize} /-
                            </span>
                        </div>
                    </div> : null
                }
            </div>
            <div className="mb-8">
                <label className="block text-sm font-semibold text-teal-800">Do you require lunch on the day of departure? (Rs. {priceList.departureLunch} /- per person)*</label>
                <div className="mt-4 flex items-center gap-6">
                    <label className="flex items-center cursor-pointer">
                        <input
                            type="radio"
                            name="isDepartureLunchRequired"
                            value={YesNoType.Yes}
                            required
                            checked={userData?.isDepartureLunchRequired === YesNoType.Yes}
                            onChange={handleChange}
                            className="text-teal-500 focus:ring-teal-500"
                        />
                        <span className="ml-2 text-teal-700">Yes</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                        <input
                            type="radio"
                            name="isDepartureLunchRequired"
                            value={YesNoType.No}
                            checked={userData?.isDepartureLunchRequired === YesNoType.No}
                            onChange={handleChange}
                            className="text-teal-500 focus:ring-teal-500"
                        />
                        <span className="ml-2 text-teal-700">No</span>
                    </label>
                </div>
                {userData?.isDepartureLunchRequired === YesNoType.Yes ?
                    <div className="mt">
                        <div className="flex items-center justify-between">
                            <span className="mt-2 text-teal-800">Contribution:
                                Rs. {priceList.departureLunch * userData?.groupSize} /-
                            </span>
                        </div>
                    </div> : null
                }
            </div>
            {userData?.isPartialRetreat === YesNoType.No ?
                <>
                    <div className="mb-8">
                        <label className="block text-sm font-semibold text-teal-800">Do you require accommodation?*</label>
                        <div className="mt-4 flex items-center gap-6">
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="radio"
                                    name="isAccommodationRequired"
                                    value={YesNoType.Yes}
                                    required
                                    checked={userData?.isAccommodationRequired === YesNoType.Yes}
                                    onChange={handleChange}
                                    className="text-teal-500 focus:ring-teal-500"
                                />
                                <span className="ml-2 text-teal-700">Yes</span>
                            </label>
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="radio"
                                    name="isAccommodationRequired"
                                    value={YesNoType.No}
                                    checked={userData?.isAccommodationRequired === YesNoType.No}
                                    onChange={handleChange}
                                    className="text-teal-500 focus:ring-teal-500"
                                />
                                <span className="ml-2 text-teal-700">No</span>
                            </label>
                        </div>
                    </div>
                    {userData?.isAccommodationRequired === YesNoType.Yes ?
                        <div id="accommodation-options" className="mb-8">
                            <label htmlFor="accommodation-type" className="block text-sm font-semibold text-teal-800">Select Accommodation Type</label>
                            <div className="mt-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-teal-900 text-sm">Bed type</span>
                                    <span className="text-teal-900 text-sm">Spots Available</span>
                                    <span className="text-teal-900 text-sm">Contribution per spot</span>
                                    <span className="text-teal-900 text-sm">Selected ({roomQuantity["2AB"] + roomQuantity["3AB"] + roomQuantity["4AB"] + roomQuantity["6NAB"]}/{userData.groupSize})</span>
                                </div>
                            </div>
                            {Object.keys(roomQuantity).filter((room) => {
                                return !(userData.travelType === TravelType.Individual && room === BedType.AB4)
                            }).map((room, index: number) => {
                                return (
                                    <div className="mt-2" key={index}>
                                        <div className="flex items-center justify-between">
                                            <span className="text-teal-800 font-mono w-[4ch] inline-block">{room}</span>
                                            <span className="text-teal-800 font-mono w-[4ch] inline-block">{slotList[room as BedType]?.available}</span>
                                            <span className="text-teal-800 font-mono w-[4ch] inline-block">{slotList[room as BedType]?.price}</span>
                                            <div className="flex items-center">
                                                <button
                                                    className="px-2 py-1 text-white bg-teal-500 rounded-full focus:outline-none"
                                                    onClick={() => handleQuantityChange(room as BedType, OperationType.Decrease)}
                                                    type="button"
                                                >
                                                    -
                                                </button>
                                                <span className="mx-2 text-sm text-gray-600 font-mono w-[1ch] inline-block">{roomQuantity[room as BedType]}</span>
                                                <button
                                                    className="px-2 py-1 text-white bg-teal-500 rounded-full focus:outline-none"
                                                    onClick={() => handleQuantityChange(room as BedType, OperationType.Increase)}
                                                    type="button"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                            <div className="mt">
                                <div className="flex items-center justify-around">
                                    <span className="mt-2 text-teal-800">Contribution:</span>
                                    <span className="mt-2 text-teal-800">
                                        Rs. {roomQuantity["2AB"] * slotList["2AB"]?.price + roomQuantity["3AB"] * slotList["3AB"]?.price + roomQuantity["4AB"] * slotList["4AB"]?.price + roomQuantity["6NAB"] * slotList["6NAB"]?.price} /-
                                    </span>
                                </div>
                            </div>
                        </div>
                        : null}
                </> : null
            }
            <div className="container mx-auto px-4 py-8 bg-gray-100 min-h-screen">
                <label className="block text-sm font-semibold text-teal-800">Enter personal details*</label>
                <div className="tabs border-b border-gray-300">
                    <ul className="flex space-x-4 overflow-x-auto">
                        {personalDetails.length && personalDetails.map((personalDetail, index) => (
                            <li key={index} className="cursor-pointer">
                                <button
                                    className={`px-4 py-2 ${activeTab === index
                                        ? "text-white bg-teal-500 rounded-t-md"
                                        : "text-teal-700 hover:text-teal-500"
                                        }`}
                                    onClick={() => handleTabClick(index)}
                                    type="button"
                                >
                                    {personalDetail.name || `Person ${index + 1}`}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="tab-content mt-4 bg-white p-4 shadow rounded">
                    <PersonalDetailsForm handleChange={handlePersonalDetailsChange} index={activeTab} formData={personalDetails[activeTab]} />
                </div>
            </div>

            <div className="mb-4 mt-4">
                <label className="block text-sm font-semibold text-teal-800">WOULD YOU LIKE TO HELP FUND THE RETREAT? <br />
                    The registration fees do not cover the entire cost of the retreat. We need your support to continue running the program. If you are interested in sponsoring some area of the retreat, please select from the services below and we can write back with more details.
                </label>
                <select
                    name="donationAmount"
                    defaultValue={userData.donationAmount}
                    onChange={handleChange}
                    required
                    className="mt-2 block w-full rounded-lg border border-teal-400 shadow-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-300 transition-all duration-200"
                >
                    <option value={0}>Rs. 0/-</option>
                    <option value={1000}>Rs. 1000/-</option>
                    <option value={2000}>Rs. 2000/-</option>
                </select>
            </div>

            <div className="mb-4 mt-4">
                <label className="block text-sm font-semibold text-teal-800">Any comments/suggestions/feedback? </label>
                <input
                    type="text"
                    id="text"
                    name="suggestions"
                    required
                    onChange={handleChange}
                    value={userData?.suggestions}
                    className="mt-2 block w-full rounded-lg border border-teal-400 shadow-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-300 transition-all duration-200"
                />
            </div>

            <div className="mb-8">
                <label htmlFor="discount" className="block text-sm font-semibold text-teal-800">Discount Coupon</label>
                <div className="mt-2 flex">
                    <input
                        type="text"
                        id="discount"
                        name="coupon"
                        onChange={handleChange}
                        value={userData?.coupon}
                        className="flex-grow rounded-lg border border-teal-400 shadow-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-300 transition-all duration-200"
                    />
                    <button
                        type="button"
                        onClick={handleApplyCoupon}
                        className="ml-4 px-4 py-2 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-teal-300"
                    >
                        Apply
                    </button>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 bg-gray-100">
                <span className="block text-sm font-semibold text-teal-800">Contributions summary</span>
                <div className="mt-2">
                    <div className="flex items-center justify-between">
                        <span className="text-teal-900">Ameneties</span>
                        <span className="text-teal-900">Contributions</span>
                    </div>
                </div>
                <div className="mt-1">
                    <div className="flex items-center justify-between">
                        <span className="text-teal-900">Arrival lunch</span>
                        <span className="text-teal-900">Rs.{userData?.isArrivalLunchRequired ? userData?.groupSize * priceList.arrivalLunch : 0}/-</span>
                    </div>
                </div>
                <div className="mt-1">
                    <div className="flex items-center justify-between">
                        <span className="text-teal-900">Departure lunch lunch</span>
                        <span className="text-teal-900">Rs.{userData?.isDepartureLunchRequired ? userData?.groupSize * priceList.departureLunch : 0}/-</span>
                    </div>
                </div>
                <div className="mt-1">
                    <div className="flex items-center justify-between">
                        <span className="text-teal-900">Prasad during retreat</span>
                        <span className="text-teal-900">Rs.{userData?.isFoodRequired ? userData?.groupSize * priceList.foodFees * getDateDifferenceFromString(userData?.startDate, userData?.endDate) : 0}/-</span>
                    </div>
                </div>
                <div className="mt-1">
                    <div className="flex items-center justify-between">
                        <span className="text-teal-900">Accommodation</span>
                        <span className="text-teal-900">Rs.{userData?.isAccommodationRequired ? roomQuantity["2AB"] * slotList["2AB"]?.price + roomQuantity["3AB"] * slotList["3AB"]?.price + roomQuantity["4AB"] * slotList["4AB"]?.price + roomQuantity["6NAB"] * slotList["6NAB"]?.price : 0}/-</span>
                    </div>
                </div>

                <div className="mt-1 border-t-4 border-teal-800">
                    <div className="flex items-center justify-between">
                        <span className="text-teal-900">Total Contribution</span>
                        <span className="text-teal-900">Rs. {
                            (userData?.isArrivalLunchRequired ? userData?.groupSize * priceList.arrivalLunch : 0) +
                            (userData?.isDepartureLunchRequired ? userData?.groupSize * priceList.departureLunch : 0) +
                            (userData?.isFoodRequired ? userData?.groupSize * priceList.foodFees * getDateDifferenceFromString(userData?.startDate, userData?.endDate) : 0) +
                            (userData?.isAccommodationRequired ? roomQuantity["2AB"] * slotList["2AB"]?.price + roomQuantity["3AB"] * slotList["3AB"]?.price + roomQuantity["4AB"] * slotList["4AB"]?.price + roomQuantity["6NAB"] * slotList["6NAB"]?.price : 0)
                        } /-</span>
                    </div>
                </div>
                <div className="mt-1">
                    <div className="flex items-center justify-between">
                        <span className="text-teal-900">Coupon Discount </span>
                        <span className="text-teal-900">{couponPct}%</span>
                    </div>
                </div>
                <div className="mt-1">
                    <div className="flex items-center justify-between">
                        <span className="text-teal-900">Final Contribution </span>
                        <span className="text-teal-900">Rs. {
                            Math.round((
                                (userData?.isArrivalLunchRequired ? userData?.groupSize * priceList.arrivalLunch : 0) +
                                (userData?.isDepartureLunchRequired ? userData?.groupSize * priceList.departureLunch : 0) +
                                (userData?.isFoodRequired ? userData?.groupSize * priceList.foodFees * getDateDifferenceFromString(userData?.startDate, userData?.endDate) : 0) +
                                (userData?.isAccommodationRequired ? roomQuantity["2AB"] * slotList["2AB"]?.price + roomQuantity["3AB"] * slotList["3AB"]?.price + roomQuantity["4AB"] * slotList["4AB"]?.price + roomQuantity["6NAB"] * slotList["6NAB"]?.price : 0)
                            ) * (100 - couponPct) / 100)
                        } /- </span>
                    </div>
                </div>
            </div>
            <div className="text-center mt-3">
                <button
                    type="submit"
                    className="px-8 py-3 bg-teal-500 text-white font-semibold rounded-full shadow-lg hover:bg-teal-600 transition-all duration-200"
                >
                    Submit
                </button>
            </div>
        </form>
    );
}
