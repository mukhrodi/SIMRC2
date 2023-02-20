import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {
    USER_ADD_URL,
    USER_DELETE_URL,
    USER_EDIT_URL,
    USER_GET_URL,
} from "../Utils/Constants";
import getImage from "../Utils/ImageProvider";
import PrimaryButton from "../Components/PrimaryButton";
import Modal from "../Components/Modal";
import TextInput from "../Components/TextInput";
import { AuthContext } from "../App.jsx";
import Select from "react-tailwindcss-select";

export default function Dashboard(props) {
    const { state, dispatch } = React.useContext(AuthContext);
    const [isFormShowing, setFormShowing] = useState(false);
    const [isEditMode, setEditMode] = useState(false);
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState(false);

    const initialState = {
        id: null,
        name: "",
        email: "",
        password: "",
        role: "",
    };
    const [data, setData] = useState(initialState);

    const handleInputChange = (event) => {
        setData({
            ...data,
            [event.target.name]: event.target.value,
        });
    };

    const handleSelectChange = (event) => {
        setData({
            ...data,
            role: event.target.value,
        });
        console.log(event.target.name);
    };

    React.useEffect(() => {
        axios
            .get(USER_GET_URL, {
                headers: {
                    Authorization: state.token,
                },
            })
            .then((response) => {
                setUsers(response.data.users);
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
            });
    }, []);

    const handleAddClick = () => {
        setData(initialState);
        setEditMode(false);
        setFormShowing(true);
    };

    const handleEditClick = (user) => {
        setData(user);
        setEditMode(true);
        setFormShowing(true);
    };

    const handleCancelClick = () => {
        setData(initialState);
        setEditMode(false);
        setFormShowing(false);
    };

    const handleFormSubmit = (event) => {
        setProcessing(true);
        if (isEditMode) {
            handleEditUser(event);
        } else {
            handleAddUser(event);
        }
    };

    const handleEditUser = (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("email", data.email);
        formData.append("password", data.password);
        formData.append("role", data.role);

        axios
            .post(`${USER_EDIT_URL}/${data.id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: state.token,
                },
            })
            .then((response) => {
                let temp = users.map((user) => {
                    if (user.id === response.data.user.id) {
                        return response.data.user;
                    }
                    return user;
                });
                setUsers(temp);
                setFormShowing(false);
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

    const handleAddUser = (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("email", data.email);
        formData.append("password", data.password);
        formData.append("role", data.role);

        axios
            .post(USER_ADD_URL, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: state.token,
                },
            })
            .then((response) => {
                setUsers([...users, response.data.user]);
                setFormShowing(false);
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

    const handleDeleteClick = (user) => {
        axios
            .delete(`${USER_DELETE_URL}/${user.id}`, {
                headers: {
                    Authorization: state.token,
                },
            })
            .then((response) => {
                let temp = users.filter((c) => c.id !== user.id);
                setUsers(temp);
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
            });
    };

    return (
        <AuthenticatedLayout
            pathname="/users"
            header={
                <div className="flex justify-between">
                    <h2 className="inline justify-between font-semibold text-xl text-gray-800 leading-tight">
                        Daftar Pengguna
                    </h2>
                    <PrimaryButton onClick={() => handleAddClick()}>
                        Tambah
                    </PrimaryButton>
                </div>
            }
        >
            <Modal show={isFormShowing}>
                <div className="flex flex-col">
                    <form onSubmit={handleFormSubmit}>
                        <div className="flex justify-between">
                            <h2 className="inline justify-between font-semibold text-xl text-gray-800 leading-tight">
                                {isEditMode ? "Edit" : "Tambah"} Pengguna
                            </h2>
                        </div>
                        <div className="flex flex-col">
                            {error && (
                                <p className="text-red-500 cursor-pointer">
                                    {error}
                                </p>
                            )}
                            <label className="mt-4">Nama Pengguna</label>
                            <TextInput
                                name="name"
                                id="name"
                                type="text"
                                className="mt-1 block w-full"
                                placeholder="Nama Pengguna"
                                value={data.name}
                                handleChange={handleInputChange}
                            />
                            <label className="mt-4">Email</label>
                            <TextInput
                                id="email"
                                name="email"
                                className="mt-1 block w-full"
                                placeholder="Email"
                                value={data.email}
                                handleChange={handleInputChange}
                            />

                            <label className="mt-4">Password</label>
                            <TextInput
                                id="password"
                                name="password"
                                type="password"
                                className="mt-1 block w-full"
                                placeholder="Password"
                                handleChange={handleInputChange}
                            />
                            <label className="mt-4">Role</label>
                            <select
                                name="role"
                                id="role"
                                className="border-gray-300 border-2 p-2 rounded-md mt-1 block w-full"
                                defaultValue={data.role}
                                onChange={handleSelectChange}
                            >
                                <option value="ADMINISTRATOR">
                                    Administrator
                                </option>
                                <option value="OPERATOR">Operator</option>
                                <option value="USER">User</option>
                            </select>
                        </div>
                        <div className="flex justify-end mt-4">
                            <PrimaryButton
                                className="mr-2 bg-gray-400"
                                onClick={() => handleCancelClick()}
                                type="button"
                            >
                                Batal
                            </PrimaryButton>
                            <PrimaryButton processing={processing}>
                                {isEditMode ? "Edit" : "Tambah"}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </Modal>
            <div className="max-w-7xl mx-auto p-6 lg:p-8">
                <div className="mt-16">
                    <div className="overflow-hidden rounded-lg shadow-2xl shadow-gray-500/20">
                        <table className="w-full border-collapse bg-white text-left text-sm text-gray-500">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th
                                        scope="col"
                                        className="px-6 py-4 font-medium text-gray-900"
                                    >
                                        Name
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-4 font-medium text-gray-900"
                                    >
                                        Role
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-4 font-medium text-gray-900"
                                    ></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 border-t border-gray-100">
                                {users.map((user) => (
                                    <tr
                                        key={user.id}
                                        className="hover:bg-gray-50"
                                    >
                                        <th className="flex gap-3 px-6 py-4 font-normal text-gray-900">
                                            <div className="text-sm">
                                                <div className="font-medium text-gray-700">
                                                    {user.name}
                                                </div>
                                                <div className="text-gray-400">
                                                    {user.email}
                                                </div>
                                            </div>
                                        </th>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-600">
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-end gap-4">
                                                {user.id !== state.user.id && (
                                                    <svg
                                                        onClick={() =>
                                                            handleDeleteClick(
                                                                user
                                                            )
                                                        }
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth="1.5"
                                                        stroke="currentColor"
                                                        className="h-6 w-6"
                                                        x-tooltip="tooltip"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                                        />
                                                    </svg>
                                                )}
                                                <svg
                                                    onClick={() => {
                                                        handleEditClick(user);
                                                    }}
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth="1.5"
                                                    stroke="currentColor"
                                                    className="h-6 w-6"
                                                    x-tooltip="tooltip"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                                                    />
                                                </svg>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
