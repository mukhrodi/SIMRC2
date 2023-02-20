import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {
    COMPONENT_ADD_URL,
    COMPONENT_DELETE_URL,
    COMPONENT_EDIT_URL,
    COMPONENT_GET_URL,
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
    const [components, setComponents] = useState([]);
    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState(false);

    const initialState = {
        id: null,
        name: "",
        price: "",
        description: "",
        image: null,
    };
    const [data, setData] = useState(initialState);

    const handleImageChange = (event) => {
        setData({ ...data, ["image"]: event.target.files[0] });
    };

    const handleInputChange = (event) => {
        setData({
            ...data,
            [event.target.name]: event.target.value,
        });
    };

    React.useEffect(() => {
        axios
            .get(COMPONENT_GET_URL)
            .then((response) => {
                setComponents(response.data.components);
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
                setError(message.toString());
            });
    }, []);

    const handleAddClick = () => {
        setData(initialState);
        setEditMode(false);
        setFormShowing(true);
    };

    const handleEditClick = (component) => {
        setData(component);
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
            handleEditComponent(event);
        } else {
            handleAddComponent(event);
        }
    };

    const handleEditComponent = (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("price", data.price);
        formData.append("description", data.description);
        if (data.image) {
            formData.append("image", data.image, data.image.name);
        }

        axios
            .post(`${COMPONENT_EDIT_URL}/${data.id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: state.token,
                },
            })
            .then((response) => {
                let temp = components.map((component) => {
                    if (component.id === response.data.component.id) {
                        return response.data.component;
                    }
                    return component;
                });
                setComponents(temp);
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

    const handleAddComponent = (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("price", data.price);
        formData.append("description", data.description);
        if (data.image) {
            formData.append("image", data.image, data.image.name);
        }

        axios
            .post(COMPONENT_ADD_URL, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: state.token,
                },
            })
            .then((response) => {
                setComponents([...components, response.data.component]);
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

    const handleDeleteClick = (component) => {
        setProcessing(true);
        axios
            .delete(`${COMPONENT_DELETE_URL}/${component.id}`, {
                headers: {
                    Authorization: state.token,
                },
            })
            .then((response) => {
                let temp = components.filter((c) => c.id !== component.id);
                setComponents(temp);
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
        <AuthenticatedLayout
            pathname="/components"
            header={
                <div className="flex justify-between">
                    <h2 className="inline justify-between font-semibold text-xl text-gray-800 leading-tight">
                        Daftar Komponen
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
                                {isEditMode ? "Edit" : "Tambah"} Komponen
                            </h2>
                        </div>
                        <div className="flex flex-col">
                            {error && (
                                <p className="text-red-500 cursor-pointer">
                                    {error}
                                </p>
                            )}
                            <label className="mt-4">Nama Komponen</label>
                            <TextInput
                                name="name"
                                id="name"
                                type="text"
                                className="mt-1 block w-full"
                                placeholder="Nama Komponen"
                                value={data.name}
                                handleChange={handleInputChange}
                            />
                            <label className="mt-4">Deskripsi</label>
                            <TextInput
                                id="description"
                                name="description"
                                className="mt-1 block w-full"
                                placeholder="Deskripsi"
                                value={data.description}
                                handleChange={handleInputChange}
                            />
                            <label className="mt-4">Gambar</label>
                            <TextInput
                                type="file"
                                name="image"
                                handleChange={handleImageChange}
                                className="border-gray-300 border-2 p-1 rounded-md mt-1 block w-full"
                            />

                            <label className="mt-4">Harga</label>
                            <TextInput
                                id="price"
                                name="price"
                                type="number"
                                className="mt-1 block w-full"
                                placeholder="Harga"
                                value={data.price}
                                handleChange={handleInputChange}
                            />
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
                                        Price
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-4 font-medium text-gray-900"
                                    ></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 border-t border-gray-100">
                                {components.map((component) => (
                                    <tr
                                        key={component.id}
                                        className="hover:bg-gray-50"
                                    >
                                        <th className="flex gap-3 px-6 py-4 font-normal text-gray-900">
                                            <div className="relative h-10 w-10">
                                                <img
                                                    className="h-full w-full rounded-full object-cover object-center"
                                                    src={getImage(
                                                        component.image_path
                                                    )}
                                                    alt=""
                                                />
                                                <span className="absolute right-0 bottom-0 h-2 w-2 rounded-full bg-green-400 ring ring-white"></span>
                                            </div>
                                            <div className="text-sm">
                                                <div className="font-medium text-gray-700">
                                                    {component.name}
                                                </div>
                                                <div className="text-gray-400">
                                                    {component.description}
                                                </div>
                                            </div>
                                        </th>
                                        <td className="px-6 py-4">
                                            {Intl.NumberFormat(
                                                "id-ID",
                                                {}
                                            ).format(component.price)}
                                        </td>
                                        {/* <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-600">
                                                    Design
                                                </span>
                                                <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-1 text-xs font-semibold text-indigo-600">
                                                    Product
                                                </span>
                                                <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-2 py-1 text-xs font-semibold text-violet-600">
                                                    Develop
                                                </span>
                                            </div>
                                        </td> */}
                                        <td className="px-6 py-4">
                                            <div className="flex justify-end gap-4">
                                                <svg
                                                    onClick={() =>
                                                        handleDeleteClick(
                                                            component
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
                                                <svg
                                                    onClick={() => {
                                                        handleEditClick(
                                                            component
                                                        );
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
