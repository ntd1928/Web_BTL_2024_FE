import { useEffect } from "react";
import { useState } from "react";
import { getAllColors } from "../../../services/productService";
import { Tooltip } from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css'

const Color = (props)=>{
    const [color,setColor]=useState({});
    useEffect(()=>{
        getAllColorFromReact();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[props.id]);

    const getAllColorFromReact = async()=>{
        const data = await getAllColors(props.id);
        if(data && data.data.errCode === 0){
            setColor(data.data.colors)
        }
    }
    const handleChange = (e)=>{
        props.getColor(e.target.value);
    }

    return(
        <>
            <Tooltip anchorSelect=".my-anchor-element" place="top">
                sold out
            </Tooltip>
            <div className={"form-check form-check-inline me-2" + (props.disabled ? " my-anchor-element" : '')} key={color.id} style={{fontSize:"28px",marginRight:"0px"}}>
                <input className="form-check-input" style={{backgroundColor:color.code}} name="color" type="radio" value={color.code} title={color.name} disabled={props.disabled} onChange={(e)=>handleChange(e)} />
            </div>
        </>
        
    )
}
export default Color;