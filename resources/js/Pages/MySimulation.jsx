import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {
    COMPONENT_GET_URL,
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
import { useNavigate, useParams } from "react-router-dom";

export default function MySimulation(props) {
    const { state, dispatch } = React.useContext(AuthContext);
    const navigate = useNavigate();
    const [isFormShowing, setFormShowing] = useState(false);
    const [isEditMode, setEditMode] = useState(false);
    const [components, setComponents] = useState([]);
    const [simulations, setSimulations] = useState([]);
    const { id } = useParams();
    const [simulation, setSimulation] = useState(null);
    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState(false);

    const initialState = {
        components: [],
    };
    const [data, setData] = useState(initialState);

    React.useEffect(() => {
        if (id) {
            axios
                .get(`${USER_SIMULATION_GET_URL}/${id}`, {
                    headers: {
                        Authorization: `${state.token}`,
                    },
                })
                .then((response) => {
                    setSimulation(response.data.simulation);
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
        } else {
            axios
                .get(USER_SIMULATION_GET_URL, {
                    headers: {
                        Authorization: `${state.token}`,
                    },
                })
                .then((response) => {
                    setSimulations(response.data.simulations);
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
        }
    }, []);

    React.useEffect(() => {
        if (id) {
            axios
                .get(`${USER_SIMULATION_GET_URL}/${id}`, {
                    headers: {
                        Authorization: `${state.token}`,
                    },
                })
                .then((response) => {
                    setSimulation(response.data.simulation);
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
        } else {
            setSimulation(null);
            axios
                .get(USER_SIMULATION_GET_URL, {
                    headers: {
                        Authorization: `${state.token}`,
                    },
                })
                .then((response) => {
                    setSimulations(response.data.simulations);
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
        }
    }, [id]);

    const handleComponentsChange = (event) => {
        setData({
            ...data,
            components: event,
        });
    };

    const handleEditComponentClick = () => {
        setData({
            ...data,
            components: simulation.components.map((component) => {
                return {
                    value: component.id,
                    label: component.name,
                };
            }),
        });
        setFormShowing(true);
    };

    const handleAddClick = () => {
        navigate("/simulations");
    };

    const handleViewClick = (simulation) => {
        navigate("/user/simulations/" + simulation.id);
    };

    const handleDeleteClick = (simulation) => {
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
                        setSimulations(response.data.simulations);
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
            });
    };

    const handleCancelClick = () => {
        setData(initialState);
        setEditMode(false);
        setFormShowing(false);
    };

    const handleFormSubmit = (event) => {
        setProcessing(true);
        event.preventDefault();
        const formData = new FormData();
        data.components.forEach((element) => {
            formData.append("components[]", element.value);
        });

        axios
            .post(`${USER_SIMULATION_EDIT_URL}/${id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: state.token,
                },
            })
            .then((response) => {
                setSimulation(response.data.simulation);
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

    return (
        <AuthenticatedLayout
            pathname="/user/simulations"
            header={
                <div className="flex justify-between">
                    <h2 className="inline justify-between font-semibold text-xl text-gray-800 leading-tight">
                        {id
                            ? simulation
                                ? simulation.name
                                : "N/a"
                            : "Simulasi Saya"}
                    </h2>
                    {(state.user.role === "ADMINISTRATOR" ||
                        (state.user.role === "OPERATOR" && !id)) && (
                        <PrimaryButton onClick={() => handleAddClick()}>
                            {id ? "Gunakan Simulasi" : "Tambah Simulasi"}
                        </PrimaryButton>
                    )}
                </div>
            }
        >
            <Modal show={isFormShowing}>
                <div className="flex flex-col">
                    <form onSubmit={handleFormSubmit}>
                        <div className="flex justify-between">
                            <h2 className="inline justify-between font-semibold text-xl text-gray-800 leading-tight">
                                Ubah Komponen
                            </h2>
                        </div>
                        <div className="flex flex-col">
                            {error && (
                                <p className="text-red-500 cursor-pointer">
                                    {error}
                                </p>
                            )}
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
                                Simpan
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </Modal>
            {!simulation ? (
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
                                    {simulations.map((simulation) => (
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
                                                                key={
                                                                    component.id
                                                                }
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
            ) : (
                <div className="max-w-7xl mx-auto p-6 lg:p-8">
                    <div className="overflow-hidden bg-white rounded-lg shadow-2xl shadow-gray-500/20 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                        <img src={getImage(simulation.image_path)} />
                        <div className="col-span-2 p-6 lg:p-8">
                            <h2 className="text text-2xl">{simulation.name}</h2>
                            <h2 className="text-xl font-bold">
                                {Intl.NumberFormat("id-ID", {
                                    style: "currency",
                                    currency: "IDR",
                                }).format(simulation.price)}
                            </h2>
                            <p className="text-gray-400 mt-4">
                                {simulation.description}
                            </p>
                            <PrimaryButton
                                className="mt-4"
                                onClick={handleDeleteClick}
                            >
                                Hapus Simulasi
                            </PrimaryButton>
                            <div className="flex gap-2 mt-4">
                                {simulation.components.map((component) => (
                                    <span
                                        key={component.id}
                                        className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-600"
                                    >
                                        {component.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="mt-8">
                        <div className="flex justify-between">
                            <h2 className="text-xl font-bold">
                                Spesifikasi Komponen
                            </h2>
                            <PrimaryButton
                                onClick={() => handleEditComponentClick()}
                            >
                                Ubah Komponen
                            </PrimaryButton>
                        </div>
                        <div className="overflow-hidden rounded-lg shadow-2xl shadow-gray-500/20 mt-6">
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
                                    {simulation.components.map((component) => (
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
                                            <td className="px-6 py-4">
                                                <div className="flex justify-end gap-4"></div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
