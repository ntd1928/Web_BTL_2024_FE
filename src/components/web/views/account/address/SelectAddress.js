// import axios from 'axios';
import { useEffect, useState } from 'react';
import Select from 'react-select';

const SelectAddress = (props)=>{
   
  const [cities, setCities] = useState([]);
  const [wards, setWards] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [idCity,setIdCity]=useState('');
 const [option,setOption]=useState([]);

 const [address,setAddress]=useState({
    ward:'',district:'',city:''
 });
  useEffect(() => {

    const getData = async () => {
      try {
        const response = await fetch("https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json");
        const options = await response.json();
        setOption(options);
        setCities(options.map(({Id,Name})=>({
            value:Id,
            label:Name
        })));
      } catch (error) {
        console.log(error)
      }
    };
    getData();
  }, []);

    const handleSelectChange = (selected,index) => {
        if(index.name==='city'){
            if(selected.value !== ''){
                const result = option.filter(n => n.Id === selected.value);
                setDistricts(result[0].Districts.map(({Id,Name})=>({
                    value:Id,
                    label:Name
                })));
                setIdCity(selected.value);
                address.city=selected.label;
            }
            
        }
        if(index.name==='district'){
            const dataCity = option.filter((n) => n.Id === idCity);
             if(selected.value !== ''){
                const dataWards = dataCity[0].Districts.filter(n => n.Id === selected.value)[0].Wards;
                setWards(dataWards.map(({Id,Name})=>({
                    value:Id,
                    label:Name
                })));
                address.district=selected.label
            }
        }
        if(index.name === 'ward'){
            address.ward=selected.label
        }
        setAddress({...address})
        props.onSelect(address);
    };

    return(
        <>  
            <div className="col-12 mb-4">
                <label className="form-label">City</label>
                <Select name="city" options={cities} defaultValue={cities[1]} onChange={(selected,index)=>handleSelectChange(selected,index)}/>
            </div>
            <div className="col-md-6 mb-4">
                <label className="form-label">District</label>
                <Select name="district" options={districts} defaultValue={districts[1]} onChange={(selected,index)=>handleSelectChange(selected,index)}/>
            </div>
            <div className="col-md-6 mb-4">
                <label className="form-label">Ward</label>
                <Select name="ward" options={wards} defaultValue={wards[1]} onChange={(selected,index)=>handleSelectChange(selected,index)}/>
            </div>
            
            
        </>
    )
  }
  
export default SelectAddress;

