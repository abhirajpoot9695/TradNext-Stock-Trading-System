import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { API_URL, LOGIN_URL } from "../config";

const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios
            .get(`${API_URL}/user`, { withCredentials: true })
            .then((res) => {
                setUser(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.log(err.response);
                alert(err.response?.status);
            });
    }, []);

    const logout = async () => {
        try {
            await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
        } catch (err) {
            console.error(err);
        } finally {
            window.location.href = LOGIN_URL;
        }
    };

    if (loading || !user) {
        return <div style={{ textAlign: "center", marginTop: "40px" }}>Loading...</div>;
    }

    return (
        <UserContext.Provider value={{ user, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;