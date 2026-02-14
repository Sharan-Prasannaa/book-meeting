import {useContext} from "react";
import {AuthContext} from "../context/AuthContext";
import {Navigate} from "react-router-dom";

export default function ProtectedRoutes({children}){
    const { user, loading } = useContext(AuthContext);
    
    if (loading) return null; // or spinner

    if(!user){
        return <Navigate to="/login" replace />;
    }
     
    return children;
}