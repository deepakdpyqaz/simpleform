import React from 'react';
import { GenderType, YesNoType } from '../constants';


interface PersonalDetails {
    devoteeName: string;
    name: string;
    dob: string;
    nationality: string;
    gender: GenderType | null;
    spiritualMaster: string;
    findRetreat: string;
    startYear: string;
    address: string;
    whatsappNumber: string;
    isSnore: YesNoType | null;
    idCopy: string;
    isVolunteer: YesNoType | null;
    occupation: string;
    sevaType: string;

}
const PersonalDetailsForm: React.FC<{//+
    index: number;//+
    formData: PersonalDetails;//+
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, index: number) => void;//+
}> = ({ index, formData, handleChange }) =>{
    return (
        <fieldset>
            <div className="mb-4">
                <label className="block text-sm font-semibold text-teal-800" htmlFor='devoteeName'>Devotee Name</label>
                <input
                    type="text"
                    name="devoteeName"
                    value={formData?.devoteeName}
                    onChange={(e) => handleChange(e, index)}
                    className="mt-2 block w-full rounded-lg border border-teal-400 shadow-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-300 transition-all duration-200"
                />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-semibold text-teal-800">Name (in passport/ID)*</label>
                <input
                    type="text"
                    name="name"
                    value={formData?.name}
                    onChange={(e) => handleChange(e, index)}
                    required
                    className="mt-2 block w-full rounded-lg border border-teal-400 shadow-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-300 transition-all duration-200"
                />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-semibold text-teal-800">Date of Birth (dd-mmm-yyyy)*</label>
                <input
                    type="date"
                    name="dob"
                    value={formData?.dob}
                    onChange={(e) => handleChange(e, index)}
                    required
                    className="mt-2 px-3 py-2 border border-teal-500 rounded-md w-full"
                />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-semibold text-teal-800">Nationality*</label>
                <input
                    type="text"
                    name="nationality"
                    value={formData?.nationality}
                    onChange={(e) => handleChange(e, index)}
                    required
                    className="mt-2 block w-full rounded-lg border border-teal-400 shadow-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-300 transition-all duration-200"
                />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-semibold text-teal-800">Gender*</label>
                <select
                    name="gender"
                    defaultValue={GenderType.Male}
                    onChange={(e) => handleChange(e, index)}
                    required
                    className="mt-2 block w-full rounded-lg border border-teal-400 shadow-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-300 transition-all duration-200"
                >
                    <option value={GenderType.Male}>Male</option>
                    <option value={GenderType.Female}>Female</option>
                </select>
            </div>
            <div className="mb-4">
                <label className="block text-sm font-semibold text-teal-800">Initiating Spiritual Master</label>
                <input
                    type="text"
                    name="spiritualMaster"
                    value={formData?.spiritualMaster}
                    onChange={(e) => handleChange(e, index)}
                    className="mt-2 block w-full rounded-lg border border-teal-400 shadow-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-300 transition-all duration-200"
                />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-semibold text-teal-800">How did you find out about the retreat?</label>
                <input
                    type="text"
                    name="findRetreat"
                    value={formData?.findRetreat}
                    onChange={(e) => handleChange(e, index)}
                    className="mt-2 block w-full rounded-lg border border-teal-400 shadow-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-300 transition-all duration-200"
                />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-semibold text-teal-800">Year when you came in touch with the Hare Krishna movement*</label>
                <input
                    className="mt-2 block w-full rounded-lg border border-teal-400 shadow-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-300 transition-all duration-200"
                    type="text"
                    name="startYear"
                    value={formData?.startYear}
                    onChange={(e) => handleChange(e, index)}
                    required
                />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-semibold text-teal-800">Full address of permanent residence*</label>
                <input
                    type="text"
                    name="address"
                    value={formData?.address}
                    onChange={(e) => handleChange(e, index)}
                    required
                    className="mt-2 block w-full rounded-lg border border-teal-400 shadow-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-300 transition-all duration-200"
                />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-semibold text-teal-800">WhatsApp number (Country code followed by the number)*</label>
                <input
                    type="text"
                    name="whatsappNumber"
                    value={formData?.whatsappNumber}
                    onChange={(e) => handleChange(e, index)}
                    required
                    className="mt-2 block w-full rounded-lg border border-teal-400 shadow-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-300 transition-all duration-200"
                />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-semibold text-teal-800">Do you snore?*</label>
                <div className="mt-4 flex items-center gap-6">
                    <label className="flex items-center cursor-pointer">
                        <input
                            type="radio"
                            name="isSnore"
                            value={YesNoType.Yes}
                            checked={formData?.isSnore === YesNoType.Yes}
                            onChange={(e) => handleChange(e, index)}
                            required
                            className="text-teal-500 focus:ring-teal-500"
                        /> <span className="ml-2 text-teal-700">Yes</span></label>
                    <label className="flex items-center cursor-pointer">
                        <input
                            type="radio"
                            name="isSnore"
                            value={YesNoType.No}
                            checked={formData?.isSnore === YesNoType.No}
                            onChange={(e) => handleChange(e, index)}
                            required
                            className="text-teal-500 focus:ring-teal-500"
                        /> <span className="ml-2 text-teal-700">No</span></label>
                </div>
            </div>
            <div className="mb-4">
                <label className="block text-sm font-semibold text-teal-800">ID copy (Passport mandatory for foreigners)</label>
                <input
                    type="text"
                    name="idCopy"
                    value={formData?.idCopy}
                    onChange={(e) => handleChange(e, index)}
                    required
                    className="mt-2 block w-full rounded-lg border border-teal-400 shadow-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-300 transition-all duration-200"
                />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-semibold text-teal-800">Would you like to volunteer for any service during the retreat?*</label>
                <div className="mt-4 flex items-center gap-6">
                    <label className="flex items-center cursor-pointer">
                        <input
                            type="radio"
                            name="isVolunteer"
                            value={YesNoType.Yes}
                            checked={formData?.isVolunteer === YesNoType.Yes}
                            onChange={(e) => handleChange(e, index)}
                            required
                            className="text-teal-500 focus:ring-teal-500"
                        /> <span className="ml-2 text-teal-700">Yes</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                        <input
                            type="radio"
                            name="isVolunteer"
                            value={YesNoType.No}
                            checked={formData?.isVolunteer === YesNoType.No}
                            onChange={(e) => handleChange(e, index)}
                            required
                            className="text-teal-500 focus:ring-teal-500"
                        /> <span className="ml-2 text-teal-700">No</span>
                    </label>
                </div>
            </div>

            {formData?.isVolunteer === YesNoType.Yes && (
                <div>
                    <div className="mb-4">
                        <label className="block text-sm font-semibold text-teal-800">Your occupation*</label>
                        <select
                            name="occupation"
                            value={formData?.occupation}
                            onChange={(e) => handleChange(e, index)}
                            required
                            className="mt-2 block w-full rounded-lg border border-teal-400 shadow-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-300 transition-all duration-200"
                        >
                            <option value="">Select Occupation</option>
                            <option value="Lead kirtan">Lead kirtan</option>
                            <option value="Prasad">Prasad</option>
                            <option value="Setup">Setup</option>
                            <option value="Doctor">Doctor</option>
                            <option value="Mridanga">Mridanga</option>
                            <option value="Nurse">Nurse</option>
                            <option value="Other">Any Seva I would like to do</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label>Type of seva you would like to render?</label>
                        <select
                            name="sevaType"
                            value={formData?.sevaType}
                            onChange={(e) => handleChange(e, index)}
                            className="mt-2 block w-full rounded-lg border border-teal-400 shadow-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-300 transition-all duration-200"
                        >
                            <option value="Lead kirtan">Lead kirtan</option>
                            <option value="Prasad">Prasad</option>
                            <option value="Setup">Setup</option>
                            <option value="Doctor">Doctor</option>
                            <option value="Mridanga">Mridanga</option>
                            <option value="Nurse">Nurse</option>
                            <option value="Other">Any Seva I would like to do</option>
                        </select>
                    </div>
                </div>
            )}
        </fieldset>
    );
};

export default PersonalDetailsForm;
export type { PersonalDetails }