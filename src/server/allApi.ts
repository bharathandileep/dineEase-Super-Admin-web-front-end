import axios, { AxiosResponse } from 'axios';
// import { Customer } from '../redux/customer/customerTypes';
import { baseURL } from './server_URL';
import { commonapi } from './commonApi';
// import { Customer } from '../redux/customer/customerReducer';
// import { Company } from '../redux/company/companyReducer';
interface ApiResponse<T> {
  status: number | string;
  message: string;
  data: T;
}
// *****************************  Customer API ************************************************************
export interface Customer {
  _id: any;
  // cust_id: string;
  cust_name: string;
  email: string;
  age: string;
  contact_num: string;
  address: string;
  password: string;
  created_by: string;
  created_at: string;
  updated_by: string;
  updated_at: string;
};

//  to fetch customers
// Fetch customers with pagination
export const fetchCustomerApi = async (page: number, limit: number): Promise<{
  map(arg0: (emp: any) => any[]): Iterable<readonly [string, string]> | null | undefined; data: Customer[], pagination: { totalItems: number, totalPages: number, currentPage: number, itemsPerPage: number } 
}> => {
  const response = await fetch(`${baseURL}/customer?page=${page}&limit=${limit}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const data = await response.json();
  return data;
};

// delete customers

export const deleteCustomerApi = async (cust_id: string): Promise<Customer[]> => {
  const response = await fetch(`${baseURL}/customer/${cust_id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  const data: Customer[] = await response.json();
  return data;
};

// POST Customer Api
export const postCustomerApi = async (newCustomer: Omit<Customer, '_id'>): Promise<Customer> => {
  const response = await fetch(`${baseURL}/customer`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newCustomer),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const data: Customer = await response.json();
  return data;
};


// UPDATE Customer API
export const updateCustomerApi = async (id: string, updatedCustomer: Partial<Omit<Customer, '_id'>>): Promise<Customer> => {
  const response = await fetch(`${baseURL}/customer/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedCustomer),
  });
 
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
 
  const data: Customer = await response.json();
  return data;
};

// *****************************  Company API ************************************************************
export interface Company {
  _id: any;
  // company_id: any;
  logo: string;
  company_name: string;
  company_location: string;
  company_contact: string;
  created_by: any ;
  created_at: string;
  updated_at: string;
  updated_by: any;
  // description: string;
  // revenue : string;
  // noOfEmployees: string;
}

// Fetch all companies
export const fetchCompanyApi = async (page: number, limit: number): Promise<{
  map(arg0: (company: any) => { _id: any; name: any; }): unknown; data: Company[], pagination: { totalItems: number, totalPages: number, currentPage: number, itemsPerPage: number } 
}> => {
  const response = await fetch(`${baseURL}/company?page=${page}&limit=${limit}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const data = await response.json();
  return data;
};


export const deleteCompanyApi = async (company_id: string): Promise<Company[]> => {
  const response = await fetch(`${baseURL}/company/${company_id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  const data: Company[] = await response.json();
  return data;
};

// POST company Api
export const postCompanyApi = async (newCompany: Omit<Company, '_id'>): Promise<Company> => {
  const response = await fetch(`${baseURL}/company`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newCompany),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const result = await response.json(); // The entire response object with status, message, and data
  const data: Company = result.data;
  return data;
};


// UPDATE company API
export const updateCompanyApi = async (id: string, updatedCompany: Partial<Omit<Company, '_id'>>): Promise<Company> => {
  const response = await fetch(`${baseURL}/company/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedCompany),
  });
 
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
 
  const data: Company = await response.json();
  return data;
};

// *****************************  Restaurant API ************************************************************
export interface Kitchen {
  _id: any;
  // kitchen_id: any;
  f_name: string;
  l_name: string;
  description: string;
  image_url: string;
  employees: number;
  username: string;
  revenue: number;
  password: string;
  phone_no: string;
  // order_id: number;
  image_id: string;
  location: string;
  created_by: string;
  created_at: string;
  updated_by: string;
  updated_at: string;
}

// Fetch all restaurant
export const fetchrestaurantApi = async (page: number, limit: number): Promise<{
  map(arg0: (kitchen: any) => { _id: any; name: any; }): unknown; data: Kitchen[], pagination: { totalItems: number, totalPages: number, currentPage: number, itemsPerPage: number } 
}> => {
  const response = await fetch(`${baseURL}/kitchen?page=${page}&limit=${limit}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const data = await response.json();
  return data;
};


// Delete a restaurant
export const deleteRestaurantApi = async (cust_id: string): Promise<Kitchen[]> => {
  const response = await fetch(`${baseURL}/kitchen/${cust_id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  const data: Kitchen[] = await response.json();
  return data;
};


// POST Customer Api
export const postRestaurantApi = async (newKitchen: Omit<Kitchen, '_id'>): Promise<Kitchen> => {
  const response = await fetch(`${baseURL}/kitchen`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newKitchen),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const data: Kitchen = await response.json();
  return data;
};



// UPDATE Customer API
export const updateKitchenApi = async (id: string, updatedKitchen: Partial<Omit<Kitchen, '_id'>>): Promise<Kitchen> => {
  const response = await fetch(`${baseURL}/kitchen/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedKitchen),
  });
 
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
 
  const data: Kitchen = await response.json();
  return data;
};
// console.log(fetchCompanyApi);

// *****************************  Users API ************************************************************
export interface Users {
  kitchen_id: string;
  f_name: string;
  l_name: string;
  description: string;
  employees: number;
  username: string;
  password: string;
  phone_no: number;
  order_id: number;
  image_id: string;
  location: string;
  created_by: string;
  created_at: string;
  updated_by: string;
  updated_at: string;
}

// Fetch all companies
export const fetchUsersApi = async (): Promise<Users[]> => {
  const response = await fetch(`${baseURL}/kitchen`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const data: Users[] = await response.json();
  return data;
};
// console.log(fetchUsersApi);

// ********************************  AdminStaffs---Users API ************************************************************
export interface Staffs {
  _id: any;
  // admin_staff_id: any;          
  name: string;        
  role: string;          
  email: string;      
  password: string;      
  phone_no: string;
  status: string;    
  image_id: string;      
  created_by: string;    
  created_at: string;    
  updated_by: string;    
  updated_at: string;    
}
 
// Fetch all Staffs
export const fetchStaffsApi =  async (page: number, limit: number): Promise<{ data: Staffs[], pagination: { totalItems: number, totalPages: number, currentPage: number } }> => {
 
  const response = await fetch(`${baseURL}/adminstaff?page=${page}&limit=${limit}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
 
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return await response.json();
 
};
// console.log(fetchStaffsApi);
 
// Delete a Staff
export const deleteStaffApi = async (admin_staff_id: string): Promise<Staffs[]> =>{
  const response = await fetch(`${baseURL}/adminstaff/${admin_staff_id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
 
  const data: Staffs[] = await response.json();
  return data;
};
// Define the POST API function
export const PostStaffApi = async (newStaff: Omit<Staffs, '_id'>): Promise<Staffs> => {
  const response = await fetch(`${baseURL}/adminstaff`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newStaff),  
  });
 
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
 
  const result = await response.json(); // The entire response object with status, message, and data
  const data: Staffs = result.data;     // Extract the 'data' object which contains the staff details
  return data;
};

// Update a food product
export const UpdateStaffApi = async (id: string, updatedStaff: Partial<Omit<Staffs, '_id'>>): Promise<Staffs> => {
  const response = await fetch(`${baseURL}/adminstaff/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedStaff),
  });
 
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
 
  const data: Staffs = await response.json();
  return data;
};
 

// ********************************  FoodMenu API ************************************************************
 
export interface FoodMenu {
  _id:any;
  // food_id: string;
  organization_id: any;
  food_name: string;
  food_price: string;
  food_description: string;
  image_url: string;
  kitchen_id: any;
  created_by: string;
  created_at: any;
  updated_by: string;
  updated_at: any;
}
// Fetch all FoodMenu
export const fetchFoodMenuApi = async (page: number, limit: number): Promise<{
  data: any; foodproducts: FoodMenu[], pagination: { totalItems: number, totalPages: number, currentPage: number } 
}> => {
  const response = await fetch(`${baseURL}/foodproducts?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
      },
  });
 
  if (!response.ok) {
   
      throw new Error(`HTTP error! Status: ${response.status}`);
  }
 
  return await response.json();
};
// console.log(fetchStaffsApi);
 
// Delete a food
export const deleteFoodMenuApi = async (food_id: string): Promise<FoodMenu[]> =>{
  const response = await fetch(`${baseURL}/foodproducts/${food_id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
 
  const data: FoodMenu[] = await response.json();
  return data;
};
// Define the POST API function
export const postFoodMenuApi = async (newFood: Omit<FoodMenu, '_id'>): Promise<FoodMenu> => {
  const response = await fetch(`${baseURL}/foodproducts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newFood),  
  });
 
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
 
  const data: FoodMenu = await response.json();
  return data;
};
 
// Update a food product
export const updateFoodMenuApi = async (id: string, updatedFood: Partial<Omit<FoodMenu, '_id'>>): Promise<FoodMenu> => {
  const response = await fetch(`${baseURL}/foodproducts/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedFood),
  });
 
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
 
  const data: FoodMenu = await response.json();
  return data;
};
 

// ********************************  Order API ************************************************************
const ORDER_API_URL = 'http://localhost:5000/api/orderdetails'; // Update with your actual API URL

export interface Order {
  _id: any;
  order_id: any;
  employee_id: any;
  food_id: any;
  quantity: number;
  order_date: any; // Changed to string to match ISO format
  order_status: string;
  supply_date_time: any; // Changed to string to match ISO format
  created_by: any;
  created_at: string; // Changed to string to match ISO format
  updated_by: any;
  updated_at: string; // Changed to string to match ISO format
}

export interface OrderResponse {
  data: Order[];
  pagination: {
    // total: number;
    // page: number;
    // perPage: number;
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;

  };
}


export const getOrders = async (
  page: number = 1,
  limit: number = 4
): Promise<OrderResponse> => {   
  const response = await fetch(`${ORDER_API_URL}?page=${page}&limit=${limit}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch employees");
  }  

  const data: OrderResponse = await response.json();
  return data;
};

// // Fetch all orders
// export const getOrders = async (): Promise<OrderResponse> => {
//   const response = await fetch(ORDER_API_URL);
//   if (!response.ok) {
//     const errorText = await response.text();
//     console.error('Server Error (GET):', errorText);
//     throw new Error('Failed to fetch orders');
//   }
//   return response.json();
// };

// Fetch a specific order by ID
export const getOrderById = async (id: string): Promise<Order> => {
  const response = await fetch(`${ORDER_API_URL}/${id}`);
  if (!response.ok) {
    const errorText = await response.text();
    console.error('Server Error (GET by ID):', errorText);
    throw new Error('Failed to fetch order');
  }
  return response.json();
};

// Delete an order
export const deleteOrder = async (id: string): Promise<void> => {
  const response = await fetch(`${ORDER_API_URL}/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const errorText = await response.text();
    console.error('Server Error (DELETE):', errorText);
    throw new Error('Failed to delete order');
  }
};

// Update an order
export const updateOrder = async (
  id: string,
  data: Partial<Order>
): Promise<Order> => {
  const { _id, ...rest } = data; // Exclude _id if included in data

  console.log('Updated Data:', rest); // Log the data being sent

  const response = await fetch(`${ORDER_API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(rest),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Server Error (PUT):', errorText);
    throw new Error('Failed to update order');
  }

  return response.json();
};

// Add a new order
export const addOrder = async (data: Omit<Order, '_id'>): Promise<Order> => {
  try {
    const response = await fetch(ORDER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Server Error (POST):', errorText);
      throw new Error(`Failed to add order: ${errorText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error in addOrder function:', error);
    throw new Error(
      `Failed to add order: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    );
  }
};

    














        