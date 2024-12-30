import React from "react";

const Loader: React.FC<{
    message?: string; // Optional message to show below the loader
}> = ({ message = "Loading..." }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
            <div className="flex flex-col items-center">
                <div
                    className="animate-spin rounded-full border-4 border-solid border-teal-600 border-t-transparent"
                    style={{
                        width: 60,
                        height: 60,
                    }}
                />
                {message && (
                    <p className="mt-4 text-teal-700 text-lg font-semibold">{message}</p>
                )}
            </div>
        </div>
    );
};

export default Loader;
