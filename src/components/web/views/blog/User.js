import { useEffect, useState } from "react";
import { getAllUsers } from "../../../services/userService";

const User = (props)=>{
    const [user,setUser]=useState({});
    useEffect(()=>{
        const getUserFromReact = async()=>{
            const res = await getAllUsers(props.userId);
            if(res && res.data.errCode===0){
                setUser(res.data.users);
            }
        }
        getUserFromReact();
    },[props.userId])
    return(
        <b>{user.username} <i class="fa-solid fa-angle-right"></i> </b>
    )
}
export default User;