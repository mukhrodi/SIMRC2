import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {
    COMPONENT_GET_URL,
    SIMULATION_GET_URL,
    USER_SIMULATION_ADD_URL,
    USER_SIMULATION_DELETE_URL,
    USER_SIMULATION_EDIT_URL,
    USER_SIMULATION_GET_URL,
} from "../Utils/Constants";
import getImage from "../Utils/ImageProvider";
import PrimaryButton from "../Components/PrimaryButton";
import Modal from "../Components/Modal";
import TextInput from "../Components/TextInput";
import { AuthContext } from "../App.jsx";
import Select from "react-tailwindcss-select";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Dashboard(props) {
    const { state, dispatch } = React.useContext(AuthContext);
    const [isFormShowing, setFormShowing] = useState(false);
    const [isEditMode, setEditMode] = useState(false);
    const [components, setComponents] = useState([]);
    const [simulations, setSimulations] = useState([]);
    const [mySimulations, setMySimulations] = useState([]);
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState(false);

    const initialState = {
        id: null,
        name: "",
        code: "",
        description: "",
        image: null,
        components: [],
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

    const handleComponentsChange = (event) => {
        setData({
            ...data,
            components: event,
        });
    };

    React.useEffect(() => {
        axios
            .get(USER_SIMULATION_GET_URL, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: state.token,
                },
            })
            .then((response) => {
                setMySimulations(response.data.simulations);
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

        axios
            .get(SIMULATION_GET_URL)
            .then((response) => {
                setSimulations(response.data);
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

        axios
            .get(COMPONENT_GET_URL)
            .then((response) => {
                setComponents(
                    response.data.components.map((component) => {
                        return {
                            value: component.id,
                            label: component.name,
                        };
                    })
                );
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
        // setData(initialState);
        // setEditMode(false);
        // setFormShowing(true);
        navigate("/simulations");
    };

    const handleEditClick = (simulation) => {
        simulation.components = simulation.components.map((component) => {
            return {
                value: component.id,
                label: component.name,
            };
        });
        setData(simulation);
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
            handleEditSimulation(event);
        } else {
            handleAddSimulation(event);
        }
    };

    const handleEditSimulation = (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("code", data.code);
        formData.append("description", data.description);
        if (data.image) {
            formData.append("image", data.image, data.image.name);
        }
        data.components.forEach((element) => {
            formData.append("components[]", element.value);
        });

        axios
            .post(`${USER_SIMULATION_EDIT_URL}/${data.id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: state.token,
                },
            })
            .then((response) => {
                let temp = mySimulations.map((simulation) => {
                    if (simulation.id === response.data.simulation.id) {
                        return response.data.simulation;
                    }
                    return simulation;
                });
                setSimulations(temp);
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

    const handleAddSimulation = (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("code", data.code);
        formData.append("description", data.description);
        if (data.image) {
            formData.append("image", data.image, data.image.name);
        }
        data.components.forEach((element) => {
            formData.append("components[]", element.value);
        });

        axios
            .post(USER_SIMULATION_ADD_URL, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: state.token,
                },
            })
            .then((response) => {
                setSimulations([...simulations, response.data.simulation]);
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

    const handleDeleteClick = (simulation) => {
        setProcessing(true);
        axios
            .delete(`${USER_SIMULATION_DELETE_URL}/${simulation.id}`, {
                headers: {
                    Authorization: state.token,
                },
            })
            .then((response) => {
                axios
                    .get(USER_SIMULATION_GET_URL, {
                        headers: {
                            Authorization: `${state.token}`,
                        },
                    })
                    .then((response) => {
                        setMySimulations(response.data.simulations);
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

    const handleViewClick = (simulation) => {
        navigate(`/user/simulations/${simulation.id}`);
    };

    return (
        <AuthenticatedLayout
            pathname="/dashboard"
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Dashboard
                </h2>
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

                            <label className="mt-4">Kode</label>
                            <TextInput
                                id="code"
                                name="code"
                                type="text"
                                className="mt-1 block w-full"
                                placeholder="Kode"
                                value={data.code}
                                handleChange={handleInputChange}
                            />

                            <label className="mt-4">Komponen</label>
                            <Select
                                name="components"
                                id="components"
                                classNames={["mt-1 block w-full"]}
                                value={data.components}
                                isMultiple={true}
                                onChange={handleComponentsChange}
                                options={components}
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
                <div className="flex flex-col">
                    <div className="flex justify-between">
                        <h2 className="inline justify-between font-semibold text-xl text-gray-800 leading-tight">
                            Simulasi Saya
                        </h2>
                        <button
                            onClick={handleAddClick}
                            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Tambah
                        </button>
                    </div>
                </div>
                <div className="mt-4">
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
                                        Code
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-4 font-medium text-gray-900"
                                    >
                                        Komponen
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-4 font-medium text-gray-900"
                                    ></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 border-t border-gray-100">
                                {mySimulations.map((simulation) => (
                                    <tr
                                        key={simulation.id}
                                        className="hover:bg-gray-50"
                                    >
                                        <th className="flex gap-3 px-6 py-4 font-normal text-gray-900">
                                            <div className="relative h-10 w-10">
                                                <img
                                                    className="h-full w-full rounded-full object-cover object-center"
                                                    src={getImage(
                                                        simulation.image_path
                                                    )}
                                                    alt=""
                                                />
                                                <span className="absolute right-0 bottom-0 h-2 w-2 rounded-full bg-green-400 ring ring-white"></span>
                                            </div>
                                            <div className="text-sm">
                                                <div className="font-medium text-gray-700">
                                                    {simulation.name}
                                                </div>
                                                <div className="text-gray-400">
                                                    {simulation.description}
                                                </div>
                                            </div>
                                        </th>
                                        <td className="px-6 py-4">
                                            {simulation.code}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                {simulation.components.map(
                                                    (component) => (
                                                        <span
                                                            key={component.id}
                                                            className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-600"
                                                        >
                                                            {component.name}
                                                        </span>
                                                    )
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-end gap-4">
                                                <svg
                                                    onClick={() =>
                                                        handleDeleteClick(
                                                            simulation
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
                                                        handleViewClick(
                                                            simulation
                                                        );
                                                    }}
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth="1.5"
                                                    stroke="currentColor"
                                                    className="w-6 h-6"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                                                    />
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
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
