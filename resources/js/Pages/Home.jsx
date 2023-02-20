import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../App.jsx";
import DangerButton from "../Components/DangerButton.jsx";
import { SIMULATION_GET_URL } from "../Utils/Constants.js";
import getImage from "../Utils/ImageProvider.js";

export default function Home() {
    const navigate = useNavigate();
    const { state, dispatch } = React.useContext(AuthContext);

    const [simulations, setSimulations] = React.useState([]);

    React.useEffect(() => {
        axios
            .get(SIMULATION_GET_URL, {
                headers: {
                    Authorization: `${state.token}`,
                },
            })
            .then((response) => {
                setSimulations(response.data.simulations);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    React.useEffect(() => {
        console.log(simulations);
    }, [simulations]);

    const handleLogout = () => {
        dispatch({
            type: "LOGOUT",
        });
        navigate("/login");
    };

    return (
        <>
            <div className="flex min-h-screen bg-gray-100 selection:bg-red-500 selection:text-white">
                <div className="fixed w-full sm:top-0 sm:right-0 p-6">
                    <div className="flex justify-between">
                        <Link
                            to={"/"}
                            className="font-semibold text-gray-600 hover:text-gray-900 focus:outline focus:outline-2 focus:rounded-sm focus:outline-red-500"
                        >
                            SIMRC
                        </Link>

                        {state.isAuthenticated ? (
                            <div className="flex">
                                <Link
                                    to={"/dashboard"}
                                    className="font-semibold text-gray-600 hover:text-gray-900 focus:outline focus:outline-2 focus:rounded-sm focus:outline-red-500"
                                >
                                    Dashboard
                                </Link>
                                <DangerButton
                                    className="ml-4"
                                    onClick={handleLogout}
                                >
                                    Log out
                                </DangerButton>
                            </div>
                        ) : (
                            <div className="flex">
                                <Link
                                    to={"/login"}
                                    className="font-semibold text-gray-600 hover:text-gray-900 focus:outline focus:outline-2 focus:rounded-sm focus:outline-red-500"
                                >
                                    Log in
                                </Link>

                                <Link
                                    to={"/register"}
                                    className="ml-4 font-semibold text-gray-600 hover:text-gray-900 focus:outline focus:outline-2 focus:rounded-sm focus:outline-red-500"
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-6 lg:p-8">
                    <div className="mt-16">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                            {simulations.map((simulation) => (
                                <Link
                                    key={simulation.id}
                                    to={`/simulations/${simulation.id}`}
                                    className="scale-100 p-6 bg-white from-gray-700/50 via-transparent rounded-lg shadow-2xl shadow-gray-500/20 flex motion-safe:hover:scale-[1.01] transition-all duration-250 focus:outline focus:outline-2 focus:outline-red-500"
                                >
                                    <div>
                                        <img
                                            src={getImage(
                                                simulation.image_path
                                            )}
                                            className="h-36 w-36 bg-red-50 flex items-center justify-center rounded-lg shadow-2xl shadow-gray-500/20"
                                        />

                                        <h2 className="mt-6 text-xl font-semibold text-gray-900">
                                            {simulation.name}
                                        </h2>

                                        <p className="mt-4 text-gray-500 text-sm leading-relaxed"></p>
                                    </div>

                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        className="self-center shrink-0 stroke-red-500 w-6 h-6 mx-6"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"
                                        />
                                    </svg>
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-center mt-16 px-6 sm:items-center sm:justify-between">
                        <div className="text-center text-sm text-gray-500 sm:text-left">
                            <div className="flex items-center gap-4">
                                <a
                                    href="https://github.com/sponsors/taylorotwell"
                                    className="group inline-flex items-center hover:text-gray-700 focus:outline focus:outline-2 focus:rounded-sm focus:outline-red-500"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        className="-mt-px mr-1 w-5 h-5 stroke-gray-400 group-hover:stroke-gray-600"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                                        />
                                    </svg>
                                    Sponsor
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .bg-dots-darker {
                    background-image: url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1.22676 0C1.91374 0 2.45351 0.539773 2.45351 1.22676C2.45351 1.91374 1.91374 2.45351 1.22676 2.45351C0.539773 2.45351 0 1.91374 0 1.22676C0 0.539773 0.539773 0 1.22676 0Z' fill='rgba(0,0,0,0.07)'/%3E%3C/svg%3E");
                }
                @media (prefers-color-scheme: dark) {
                    .dark\\:bg-dots-lighter {
                        background-image: url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1.22676 0C1.91374 0 2.45351 0.539773 2.45351 1.22676C2.45351 1.91374 1.91374 2.45351 1.22676 2.45351C0.539773 2.45351 0 1.91374 0 1.22676C0 0.539773 0.539773 0 1.22676 0Z' fill='rgba(255,255,255,0.07)'/%3E%3C/svg%3E");
                    }
                }
            `}</style>
        </>
    );
}
