import React, { useState } from "react";
import ApplicationLogo from "@/Components/ApplicationLogo";
import Dropdown from "@/Components/Dropdown";
import NavLink from "@/Components/NavLink";
import ResponsiveNavLink from "@/Components/ResponsiveNavLink";
import DangerButton from "../Components/DangerButton";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../App.jsx";

export default function Authenticated({ pathname = "", header, children }) {
    const navigate = useNavigate();
    const { state, dispatch } = React.useContext(AuthContext);

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    const handleLogout = () => {
        dispatch({
            type: "LOGOUT",
        });
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="shrink-0 flex items-center">
                                <Link to="/">
                                    <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800" />
                                </Link>
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex">
                                <NavLink
                                    href={"/dashboard"}
                                    active={pathname.includes("dashboard")}
                                >
                                    Dasbor
                                </NavLink>
                                {state.user.role === "ADMINISTRATOR" && (
                                    <NavLink
                                        href={"/admin/users"}
                                        active={pathname.includes("users")}
                                    >
                                        Pengguna
                                    </NavLink>
                                )}
                                {(state.user.role === "ADMINISTRATOR" ||
                                    state.user.role === "OPERATOR") && (
                                    <>
                                        <NavLink
                                            href={"/admin/simulations"}
                                            active={pathname.includes(
                                                "simulations"
                                            )}
                                        >
                                            Simulasi
                                        </NavLink>
                                        <NavLink
                                            href={"/admin/components"}
                                            active={pathname.includes(
                                                "components"
                                            )}
                                        >
                                            Komponen
                                        </NavLink>
                                    </>
                                )}
                                {state.user.role === "USER" && (
                                    <>
                                        <NavLink
                                            href={"/user/simulations"}
                                            active={
                                                pathname === "/user/simulations"
                                            }
                                        >
                                            Simulasi Saya
                                        </NavLink>
                                        <NavLink
                                            href={"/simulations"}
                                            active={pathname === "/simulations"}
                                        >
                                            Simulasi
                                        </NavLink>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="hidden sm:flex sm:items-center sm:ml-6">
                            <div className="ml-3 relative">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150"
                                            >
                                                {state.user.name}

                                                <svg
                                                    className="ml-2 -mr-0.5 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Link
                                            to="/profile"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                        >
                                            Profil
                                        </Link>
                                        <DangerButton
                                            className="w-full text-left"
                                            onClick={handleLogout}
                                        >
                                            Log out
                                        </DangerButton>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-mr-2 flex items-center sm:hidden">
                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(
                                        (previousState) => !previousState
                                    )
                                }
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out"
                            >
                                <svg
                                    className="h-6 w-6"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        className={
                                            !showingNavigationDropdown
                                                ? "inline-flex"
                                                : "hidden"
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={
                                            showingNavigationDropdown
                                                ? "inline-flex"
                                                : "hidden"
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    className={
                        (showingNavigationDropdown ? "block" : "hidden") +
                        " sm:hidden"
                    }
                >
                    <div className="pt-2 pb-3 space-y-1">
                        <ResponsiveNavLink
                            href={"/dashboard"}
                            active={pathname === "/dashboard"}
                        >
                            Dashboard
                        </ResponsiveNavLink>
                    </div>

                    <div className="pt-4 pb-1 border-t border-gray-200">
                        <div className="px-4">
                            <div className="font-medium text-base text-gray-800">
                                {state.user.name}
                            </div>
                            <div className="font-medium text-sm text-gray-500">
                                {state.user.email}
                            </div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <DangerButton onClick={handleLogout}>
                                Log Out
                            </DangerButton>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-white shadow">
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main>{children}</main>
        </div>
    );
}
