import React, { useEffect, useContext } from "react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { AuthContext } from "../../../App.jsx";
import { Link } from "react-router-dom";
import axios from "axios";
import { UPDATE_USER_URL } from "../../../Utils/Constants.js";

export default function UpdateProfileInformationForm({ className }) {
    const { state, dispatch } = useContext(AuthContext);
    const user = state.user;
    const [processing, setProcessing] = React.useState(false);
    const [data, setData] = React.useState({
        name: user.name,
        email: user.email,
    });
    const [error, setError] = React.useState("");

    const submit = (e) => {
        e.preventDefault();
        setProcessing(true);
        axios
            .post(
                UPDATE_USER_URL,
                {
                    name: data.name,
                    email: data.email,
                },
                {
                    headers: {
                        Authorization: state.token,
                    },
                }
            )
            .then((response) => {
                dispatch({
                    type: "LOGIN",
                    payload: {
                        user: response.data.user,
                        token: state.token,
                    },
                });
                setProcessing(false);
            })
            .catch((error) => {
                console.log(error);
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
                setError(message.toString());
            })
            .finally(() => {
                setProcessing(false);
            });
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">
                    Profile Information
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                    Update your account's profile information and email address.
                </p>
                {error && (
                    <p className="text-red-500 cursor-pointer">{error}</p>
                )}
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <div>
                    <InputLabel htmlFor="name" value="Name" />

                    <TextInput
                        id="name"
                        className="mt-1 block w-full"
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                        required
                        isFocused
                        autoComplete="name"
                    />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full"
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                        required
                        autoComplete="username"
                    />
                </div>

                <div className="flex items-center gap-4">
                    <PrimaryButton processing={processing}>Save</PrimaryButton>
                </div>
            </form>
        </section>
    );
}
