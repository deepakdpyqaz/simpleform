"use client";
import Image from "next/image";
import { AccommodationType, priceList, TravelType, YesNoType, BedType, OperationType } from "./constants";
import { ISlot } from "./api/models/Slot";
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import PersonalDetailsForm, { PersonalDetails } from "./components/PersonalDetailsForm";


interface UserData {
    email: string;
    groupSize: number;
    travelType: TravelType | null;
    isAccommodationRequired: YesNoType | null;
    accommodationType: AccommodationType | null;
    isFoodRequired: YesNoType | null;
    isPartialRetreat: YesNoType | null;
    startDate: string | undefined;
    endDate: string | undefined;
}

const defaultUserData: UserData = {
    email: "",
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

type RoomQuantity = {
    [key in BedType]: number
}

const defaultRoomQuantity: RoomQuantity = {
    [BedType.AB2]: 0,
    [BedType.AB3]: 0,
    [BedType.AB4]: 0,
    [BedType.NAB6]: 0
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

export default function Home() {
    const router = useRouter();
    const [userData, setUserData] = useState<UserData>(defaultUserData);
    const [charges, setCharges] = useState<Number>(0);
    const [tarrifMessage, setTarrifMessage] = useState<String>("");
    const [personalDetails, setPersonalDetails] = useState<PersonalDetails[]>([]);
    const [submitStatus, setSubmitStatus] = useState<String>("");
    const [slotList, setSlotList] = useState<Slot>(defaultSlot);
    const [roomQuantity, setRoomQuantity] = useState<RoomQuantity>(defaultRoomQuantity);
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
        setCharges(0);
        setTarrifMessage("");
        let charge = 0;
        if (userData.travelType == TravelType.Individual) {
            charge += priceList.basePrice;
            if (userData.isAccommodationRequired === YesNoType.Yes) {
                if (userData.accommodationType === AccommodationType.Room) {
                    charge += priceList.perRoom;
                }
                else if (userData.accommodationType === AccommodationType.Dormatory) {
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
                if (userData.accommodationType === AccommodationType.Room) {
                    charge += priceList.perRoom * room;
                    if (extraBed) {
                        charge += priceList.extraBedRoom;
                    }
                    setTarrifMessage(`${room > 0 ? 'Rooms: ' + room : ''}` + `\n${extraBed ? '1 room with extra bed' : ''}\nCharges: ${charge}`);
                }
                else if (userData.accommodationType === AccommodationType.Dormatory) {
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
        if(userData.groupSize < (roomQty["2AB"] + roomQty["3AB"] + roomQty["4AB"] + roomQty["6NAB"])) return false;
        if(userData.travelType === TravelType.Individual && roomQty["4AB"]>0) return false;
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
                } else[
                    alert("Wrong operation")
                ]
                if (validateRoomQuantity(roomQty))
                    return roomQty;
                else{
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
    return (
        <div className="container mx-auto px-4 py-8 bg-gradient-to-b from-teal-200 to-white min-h-screen">
            <header className="text-center mb-12">
                <h1 className="text-4xl font-extrabold text-teal-800">VIHE Saranagati Retreat 2025</h1>
                <p className="text-lg mt-2 text-teal-700">February 23 - March 1, 2025 | Govardhan Retreat Centre</p>
            </header>

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
                    </div> :
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
                                        <span className="text-teal-900">Bed type</span>
                                        <span className="text-teal-900">Available</span>
                                        <span className="text-teal-900">Price per bed</span>
                                        <span className="text-teal-900">Selected</span>
                                    </div>
                                </div>
                                {Object.keys(roomQuantity).filter((room)=>{
                                    return !(userData.travelType===TravelType.Individual && room===BedType.AB4)
                                }).map((room, index:number) => {
                                    return (
                                        <div className="mt-2" key={index}>
                                            <div className="flex items-center justify-between">
                                                <span className="text-teal-800">{room}</span>
                                                <span className="text-teal-800">{slotList[room as BedType]?.available}</span>
                                                <span className="text-teal-800">{slotList[room as BedType]?.price}</span>
                                                <div className="flex items-center">
                                                    <button
                                                        className="px-2 py-1 text-white bg-teal-500 rounded-full focus:outline-none"
                                                        onClick={() => handleQuantityChange(room as BedType, OperationType.Decrease)}
                                                        type="button"
                                                    >
                                                        -
                                                    </button>
                                                    <span className="mx-2 text-sm text-gray-600">{roomQuantity[room as BedType]}</span>
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

                                {true ?
                                    <pre className="mt-2 text-sm text-gray-600">
                                        {tarrifMessage}
                                    </pre> : null
                                }
                            </div>
                            : null}
                    </>
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
