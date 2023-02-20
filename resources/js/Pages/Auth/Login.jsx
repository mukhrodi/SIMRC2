import React, { useEffect } from "react";
import Checkbox from "@/Components/Checkbox";
import GuestLayout from "@/Layouts/GuestLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "@inertiajs/react";
import axios from "axios";
import { LOGIN_URL } from "../../Utils/Constants";
import { AuthContext } from "../../App.jsx";

export default function Login() {
    const navigate = useNavigate();
    const { dispatch } = React.useContext(AuthContext);

    const initialState = {
        email: "",
        password: "",
        isSubmitting: false,
        errorMessage: null,
    };

    const [data, setData] = React.useState(initialState);

    const handleInputChange = (event) => {
        setData({
            ...data,
            [event.target.name]: event.target.value,
        });
    };

    const handleFormSubmit = (event) => {
        event.preventDefault();
        setData({
            ...data,
            isSubmitting: true,
            errorMessage: null,
        });
        axios
            .post(LOGIN_URL, {
                email: data.email,
                password: data.password,
            })
            .then((response) => {
                navigate("/", { replace: true });

                dispatch({
                    type: "LOGIN",
                    payload: {
                        user: response.data.user,
                        token: `Bearer ${response.data.token}`,
                    },
                });
            })
            .catch((error) => {
                let message = error.message;
                if (error.response && error.response.data) {
                    message = error.response.data.message;
                    if (typeof message === "object") {
                        try {
                            message = Object.values(message).join(",");
                        } catch (error) {
                            message = error.response.data.message;
                        }
                    }
                }
                setData({
                    ...data,
                    isSubmitting: false,
                    errorMessage: message,
                });
            });
    };

    return (
        <GuestLayout>
            {data.errorMessage && (
                <div className="mb-4 font-medium text-sm text-red-600">
                    {data.errorMessage}
                </div>
            )}

            <form onSubmit={handleFormSubmit}>
                <div>
                    <InputLabel forInput="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="email"
                        isFocused={true}
                        handleChange={handleInputChange}
                    />
                </div>

                <div className="mt-4">
                    <InputLabel forInput="password" value="Password" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="current-password"
                        handleChange={handleInputChange}
                    />
                </div>

                <div className="block mt-4">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            value={data.remember}
                            handleChange={handleInputChange}
                        />
                        <span className="ml-2 text-sm text-gray-600">
                            Remember me
                        </span>
                    </label>
                </div>

                <div className="flex items-center justify-end mt-4">
                    <Link
                        to="/register"
                        className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Tidak punya akun? Daftar
                    </Link>
                    <PrimaryButton className="ml-4">Log in</PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
