import { log } from "console";
import { axiosInstance } from "../../helpers/api/apiCore";
import { apiConfig } from "../../helpers/api/apis";
 
export const createItem = async (menuData: any) => {
    try {
        const response = await axiosInstance.post(
            `${apiConfig.menu.createItem}`,
            menuData
        );
        return response.data;
    } catch (error: any) {
        console.error("Create Item Error:", error.response?.data || error.message);
        throw error.response?.data || { success: false, message: "Failed to create item" };
    }
};

export const listItems = async () =>{
    try{
        const response = await axiosInstance.get(
            `${apiConfig.menu.listItems}`
        );
        return response.data;
    }catch(error:any){
        console.log("Login Error:",error.response?.data || error.message);
        
    }
};

export const getItemById =  async(id:string | undefined)=>{
    try{
        const response = await axiosInstance.get(
            `${apiConfig.menu.getItemById(id)}`
        );
        return response.data;
    }catch(error:any){
      console.log("Error:",error.response?.data || error.message);
      
    }
};

export const updateItem = async (id: string | undefined, data: any) => {
    try {
      const response = await axiosInstance.put(
        `${apiConfig.menu.updateItem(id)}`, 
        data 
      );
      return response.data;
    } catch (error: any) {
      console.error("Error updating item:", error.response?.data || error.message);
      return error.response?.data || { success: false, message: "Failed to update item" };
    }
};

export const deleteItem = async(id:string | undefined)=>{
    try{
        const response = await axiosInstance.delete(
            apiConfig.menu.deleteItem(id)
        );
        return response.data;
    }
        catch(error:any){
        console.log("Error:",error.response?.data || error.message);
        
        }
    }

export const changeItemStatus = async (id: string) => {
  try {
    const response = await axiosInstance.patch(apiConfig.menu.changeItemStatus(id));
    return response.data;
  } catch (error:any) {
    throw error.response?.data || "Error updating status";
  }
};
