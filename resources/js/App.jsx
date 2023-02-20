import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, HashRouter, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Dashboard from "./Pages/Dashboard";
import Simulation from "./Pages/Simulation";
import Component from "./Pages/Component";
import User from "./Pages/User";
import Register from "./Pages/Auth/Register";
import Login from "./Pages/Auth/Login";
import axios from "axios";
import MySimulation from "./Pages/MySimulation";
import Edit from "./Pages/Profile/Edit";

export const AuthContext = React.createContext();

const initialState = {
    isAuthenticated: localStorage.getItem("token") !== null ?? false,
    user: JSON.parse(localStorage.getItem("user")) ?? null,
    token: localStorage.getItem("token") ?? null,
};

const reducer = (state, action) => {
    switch (action.type) {
        case "LOGIN":
            localStorage.setItem("user", JSON.stringify(action.payload.user));
            localStorage.setItem("token", action.payload.token);
            return {
                ...state,
                isAuthenticated: true,
                user: action.payload.user,
                token: action.payload.token,
            };
        case "LOGOUT":
            localStorage.clear();
            return {
                ...state,
                isAuthenticated: false,
                user: null,
                token: null,
            };
        default:
            return state;
    }
};

export default function App() {
    const [state, dispatch] = React.useReducer(reducer, initialState);

    axios.interceptors.response.use(
        function (response) {
            return response;
        },
        function (error) {
            if (error.response.status === 401) {
                dispatch({
                    type: "LOGOUT",
                });
            }
            return Promise.reject(error);
        }
    );

    return (
        <AuthContext.Provider value={{ state, dispatch }}>
            <HashRouter>
                <Routes>
                    {state.isAuthenticated ? (
                        <>
                            <Route path="/" element={<Home />} />
                            <Route path="/dashboard" element={<Dashboard />} />
                            {(state.user.role === "ADMINISTRATOR" ||
                                state.user.role === "OPERATOR") && (
                                <>
                                    {state.user.role === "ADMINISTRATOR" && (
                                        <Route
                                            path="/admin/users"
                                            element={<User />}
                                        />
                                    )}
                                    <Route
                                        path="/admin/simulations"
                                        element={<Simulation />}
                                    />
                                    <Route
                                        path="/admin/components"
                                        element={<Component />}
                                    />
                                </>
                            )}
                            {state.user.role === "USER" && (
                                <>
                                    <Route
                                        path="/simulations/"
                                        element={<Simulation />}
                                    />
                                    <Route
                                        path="/simulations/:id/"
                                        element={<Simulation />}
                                    />
                                    <Route
                                        path="/user/simulations/"
                                        element={<MySimulation />}
                                    />
                                    <Route
                                        path="/user/simulations/:id/"
                                        element={<MySimulation />}
                                    />
                                </>
                            )}
                            <Route path="/profile" element={<Edit />} />
                        </>
                    ) : (
                        <>
                            <Route path="/" element={<Home />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                        </>
                    )}
                    <Route path="*" element={<Home />} />
                </Routes>
            </HashRouter>
        </AuthContext.Provider>
    );
}

if (document.getElementById("root")) {
    createRoot(document.getElementById("root")).render(<App />);
}
