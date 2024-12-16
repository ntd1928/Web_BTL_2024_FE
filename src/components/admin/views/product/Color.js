import { useEffect, useState } from "react";
import { getAllColors } from "../../../services/productService";

const Color = (props)=>{
    const [color,setColor]=useState({});
    const id= props.colorId;
    useEffect(()=>{
        getAllColorsFromReact();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[id]);

    const getAllColorsFromReact = async()=>{
        const data = await getAllColors(id);
        if(data && data.data.errCode === 0){
            setColor(data.data.colors)
        } 
        console.log(color)
    }
    return(
        <span><i style={{color:color.code,fontSize:"30px"}} className="fa-solid fa-circle"></i> {color.code}</span>
    )
}
export default Color;