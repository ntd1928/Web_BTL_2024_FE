import { useEffect, useState } from "react";
import { getAllColors } from "../../../services/productService";

const Color = (props)=>{
    const [color,setColor]=useState({});
    useEffect(()=>{
        getColorFromReact();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[props.id]);

    const getColorFromReact=async()=>{
        let data = await getAllColors(props.id);
        if(data && data.data.errCode===0){
            setColor(data.data.colors);
        }
    }
    const handleChange = (e)=>{
        props.getColor(e.target.value);
    }
    return(
        <div className="form-check form-check-inline m-0" style={{fontSize:"25px"}}>
            <input className="form-check-input" onChange={(e)=>handleChange(e)} style={{borderRadius:"50%",backgroundColor: color.code}} type="radio" name="color" value={color.code} title={color.name}/>
        </div>
    )
}
export default Color;