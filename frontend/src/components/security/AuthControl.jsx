import { useUser } from "@clerk/clerk-react"
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";


export const AuthControl = () => {
    const { userId, isLoaded } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        console.log("isLoaded", isLoaded);
        console.log("userId", userId);
        if (!isLoaded) return;

        if (userId){
            navigate('/select-org');
        }
    }, [isLoaded, userId]);

    return null;
}