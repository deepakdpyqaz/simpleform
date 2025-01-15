"use client";

import {
    priceList,
    TravelType,
    YesNoType,
    BedType,
    OperationType,
    SubmitStatus,
    RegistrationType,
    FoodType,
    GenderType,
} from "./constants";
import { ISlot } from "./api/models/Slot";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PersonalDetailsForm, {
    PersonalDetails,
} from "./components/PersonalDetailsForm";
import Loader from "./components/Loader";
import { getDateDifferenceFromString } from "./api/utils/dateUtils";

type RoomQuantity = {
    [key in BedType]: number;
};

const defaultRoomQuantity: RoomQuantity = {
    [BedType.AB2]: 0,
    [BedType.AB3]: 0,
    [BedType.AB4]: 0,
    [BedType.NAB6]: 0,
};

interface UserData {
    email: string;
    groupSize: number;
    travelType: TravelType | null;
    registrationType: RegistrationType | null;
    isAccommodationRequired: YesNoType | null;
    roomQuantity: RoomQuantity | null;
    isFoodRequired: YesNoType | null;
    isPartialRetreat: YesNoType | null;
    foodType: FoodType | null;
    startDate: string | undefined;
    endDate: string | undefined;
    isArrivalLunchRequired: YesNoType | null;
    isDepartureLunchRequired: YesNoType | null;
    donationAmount: string[] | undefined;
    suggestions: string;
    coupon: string;
    discount: number;
}

const defaultUserData: UserData = {
    email: "",
    groupSize: 1,
    travelType: TravelType.Individual,
    registrationType: null,
    isAccommodationRequired: null,
    roomQuantity: defaultRoomQuantity,
    isFoodRequired: null,
    isPartialRetreat: null,
    foodType: null,
    startDate: "2025-02-23",
    endDate: "2025-03-01",
    isArrivalLunchRequired: null,
    isDepartureLunchRequired: null,
    donationAmount: [],
    suggestions: "",
    coupon: "",
    discount: 0,
};
const defaultPersonalDetails: PersonalDetails = {
    devoteeName: "",
    name: "",
    dob: "",
    nationality: "",
    gender: GenderType.Male,
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
    otherSevaType: "",
};

interface Slot {
    [BedType.AB2]: { price: number; available: number };
    [BedType.AB3]: { price: number; available: number };
    [BedType.AB4]: { price: number; available: number };
    [BedType.NAB6]: { price: number; available: number };
}

const defaultSlot: Slot = {
    [BedType.AB2]: {
        price: 0,
        available: 0,
    },
    [BedType.AB3]: {
        price: 0,
        available: 0,
    },
    [BedType.AB4]: {
        price: 0,
        available: 0,
    },
    [BedType.NAB6]: {
        price: 0,
        available: 0,
    },
};

export default function Home() {
    const router = useRouter();
    const [userData, setUserData] = useState<UserData>(defaultUserData);
    const [personalDetails, setPersonalDetails] = useState<PersonalDetails[]>(
        [defaultPersonalDetails],
    );
    const [submitStatus, setSubmitStatus] = useState<SubmitStatus>(
        SubmitStatus.InProgress,
    );
    const [slotList, setSlotList] = useState<Slot>(defaultSlot);
    const [roomQuantity, setRoomQuantity] =
        useState<RoomQuantity>(defaultRoomQuantity);
    const [couponPct, setCouponPct] = useState<number>(0);
    const fetchSlots = async () => {
        try {
            if (personalDetails[0].gender === GenderType.Male || personalDetails[0].gender === GenderType.Female) {
                const res = await fetch("/api/slot");
                const slots: ISlot[] = (await res.json())?.slots as ISlot[];
                const bedPriceList = slots.reduce((acc, slot) => {
                    acc[slot.bedType] = {
                        price: priceList["FRWA"][slot?.bedType],
                        available: slot?.neutralSpotsAvailable + (personalDetails[0].gender === GenderType.Male ? slot?.maleSpotsAvailable : slot?.femaleSpotsAvailable),
                    };
                    return acc;
                }, {} as Slot);
                setSlotList(bedPriceList);
            }
        } catch (error) {
            console.error(error);
            alert("Error in fetching slot list");
        }
    };
    useEffect(() => {
        if (
            userData.groupSize == null ||
            userData.groupSize == undefined ||
            userData.groupSize < 2
        ) {
            setPersonalDetails([]);
        }
        setPersonalDetails((personalDetails) => {
            const personalDetailsCopy = [...personalDetails];
            if (userData.groupSize === personalDetailsCopy.length) {
                return personalDetailsCopy as PersonalDetails[];
            } else if (userData.groupSize < personalDetailsCopy.length) {
                return personalDetailsCopy.splice(
                    userData.groupSize,
                ) as PersonalDetails[];
            } else {
                const newPersonalDetails = Array(
                    userData.groupSize - personalDetails.length,
                ).fill(defaultPersonalDetails);
                return [
                    ...personalDetailsCopy,
                    ...newPersonalDetails,
                ] as PersonalDetails[];
            }
        });
        setUserData((userData) => {
            return { ...userData, roomQuantity: defaultRoomQuantity };
        });
        setRoomQuantity(defaultRoomQuantity);
    }, [userData.groupSize]);
    useEffect(() => {
        setUserData((userData) => {
            return {
                ...userData,
                groupSize: userData.travelType === TravelType.Group ? 2 : 1,
            } as UserData;
        });
    }, [userData.travelType]);
    useEffect(() => {
        setUserData((userData) => {
            return {
                ...userData,
                isAccommodationRequired: YesNoType.No,
                roomQuantity: defaultRoomQuantity,
            } as UserData;
        });
    }, [userData.isPartialRetreat]);
    useEffect(() => {
        if (
            userData.startDate != null &&
            userData.endDate != null &&
            defaultUserData.startDate != null &&
            defaultUserData.endDate != null
        ) {
            let startDate = new Date(userData.startDate);
            let endDate = new Date(userData.endDate);
            let defaultStartDate = new Date(defaultUserData.startDate);
            let defaultEndDate = new Date(defaultUserData.endDate);
            if (
                startDate < endDate &&
                startDate >= defaultStartDate &&
                endDate <= defaultEndDate
            ) {
                return;
            } else if (endDate < startDate) {
                alert("End date cannot be before the start date");
            } else if (startDate < defaultStartDate) {
                alert(
                    `Start date cannot be before ${defaultUserData.startDate}`,
                );
            } else if (startDate == endDate) {
                alert("Please register for atleast one day");
            } else if (endDate > defaultEndDate) {
                alert(`End date cannot be after ${defaultUserData.endDate}`);
            } else {
                alert("Invalid date range");
            }
        }
        setUserData((userData) => {
            return {
                ...userData,
                startDate: defaultUserData.startDate,
                endDate: defaultUserData.endDate,
            } as UserData;
        });
    }, [userData.startDate, userData.endDate]);
    useEffect(() => {
        fetchSlots();
    }, [personalDetails[0].gender]);
    const handleChange = (
        e:
            | React.ChangeEvent<HTMLInputElement>
            | React.ChangeEvent<HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        if (name === "donationOptions") {
            let donationAmount = userData.donationAmount ? [...userData.donationAmount] : [];
            if (donationAmount.includes(value)) {
                donationAmount = donationAmount.filter((amount) => amount !== value);
            } else {
                donationAmount.push(value);
            }
            setUserData((userData) => {
                return {
                    ...userData,
                    donationAmount: donationAmount,
                } as UserData;
            });
            return;
        }
        setUserData(
            (prevState: UserData | undefined) =>
                ({
                    ...prevState,
                    [name]: value,
                }) as UserData,
        );
    };
    const handlePersonalDetailsChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
        index: number,
    ) => {
        const { name, value } = e.target;
        if (name === "dob") {
            let dob = new Date(value);
            if (dob > new Date("2013-03-01")) {
                alert("Age should be greater than 12");
                return;
            }
        }
        let personalDetailsCopy = [...personalDetails];
        let formData: any = { ...personalDetails[index] };
        formData[name] = value;
        personalDetailsCopy[index] = formData;
        setPersonalDetails(personalDetailsCopy);
    };

    const [activeTab, setActiveTab] = useState<number>(0);

    const handleTabClick = (index: number) => {
        setActiveTab(index);
    };
    function validatePhoneNumber(phoneNumber: string): boolean {
        const regex =
            /^[+]?[0-9]{1,4}?[-.\s]?[(]?[0-9]{1,3}?[)]?[-.\s]?[0-9]{3,4}[-.\s]?[0-9]{3,4}$/;
        return regex.test(phoneNumber);
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        let charges = Math.round(
            (((userData?.registrationType === RegistrationType.PR ?
                priceList["PR"].partialRegistrationCharges *
                userData?.groupSize *
                getDateDifferenceFromString(
                    userData?.startDate,
                    userData?.endDate,
                ) : 0
            ) +
                (userData?.isArrivalLunchRequired ===
                    YesNoType.Yes
                    ? userData?.groupSize *
                    priceList.arrivalLunch
                    : 0) +
                (
                    userData?.registrationType === RegistrationType.FRWA && userData?.roomQuantity != null ? (priceList["FRWA"] as any)[Object.keys(userData?.roomQuantity).filter((item, idx, arr) => (userData?.roomQuantity as any)[item] > 0)[0] as any] : 0
                ) +
                (userData?.registrationType === RegistrationType.FRWOA ? priceList["FRWOA"].charges : 0) +
                (userData?.isDepartureLunchRequired ===
                    YesNoType.Yes
                    ? userData?.groupSize *
                    priceList.departureLunch
                    : 0) +
                ((userData?.registrationType === RegistrationType.FRWOA || userData?.registrationType === RegistrationType.PR) && (userData?.foodType !== FoodType.NONE && userData?.foodType !== null) ?
                    userData?.groupSize *
                    priceList[userData?.registrationType].foodFees[userData?.foodType] *
                    (userData?.registrationType === RegistrationType.PR ? getDateDifferenceFromString(
                        userData?.startDate,
                        userData?.endDate,
                    ) : 1)
                    : 0)) *
                (100 - couponPct)) /
            100,

        );
        personalDetails.forEach((personalDetail: PersonalDetails) => {
            if (!validatePhoneNumber(personalDetail.whatsappNumber)) {
                alert("Invalid contact number format");
                return false;
            }
        })
        if (userData.travelType === TravelType.Group && defaultUserData.groupSize < 2 || userData.groupSize > 6) {
            alert("Group size should be between 2 and 6");
            return;
        }
        let body = { ...userData, personalDetails: personalDetails, charges: charges, discount: couponPct }
        try {
            setSubmitStatus(SubmitStatus.Pending);
            const response = await fetch("/api/form", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });

            if (response.ok) {
                setSubmitStatus(SubmitStatus.Submitted);
                setUserData(defaultUserData);
                setPersonalDetails([]);
                const body = await response.json();
                const isPaymentRequired = body?.isPaymentRequired || YesNoType.Yes;
                if (isPaymentRequired == YesNoType.No) {
                    router.push("/payment/success");
                } else {
                    const query = new URLSearchParams({ id: body.id }).toString();
                    router.push(`/payment?${query}`);
                }
            } else {
                const errorData = await response.json();
                setSubmitStatus(SubmitStatus.Failed);
                alert("Error in submitting form");
            }
        } catch (error) {
            setSubmitStatus(SubmitStatus.Failed);
            alert("Error in submitting form");
        }
    };

    const validateRoomQuantity = (roomQty: RoomQuantity): boolean => {
        if (
            userData.groupSize <
            roomQty["2AB"] + roomQty["3AB"] + roomQty["4AB"] + roomQty["6NAB"]
        )
            return false;
        if (userData.travelType === TravelType.Individual && roomQty["4AB"] > 0)
            return false;
        return true;
    };
    const handleQuantityChange = (btype: BedType, operation: OperationType) => {
        try {
            setRoomQuantity((roomQuantity): RoomQuantity => {
                let roomQty: RoomQuantity = { ...roomQuantity };
                if (operation === OperationType.Increase) {
                    if (slotList[btype].available <= roomQty[btype]) {
                        alert("Not enough slots available");
                    } else {
                        roomQty[btype] = roomQty[btype] + 1;
                    }
                } else if (operation === OperationType.Decrease) {
                    if (roomQty[btype] > 0) {
                        roomQty[btype] = roomQty[btype] - 1;
                    } else {
                        alert("Cannot decrease beyond 0");
                    }
                } else {
                    alert("Wrong operation");
                }
                if (validateRoomQuantity(roomQty)) {
                    setUserData((userData) => {
                        return {
                            ...userData,
                            roomQuantity: roomQty,
                        } as UserData;
                    });
                    return roomQty;
                } else {
                    alert("Can't book more slots than required");
                    return roomQuantity;
                }
            });
        } catch (error) {
            console.error(error);
            alert("Error in updating quantity");
        }
    };
    const handleApplyCoupon = async () => {
        if (userData.coupon === "") {
            alert("Please enter a coupon code");
            return;
        }
        try {
            const response = await fetch(
                `/api/coupon?coupon=${userData.coupon}`,
            );
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
    };
    return (
        <>
            {submitStatus === SubmitStatus.Pending ? <Loader /> : null}
            <form
                onSubmit={handleSubmit}
                className="bg-white shadow-2xl rounded-xl p-8 max-w-lg mx-auto border border-teal-300"
            >
                <div className="container mx-auto px-4 py-3 my-2 bg-gray-200">
                    <div className="mb-8">
                        <label className="block text-sm font-semibold text-teal-800">Name (in passport/ID)*</label>
                        <input
                            type="text"
                            name="name"
                            value={personalDetails[0]?.name}
                            onChange={(e) => handlePersonalDetailsChange(e, 0)}
                            required
                            className="mt-2 block w-full rounded-lg border border-teal-400 shadow-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-300 transition-all duration-200"
                        />
                    </div>
                    <div className="mb-8">
                        <label
                            htmlFor="email"
                            className="block text-sm font-semibold text-teal-800"
                        >
                            Email*
                        </label>
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
                        <label className="block text-sm font-semibold text-teal-800">Gender*</label>
                        <select
                            name="gender"
                            defaultValue={GenderType.Male}
                            onChange={(e) => handlePersonalDetailsChange(e, 0)}
                            required
                            className="mt-2 block w-full rounded-lg border border-teal-400 shadow-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-300 transition-all duration-200"
                        >
                            <option className="text-sm text-teal-800" value={GenderType.Male}>Male</option>
                            <option className="text-sm text-teal-800" value={GenderType.Female}>Female</option>
                        </select>
                    </div>

                    <div className="">
                        <label className="block text-sm font-semibold text-teal-800">What type of registration would you like to opt for retreat? (Accommodation will not be provided for partial retreat)*</label>
                        <div className="mt-4 flex flex-wrap items-center gap-6">
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="radio"
                                    name="registrationType"
                                    value={RegistrationType.FRWA}
                                    required
                                    checked={
                                        userData?.registrationType === RegistrationType.FRWA
                                    }
                                    onChange={handleChange}
                                    className="text-teal-500 focus:ring-teal-500"
                                />
                                <span className="ml-2 text-teal-700">Full registration with accommodation</span>
                            </label>
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="radio"
                                    name="registrationType"
                                    value={RegistrationType.FRWOA}
                                    checked={
                                        userData?.registrationType === RegistrationType.FRWOA
                                    }
                                    onChange={handleChange}
                                    className="text-teal-500 focus:ring-teal-500"
                                />
                                <span className="ml-2 text-teal-700">Full registration without accommodation</span>
                            </label>
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="radio"
                                    name="registrationType"
                                    value={RegistrationType.PR}
                                    checked={
                                        userData?.registrationType === RegistrationType.PR
                                    }
                                    onChange={handleChange}
                                    className="text-teal-500 focus:ring-teal-500"
                                />
                                <span className="ml-2 text-teal-700">Partial registration</span>
                            </label>
                        </div>
                    </div>
                    {userData?.registrationType === RegistrationType.FRWA ? (
                        <div className="container mx-auto px-4 py-3 my-2 bg-gray-200">
                            <div id="accommodation-options" className="">
                                <label
                                    htmlFor="accommodation-type"
                                    className="block text-sm font-semibold text-teal-800"
                                >
                                    Select Accommodation Type
                                </label>
                                <div className="mt-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-teal-900 text-sm">
                                            Bed type
                                        </span>
                                        <span className="text-teal-900 text-sm">
                                            Spots Available
                                        </span>
                                        <span className="text-teal-900 text-sm">
                                            Contribution per spot
                                        </span>
                                        <span className="text-teal-900 text-sm">
                                            Selected (
                                            {roomQuantity["2AB"] +
                                                roomQuantity["3AB"] +
                                                roomQuantity["4AB"] +
                                                roomQuantity["6NAB"]}
                                            /{userData.groupSize})
                                        </span>
                                    </div>
                                </div>
                                {Object.keys(roomQuantity)
                                    .map((room, index: number) => {
                                        return (
                                            <div className="mt-2" key={index}>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-teal-800 font-mono w-[4ch] inline-block">
                                                        {room}
                                                    </span>
                                                    <span className="text-teal-800 font-mono w-[4ch] inline-block">
                                                        {
                                                            slotList[
                                                                room as BedType
                                                            ]?.available
                                                        }
                                                    </span>
                                                    <span className="text-teal-800 font-mono w-[4ch] inline-block">
                                                        {
                                                            slotList[
                                                                room as BedType
                                                            ]?.price
                                                        }
                                                    </span>
                                                    <div className="flex items-center">
                                                        <button
                                                            className="px-2 py-1 text-white bg-teal-500 rounded-full focus:outline-none"
                                                            onClick={() =>
                                                                handleQuantityChange(
                                                                    room as BedType,
                                                                    OperationType.Decrease,
                                                                )
                                                            }
                                                            type="button"
                                                        >
                                                            -
                                                        </button>
                                                        <span className="mx-2 text-sm text-gray-600 font-mono w-[1ch] inline-block">
                                                            {
                                                                roomQuantity[
                                                                room as BedType
                                                                ]
                                                            }
                                                        </span>
                                                        <button
                                                            className="px-2 py-1 text-white bg-teal-500 rounded-full focus:outline-none"
                                                            onClick={() =>
                                                                handleQuantityChange(
                                                                    room as BedType,
                                                                    OperationType.Increase,
                                                                )
                                                            }
                                                            type="button"
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                <div className="mt">
                                    <div className="flex items-center justify-around">
                                        <span className="mt-2 text-teal-800">
                                            Contribution:
                                        </span>
                                        <span className="mt-2 text-teal-800">
                                            Rs.{" "}
                                            {roomQuantity["2AB"] *
                                                slotList["2AB"]?.price +
                                                roomQuantity["3AB"] *
                                                slotList["3AB"]?.price +
                                                roomQuantity["4AB"] *
                                                slotList["4AB"]?.price +
                                                roomQuantity["6NAB"] *
                                                slotList["6NAB"]
                                                    ?.price}{" "}
                                            /-
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : null}
                    {userData?.registrationType === RegistrationType.FRWOA ?
                        <div className="mt">
                            <div className="flex items-center justify-around">
                                <span className="mt-2 text-teal-800">
                                    Contribution:
                                </span>
                                <span className="mt-2 text-teal-800">
                                    Rs. {priceList["FRWOA"]["charges"]}/-
                                </span>
                            </div>
                        </div>
                        : null}
                    {userData?.registrationType === RegistrationType.PR ?
                        <>
                            <div className="mb-2 mt-1 flex flex-col sm:flex-row gap-6">
                                <div className="flex-1">
                                    <label className="block text-sm font-semibold text-teal-800">
                                        Start Date*
                                    </label>
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
                                    <label className="block text-sm font-semibold text-teal-800">
                                        End Date*
                                    </label>
                                    <input
                                        type="date"
                                        name="endDate"
                                        value={userData?.endDate}
                                        onChange={handleChange}
                                        required
                                        className="mt-2 px-3 py-2 border border-teal-500 rounded-md w-full"
                                    />
                                </div>
                            </div>
                            <div className="mb">
                                <div className="flex items-center justify-between">
                                    <span className="mt-2 text-teal-800">
                                        Contribution: Rs.{" "}
                                        {priceList["PR"].partialRegistrationCharges *
                                            userData?.groupSize *
                                            getDateDifferenceFromString(
                                                userData?.startDate,
                                                userData?.endDate,
                                            )}{" "}
                                        /-
                                    </span>
                                </div>
                            </div>
                        </>
                        : null}
                </div>
                <div className="container mx-auto px-4 py-3 my-2 bg-gray-200">
                    <div className="mb-4 mt-2">
                        <label className="block text-sm font-semibold text-teal-800">Prasadam preferences?*</label>
                        <select
                            name="foodType"
                            defaultValue={userData?.registrationType !== RegistrationType.FRWA ? FoodType.NONE : FoodType.REGULAR}
                            onChange={handleChange}
                            required
                            className="mt-2 block w-full rounded-lg border border-teal-400 shadow-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-300 transition-all duration-200"
                        >
                            <option value={FoodType.REGULAR}>Regular</option>
                            <option value={FoodType.GLUTEN_FREE}>Glutten Free</option>
                            <option value={FoodType.VEGAN}>Vegan</option>
                            {userData?.registrationType !== RegistrationType.FRWA ?
                                <option value={FoodType.NONE}>None</option>
                                : null}

                        </select>
                        {userData?.registrationType === RegistrationType.PR || userData?.registrationType === RegistrationType.FRWOA ?
                            <div className="mt">
                                <div className="flex items-center justify-around">
                                    <span className="mt-2 text-teal-800">
                                        Contribution:
                                    </span>
                                    <span className="mt-2 text-teal-800">
                                        Rs.{userData?.foodType !== null ? priceList[userData?.registrationType]["foodFees"][userData.foodType] *
                                            (userData.registrationType === RegistrationType.PR ? getDateDifferenceFromString(userData?.startDate, userData?.endDate) : 1)
                                            : 0} /-
                                    </span>
                                </div>
                            </div>
                            : null}
                    </div>

                    <div className="mb-8">
                        <label className="block text-sm font-semibold text-teal-800">
                            Do you require lunch on the day of arrival? (Rs.{" "}
                            {priceList.arrivalLunch} /- per person) *
                        </label>
                        <div className="mt-4 flex items-center gap-6">
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="radio"
                                    name="isArrivalLunchRequired"
                                    value={YesNoType.Yes}
                                    required
                                    checked={
                                        userData?.isArrivalLunchRequired ===
                                        YesNoType.Yes
                                    }
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
                                    checked={
                                        userData?.isArrivalLunchRequired ===
                                        YesNoType.No
                                    }
                                    onChange={handleChange}
                                    className="text-teal-500 focus:ring-teal-500"
                                />
                                <span className="ml-2 text-teal-700">No</span>
                            </label>
                        </div>
                        {userData?.isArrivalLunchRequired === YesNoType.Yes ? (
                            <div className="mt">
                                <div className="flex items-center justify-between">
                                    <span className="mt-2 text-teal-800">
                                        Contribution: Rs.{" "}
                                        {priceList.arrivalLunch *
                                            userData?.groupSize}{" "}
                                        /-
                                    </span>
                                </div>
                            </div>
                        ) : null}
                    </div>
                    <div className="mb-8">
                        <label className="block text-sm font-semibold text-teal-800">
                            Do you require lunch on the day of departure? (Rs.{" "}
                            {priceList.departureLunch}/- per person)*
                        </label>
                        <div className="mt-4 flex items-center gap-6">
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="radio"
                                    name="isDepartureLunchRequired"
                                    value={YesNoType.Yes}
                                    required
                                    checked={
                                        userData?.isDepartureLunchRequired ===
                                        YesNoType.Yes
                                    }
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
                                    checked={
                                        userData?.isDepartureLunchRequired ===
                                        YesNoType.No
                                    }
                                    onChange={handleChange}
                                    className="text-teal-500 focus:ring-teal-500"
                                />
                                <span className="ml-2 text-teal-700">No</span>
                            </label>
                        </div>
                        {userData?.isDepartureLunchRequired === YesNoType.Yes ? (
                            <div className="mt">
                                <div className="flex items-center justify-between">
                                    <span className="mt-2 text-teal-800">
                                        Contribution: Rs.{" "}
                                        {priceList.departureLunch *
                                            userData?.groupSize}{" "}
                                        /-
                                    </span>
                                </div>
                            </div>
                        ) : null}
                    </div>

                </div>

                <div className="container mx-auto px-4 py-8 bg-gray-100 min-h-screen">
                    <label className="block text-sm font-semibold text-teal-800">
                        Enter personal details*
                    </label>
                    <div className="tabs border-b border-gray-300">
                        <ul className="flex space-x-4 overflow-x-auto">
                            {personalDetails.length &&
                                personalDetails.map((personalDetail, index) => (
                                    <li key={index} className="cursor-pointer">
                                        <button
                                            className={`px-4 py-2 ${activeTab === index
                                                ? "text-white bg-teal-500 rounded-t-md"
                                                : "text-teal-700 hover:text-teal-500"
                                                }`}
                                            onClick={() =>
                                                handleTabClick(index)
                                            }
                                            type="button"
                                        >
                                            {personalDetail.name ||
                                                `Person ${index + 1}`}
                                        </button>
                                    </li>
                                ))}
                        </ul>
                    </div>
                    <div className="tab-content mt-4 bg-white p-4 shadow rounded">
                        <PersonalDetailsForm
                            handleChange={handlePersonalDetailsChange}
                            index={activeTab}
                            formData={personalDetails[activeTab]}
                        />
                    </div>
                </div>

                <div className="mb-4 mt-4">
                    <label className="block text-sm font-semibold text-teal-800">
                        WOULD YOU LIKE TO HELP FUND THE RETREAT? <br />
                        The registration fees do not cover the entire cost of
                        the retreat. We need your support to continue running
                        the program. If you are interested in sponsoring some
                        area of the retreat, please select from the services
                        below and we can write back with more details.
                    </label>
                    <div
                        className="mt-2 max-h-64 overflow-y-auto border border-teal-400 rounded-lg shadow-sm p-2"
                    >
                        {[
                            { id: "assistant", label: "Sponsorship for personal assistant to one of the teachers — USD 1,300 / EUR 1200 / INR 10500" },
                            { id: "dormitory", label: "Dormitory Facility per participant — USD 70 / EURO 70 / INR 6,000" },
                            { id: "mobile", label: "Mobile for video shooting - Samsung Galaxy Ultra S25 - USD 1,800 / EURO 1,700 / INR 1,50,000" },
                            { id: "tripod", label: "Tripod for video shooting - Digitech - USD 70 / EURO 70 / INR 6,000" },
                            { id: "lens", label: "Blue lens / glasses for eye protection - USD 65 / EURO 60 / INR 5,000" },
                            { id: "camera", label: "Camera for photography - USD 700 / EURO 680 / INR 60,000" },
                            { id: "harmonium", label: "Harmonium — USD 210 / EUR 204 / INR 18,000" },
                            { id: "turbans", label: "Turbans & Mukuts for Sri Giriraja - USD 35 / EUR 34 / INR 3,000" },
                            { id: "daksina", label: "Daksina for Surabhi Kunda USD 60 / EUR 58 / INR 5,000" },
                            { id: "canva", label: "One year Canva license - USD 50 / EUR 46 / INR 4,000" },
                            { id: "cowGhee", label: "Pure cow ghee for all participants cooking - USD 1,200 / EUR 1,135 / INR 100,000" },
                            { id: "puja", label: "Daily Puja at the VIHE - USD 15 / EUR 15 / INR 1,200" },
                            { id: "recorder", label: "Digital recorder USD 380 / EUR 365 / INR 32,000" },
                            { id: "oils", label: "Scented oils for Sri Sri Radha Govinda - USD 26 / EUR 24 / INR 2,000" },
                            { id: "incense", label: "Incense for Sri Sri Radha Govinda - USD 30 / EUR 25 / INR 2,000" },
                            { id: "vrajavasi", label: "Pure Vrajavasi cow ghee for puja - USD 20 / EUR 18 / INR 1,500" },
                            { id: "sdCard", label: "Camera SD Card 256GB - USD 55 / EUR 50 / INR 4,200" },
                            { id: "flowers", label: "Flowers for Puja during the retreats - USD 75 / EUR 70 / INR 6,000" },
                            { id: "laptop", label: "I would like to donate a laptop" },
                            { id: "phone", label: "I would like to donate a phone" }
                        ].map((option) => (
                            <label key={option.id} className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    name="donationOptions"
                                    value={option.id}
                                    onChange={handleChange}
                                    checked={userData?.donationAmount?.includes(option.id)}
                                    className="rounded text-teal-600 focus:ring-2 focus:ring-teal-300"
                                />
                                <span className="text-teal-800">{option.label}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="mb-4 mt-4">
                    <label className="block text-sm font-semibold text-teal-800">
                        Any comments/suggestions/feedback?{" "}
                    </label>
                    <input
                        type="text"
                        id="text"
                        name="suggestions"
                        onChange={handleChange}
                        value={userData?.suggestions}
                        className="mt-2 block w-full rounded-lg border border-teal-400 shadow-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-300 transition-all duration-200"
                    />
                </div>

                <div className="mb-8">
                    <label
                        htmlFor="discount"
                        className="block text-sm font-semibold text-teal-800"
                    >
                        Discount Coupon
                    </label>
                    <div className="mt-2 flex flex-col sm:flex-row  items-center">
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
                            className="px-4 py-2 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-teal-300"
                        >
                            Apply
                        </button>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-8 bg-gray-100">
                    <span className="block text-sm font-semibold text-teal-800">
                        Contributions summary
                    </span>
                    <div className="mt-2">
                        <div className="flex items-center justify-between">
                            <span className="text-teal-900">Ameneties</span>
                            <span className="text-teal-900">Contributions</span>
                        </div>
                    </div>
                    {userData?.registrationType === RegistrationType.PR ?
                        <div className="mt-1">
                            <div className="flex items-center justify-between">
                                <span className="text-teal-900">Partial retreat</span>
                                <span className="text-teal-900">
                                    Rs.
                                    {

                                        priceList["PR"].partialRegistrationCharges *
                                        userData?.groupSize *
                                        getDateDifferenceFromString(
                                            userData?.startDate,
                                            userData?.endDate,
                                        )
                                    }
                                    /-
                                </span>
                            </div>
                        </div>
                        : null}
                    {userData?.registrationType === RegistrationType.FRWA ?
                        <div className="mt-1">
                            <div className="flex items-center justify-between">
                                <span className="text-teal-900">Retreat charges</span>
                                <span className="text-teal-900">
                                    Rs.
                                    {
                                        userData?.roomQuantity != null ?
                                            (priceList["FRWA"] as any)[Object.keys(userData?.roomQuantity).filter((item, idx, arr) => (userData?.roomQuantity as any)[item] > 0)[0] as any] : 0
                                    }
                                    /-
                                </span>
                            </div>
                        </div>
                        : null}
                    {userData?.registrationType === RegistrationType.FRWOA ?
                        <div className="mt-1">
                            <div className="flex items-center justify-between">
                                <span className="text-teal-900">Retreat charges</span>
                                <span className="text-teal-900">
                                    Rs.
                                    {
                                        priceList["FRWOA"]["charges"]
                                    }
                                    /-
                                </span>
                            </div>
                        </div>
                        : null}
                    <div className="mt-1">
                        <div className="flex items-center justify-between">
                            <span className="text-teal-900">Arrival lunch</span>
                            <span className="text-teal-900">
                                Rs.
                                {userData?.isArrivalLunchRequired ===
                                    YesNoType.Yes
                                    ? userData?.groupSize *
                                    priceList.arrivalLunch
                                    : 0}
                                /-
                            </span>
                        </div>
                    </div>
                    <div className="mt-1">
                        <div className="flex items-center justify-between">
                            <span className="text-teal-900">
                                Departure lunch
                            </span>
                            <span className="text-teal-900">
                                Rs.
                                {userData?.isDepartureLunchRequired ===
                                    YesNoType.Yes
                                    ? userData?.groupSize *
                                    priceList.departureLunch
                                    : 0}
                                /-
                            </span>
                        </div>
                    </div>
                    {userData?.registrationType === RegistrationType.FRWOA || userData?.registrationType === RegistrationType.PR ?
                        <div className="mt-1">
                            <div className="flex items-center justify-between">
                                <span className="text-teal-900">
                                    Prasad during retreat
                                </span>
                                <span className="text-teal-900">
                                    Rs.
                                    {userData?.foodType !== FoodType.NONE && userData?.foodType !== null
                                        ? userData?.groupSize *
                                        priceList[userData?.registrationType].foodFees[userData?.foodType] *
                                        (userData?.registrationType === RegistrationType.PR ? getDateDifferenceFromString(
                                            userData?.startDate,
                                            userData?.endDate,
                                        ) : 1)
                                        : 0}
                                    /-
                                </span>
                            </div>
                        </div>
                        : null}
                    <div className="mt-1 border-t-4 border-teal-800">
                        <div className="flex items-center justify-between">
                            <span className="text-teal-900">
                                Total Contribution
                            </span>
                            <span className="text-teal-900">
                                Rs.{" "}
                                {(
                                    userData?.registrationType === RegistrationType.PR ?
                                        priceList["PR"].partialRegistrationCharges *
                                        userData?.groupSize *
                                        getDateDifferenceFromString(
                                            userData?.startDate,
                                            userData?.endDate,
                                        ) : 0
                                ) +
                                    (userData?.isArrivalLunchRequired ===
                                        YesNoType.Yes
                                        ? userData?.groupSize *
                                        priceList.arrivalLunch
                                        : 0) +
                                    (
                                        userData?.registrationType === RegistrationType.FRWA && userData?.roomQuantity != null ? (priceList["FRWA"] as any)[Object.keys(userData?.roomQuantity).filter((item, idx, arr) => (userData?.roomQuantity as any)[item] > 0)[0] as any] : 0
                                    ) +
                                    (userData?.registrationType === RegistrationType.FRWOA ? priceList["FRWOA"].charges : 0) +
                                    (userData?.isDepartureLunchRequired ===
                                        YesNoType.Yes
                                        ? userData?.groupSize *
                                        priceList.departureLunch
                                        : 0) +
                                    ((userData?.registrationType === RegistrationType.FRWOA || userData?.registrationType === RegistrationType.PR) && (userData?.foodType !== FoodType.NONE && userData?.foodType !== null) ?
                                        userData?.groupSize *
                                        priceList[userData?.registrationType].foodFees[userData?.foodType] *
                                        (userData?.registrationType === RegistrationType.PR ? getDateDifferenceFromString(
                                            userData?.startDate,
                                            userData?.endDate,
                                        ) : 1)
                                        : 0)
                                }/-
                            </span>
                        </div>
                    </div>
                    <div className="mt-1">
                        <div className="flex items-center justify-between">
                            <span className="text-teal-900">
                                Coupon Discount{" "}
                            </span>
                            <span className="text-teal-900">{couponPct}%</span>
                        </div>
                    </div>
                    <div className="mt-1">
                        <div className="flex items-center justify-between">
                            <span className="text-teal-900">
                                Final Contribution{" "}
                            </span>
                            <span className="text-teal-900">
                                Rs.{" "}
                                {Math.round(
                                    (((
                                        userData?.registrationType === RegistrationType.PR ?
                                            priceList["PR"].partialRegistrationCharges *
                                            userData?.groupSize *
                                            getDateDifferenceFromString(
                                                userData?.startDate,
                                                userData?.endDate,
                                            ) : 0
                                    ) +
                                        (userData?.isArrivalLunchRequired ===
                                            YesNoType.Yes
                                            ? userData?.groupSize *
                                            priceList.arrivalLunch
                                            : 0) +
                                        (
                                            userData?.registrationType === RegistrationType.FRWA && userData?.roomQuantity != null ? (priceList["FRWA"] as any)[Object.keys(userData?.roomQuantity).filter((item, idx, arr) => (userData?.roomQuantity as any)[item] > 0)[0] as any] : 0
                                        ) +
                                        (userData?.registrationType === RegistrationType.FRWOA ? priceList["FRWOA"].charges : 0) +
                                        (userData?.isDepartureLunchRequired ===
                                            YesNoType.Yes
                                            ? userData?.groupSize *
                                            priceList.departureLunch
                                            : 0) +
                                        ((userData?.registrationType === RegistrationType.FRWOA || userData?.registrationType === RegistrationType.PR) && (userData?.foodType !== FoodType.NONE && userData?.foodType !== null) ?
                                            userData?.groupSize *
                                            priceList[userData?.registrationType].foodFees[userData?.foodType] *
                                            (userData?.registrationType === RegistrationType.PR ? getDateDifferenceFromString(
                                                userData?.startDate,
                                                userData?.endDate,
                                            ) : 1)
                                            : 0)) *
                                        (100 - couponPct)) /
                                    100,
                                )}/-{" "}
                            </span>
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
        </>
    );
}
