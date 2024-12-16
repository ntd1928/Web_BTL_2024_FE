import { useEffect, useState } from "react";
import { getAllUsers } from "../../../../services/userService";

const User = (props)=>{
    console.log(props);
    const [user,setUser]=useState({});

    const id = props.idUser;

    useEffect(()=>{
        const getUserNameFromReact=async()=>{
            const res = await getAllUsers(id);
            if(res && res.data.errCode===0){
                setUser(res.data.users);
            }
        }
        getUserNameFromReact();
    },[id])
   return(
        <td className='text-center align-middle'>{user.email}</td>
    )
}
export default User;