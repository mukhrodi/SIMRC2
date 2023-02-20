import React, { useEffect } from "react";
import GuestLayout from "@/Layouts/GuestLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { REGISTER_URL } from "../../Utils/Constants";
import { AuthContext } from "../../App.jsx";

export default function Register() {
    const navigate = useNavigate();
    const { dispatch } = React.useContext(AuthContext);

    const initialState = {
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        isSubmitting: false,
        errorMessage: null,
    };

    const [data, setData] = React.useState(initialState);

    useEffect(() => {
        return () => {
            setData(initialState);
        };
    }, []);

    const handleInputChange = (event) => {
        setData({
            ...data,
            [event.target.name]: event.target.value,
        });
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        setData({
            ...data,
            isSubmitting: true,
            errorMessage: null,
        });
        axios
            .post(REGISTER_URL, {
                name: data.name,
                email: data.email,
                password: data.password,
                password_confirmation: data.password_confirmation,
            })
            .then((response) => {
                navigate("/login", { replace: true });
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
            <form onSubmit={handleFormSubmit}>
                <div>
                    <InputLabel forInput="name" value="Name" />

                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="mt-1 block w-full"
                        autoComplete="name"
                        isFocused={true}
                        handleChange={handleInputChange}
                        required
                    />
                </div>

                <div className="mt-4">
                    <InputLabel forInput="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        handleChange={handleInputChange}
                        required
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
                        autoComplete="new-password"
                        handleChange={handleInputChange}
                        required
                    />
                </div>

                <div className="mt-4">
                    <InputLabel
                        forInput="password_confirmation"
                        value="Confirm Password"
                    />

                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        handleChange={handleInputChange}
                        required
                    />
                </div>

                <div className="flex items-center justify-end mt-4">
                    <Link
                        to={"/login"}
                        className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Already registered?
                    </Link>

                    <PrimaryButton className="ml-4">Register</PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
