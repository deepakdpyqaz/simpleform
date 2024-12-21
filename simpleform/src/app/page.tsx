import Image from "next/image";

export default function Home() {
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
                        className="mt-2 block w-full rounded-lg border border-teal-400 shadow-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-300 transition-all duration-200"
                    />
                </div>

                <div className="mb-8">
                    <label className="block text-sm font-semibold text-teal-800">Are you registering for an individual (14+ years)?*</label>
                    <div className="mt-4 flex items-center gap-6">
                        <label className="flex items-center cursor-pointer">
                            <input
                                type="radio"
                                name="individual"
                                value="yes"
                                required
                                className="text-teal-500 focus:ring-teal-500"
                            />
                            <span className="ml-2 text-teal-700">Yes</span>
                        </label>
                        <label className="flex items-center cursor-pointer">
                            <input
                                type="radio"
                                name="individual"
                                value="no"
                                className="text-teal-500 focus:ring-teal-500"
                            />
                            <span className="ml-2 text-teal-700">No</span>
                        </label>
                    </div>
                </div>

                <div id="group-registration" className="hidden mb-8">
                    <label htmlFor="group-size" className="block text-sm font-semibold text-teal-800">Number of group members (2-6)</label>
                    <input
                        type="number"
                        id="group-size"
                        name="group-size"
                        min="2"
                        max="6"
                        className="mt-2 block w-full rounded-lg border border-teal-400 shadow-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-300 transition-all duration-200"
                    />
                </div>

                <div className="mb-8">
                    <label className="block text-sm font-semibold text-teal-800">Do you require accommodation?*</label>
                    <div className="mt-4 flex items-center gap-6">
                        <label className="flex items-center cursor-pointer">
                            <input
                                type="radio"
                                name="accommodation"
                                value="yes"
                                required
                                className="text-teal-500 focus:ring-teal-500"
                            />
                            <span className="ml-2 text-teal-700">Yes</span>
                        </label>
                        <label className="flex items-center cursor-pointer">
                            <input
                                type="radio"
                                name="accommodation"
                                value="no"
                                className="text-teal-500 focus:ring-teal-500"
                            />
                            <span className="ml-2 text-teal-700">No</span>
                        </label>
                    </div>
                </div>

                <div id="accommodation-options" className="hidden mb-8">
                    <label htmlFor="accommodation-type" className="block text-sm font-semibold text-teal-800">Select Accommodation Type</label>
                    <select
                        id="accommodation-type"
                        name="accommodation-type"
                        className="mt-2 block w-full rounded-lg border border-teal-400 shadow-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-300 transition-all duration-200"
                    >
                        <option value="2AB">2AB</option>
                        <option value="3AB">3AB</option>
                        <option value="2AB-extra">2AB + Extra Bed</option>
                        <option value="4AB">4AB</option>
                        <option value="6NAB">6NAB</option>
                    </select>
                </div>

                <fieldset className="mb-8">
                    <legend className="text-lg font-semibold text-teal-800">Personal Details</legend>
                    <div className="mt-6 space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-semibold text-teal-800">Name (as per ID)*</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                required
                                className="mt-2 block w-full rounded-lg border border-teal-400 shadow-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-300 transition-all duration-200"
                            />
                        </div>
                        <div>
                            <label htmlFor="dob" className="block text-sm font-semibold text-teal-800">Date of Birth*</label>
                            <input
                                type="date"
                                id="dob"
                                name="dob"
                                required
                                className="mt-2 block w-full rounded-lg border border-teal-400 shadow-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-300 transition-all duration-200"
                            />
                        </div>
                        <div>
                            <label htmlFor="nationality" className="block text-sm font-semibold text-teal-800">Nationality*</label>
                            <input
                                type="text"
                                id="nationality"
                                name="nationality"
                                required
                                className="mt-2 block w-full rounded-lg border border-teal-400 shadow-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-300 transition-all duration-200"
                            />
                        </div>
                    </div>
                </fieldset>

                <div className="mb-8">
                    <label htmlFor="comments" className="block text-sm font-semibold text-teal-800">Comments / Suggestions / Feedback</label>
                    <textarea
                        id="comments"
                        name="comments"
                        rows={4}
                        className="mt-2 block w-full rounded-lg border border-teal-400 shadow-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-300 transition-all duration-200"
                    ></textarea>
                </div>

                <div className="text-center">
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
