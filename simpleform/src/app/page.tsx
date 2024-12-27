"use client";
import Image from "next/image";
import { AccomodationType, priceList, TravelType, YesNoType } from "./constants";
import React, { useState, useEffect, act } from "react";
import PersonalDetailsForm, { PersonalDetails } from "./components/PersonalDetailsForm";


interface UserData {
    username: string;
    email: string;
    password: string;
    groupSize: number;
    travelType: TravelType | null;
    isAccommodationRequired: YesNoType | null;
    accommodationType: AccomodationType | null;
    isFoodRequired: YesNoType | null;
    isPartialRetreat: YesNoType | null;
    startDate: string | undefined;
    endDate: string | undefined;
}
const defaultUserData: UserData = {
    username: "",
    email: "",
    password: "",
    groupSize: 1,
    travelType: null,
    isAccommodationRequired: null,
    accommodationType: null,
    isFoodRequired: null,
    isPartialRetreat: null,
    startDate: undefined,
    endDate: undefined,
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
    sevaType: ""
}



export default function Home() {

    const [userData, setUserData] = useState<UserData>(defaultUserData);
    const [charges, setCharges] = useState<Number>(0);
    const [tarrifMessage, setTarrifMessage] = useState<String>("");
    const [personalDetails, setPersonalDetails] = useState<PersonalDetails[]>([]);
    const tarrifCalculator = () => {
        setCharges(0);
        setTarrifMessage("");
        let charge = 0;
        if (userData.travelType == TravelType.Individual) {
            charge += priceList.basePrice;
            if (userData.isAccommodationRequired === YesNoType.Yes) {
                if (userData.accommodationType === AccomodationType.Room) {
                    charge += priceList.perRoom;
                }
                else if (userData.accommodationType === AccomodationType.Dormatory) {
                    charge += priceList.perDormatory;
                }
                else {
                    setTarrifMessage("");
                    setCharges(0);
                }
            }
            if (userData.isFoodRequired === YesNoType.Yes) {
                charge += priceList.foodFees;
            }
            setCharges(charge);
            setTarrifMessage(`Charges: ${charge}`);
        }
        else if (userData.travelType === TravelType.Group && userData.groupSize >= 2) {
            charge += priceList.basePrice * userData.groupSize;
            let room = 0;
            let extraBed = false;
            if (userData.isAccommodationRequired === YesNoType.Yes) {
                if (userData.isFoodRequired === YesNoType.Yes) {
                    charge += priceList.foodFees * userData.groupSize;
                }
                room = Math.floor(userData.groupSize / 2);
                extraBed = userData.groupSize % 2 !== 0;
                if (userData.accommodationType === AccomodationType.Room) {
                    charge += priceList.perRoom * room;
                    if (extraBed) {
                        charge += priceList.extraBedRoom;
                    }
                    setTarrifMessage(`${room > 0 ? 'Rooms: ' + room : ''}` + '\n' + `${extraBed ? '1 room with extra bed' : ''}\nCharges: ${charge}`);
                }
                else if (userData.accommodationType === AccomodationType.Dormatory) {
                    charge += priceList.perDormatory * userData.groupSize;
                    setTarrifMessage(`Charges: ${charge}`);
                }
                else {
                    setTarrifMessage("");
                    setCharges(0);
                }
            }

            setCharges(charge);

        }
        else {
            setCharges(0);
            setTarrifMessage("");
        }
    }
    useEffect(tarrifCalculator, [userData.accommodationType, userData.groupSize, userData.isAccommodationRequired, userData.travelType]);
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
    }, [userData.groupSize]);
    useEffect(() => {
        setUserData(userData => {
            return { ...userData, groupSize: userData.travelType === TravelType.Group ? 2 : 1 } as UserData;
        })
    }, [userData.travelType])
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

    return (
        <div className="container mx-auto px-4 py-8 bg-gradient-to-b from-teal-200 to-white min-h-screen">
            <header className="text-center mb-12">
                <h1 className="text-4xl font-extrabold text-teal-800">VIHE Saranagati Retreat 2025</h1>
                <p className="text-lg mt-2 text-teal-700">February 23 - March 1, 2025 | Govardhan Retreat Centre</p>
            </header>

            <form className="bg-white shadow-2xl rounded-xl p-8 max-w-lg mx-auto border border-teal-300">
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
                    <label className="block text-sm font-semibold text-teal-800">Do you require prasad?*</label>
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
                </div>
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
                        <select
                            id="accommodation-type"
                            name="accommodationType"
                            className="mt-2 block w-full rounded-lg border border-teal-400 shadow-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-300 transition-all duration-200"
                            onChange={handleChange}
                            defaultValue={AccomodationType.Room}
                        >
                            <option value={AccomodationType.Room}>Room</option>
                            <option value={AccomodationType.Dormatory}>Dormatory</option>
                        </select>
                        {true ?
                            <pre className="mt-2 text-sm text-gray-600">
                                {tarrifMessage}
                            </pre> : null
                        }
                    </div>
                    : null}
                <div className="mb-8">
                    <label className="block text-sm font-semibold text-teal-800">Do you want a partial retreat?*</label>
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
                {userData?.isPartialRetreat === YesNoType.Yes && (
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
                    </div>)}
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
                <div className="text-center mt-3">
                    <button
                        type="submit"
                        className="px-8 py-3 bg-teal-500 text-white font-semibold rounded-full shadow-lg hover:bg-teal-600 transition-all duration-200"
                    >
                        Submit
                    </button>
                </div>
            </form>
        </div>


    );
}


// https://ideal-space-acorn-7xr67wxrqx92rw9r-3000.app.github.dev/