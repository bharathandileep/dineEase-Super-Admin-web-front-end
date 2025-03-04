import { log } from "console";
import { axiosInstance } from "../../helpers/api/apiCore";
import { apiConfig } from "../../helpers/api/apis";

export const getAllCountries = async()=>{
    try{
        const response = await axiosInstance.get(
            `${apiConfig.addressDetails.getAllCountries}`
        );
        return response.data;
    }
    catch(error:any){
        console.log("error on getting countries",error.response.data || error.message);
        
    }
};

export const getStatesByCountry = async(countryName:string | undefined)=>{
    try{
        const response = await axiosInstance.get(
            `${apiConfig.addressDetails.getStatesByCountry(countryName)}`
        );
        return response.data;
    }catch(error:any){
        console.log("error",error.response.data || error.message);
        
    }
}

export  const getCitiesByState = async(stateName:string | undefined)=>{
    try{
        const response =  await axiosInstance.get(
            `${apiConfig.addressDetails.getCitiesByState(stateName)}`
        );
        return response.data;
    }
    catch(error:any){
        console.log("error",error.response.data || error.message);
        
        
    }
}

export const getDistrictsByState = async(stateId:string | undefined)=>{
    try{
        const response = await axiosInstance.get(
            `${apiConfig.addressDetails.getDistrictsByState(stateId)}`
        );
        return response.data;
    }
    catch(error:any){
        console.log("error",error.response.data);
        
    }
}
