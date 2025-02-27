export const apiConfig = {
  token: {
    getAccessToken: "/api/refresh-token",
  },
  admin: {
    login: "/auth/admin/login",
    generateForgotOtp: "/auth/admin/forgot-password",
    verifyForgotOtp: "/auth/admin/verify-password",
    updatePassword: "/auth/admin/update-password",
  },
  auth: {
    google: "/google-auth",
    sendOtp: "/send-otp",
    loginOtp: "/login-Otp",
    verifyOtp: "/verify-otp",
    verifyLoginOtp: "/verify-loginotp",
    logout: "/logout",
    accessAccount:"/user/access/login"
  },
  users: {
    getUser: "/users/:id",
    createUser: "/users",
    updateUser: "/users/:id",
  },
  kitchens: {
    newkitchens: "/kitchens/new",
    updatekitchens: (kitchenId: string | undefined) =>
      `/kitchens/update/${kitchenId}`,
    deletekitchens: (kitchenId: string | undefined) =>
      `/kitchens/delete/${kitchenId}`,
    getAllkitchens: (query: any) =>
      `/kitchens/all?page=${query.page}&limit=${query.limit}&search=${query.search || ''}`, 
    getkitchensById: (kitchenId: string | undefined) =>
      `/kitchens/${kitchenId}`,

    createCategory: "/kitchens/categories",
    getAllCategories:(query:any)=> `/kitchens/categories/all?page=${query.page}&limit=${query.limit}`,    
    updateCategory: (id: string | undefined) => `/kitchens/categories/${id}`,
    deleteCategory: (id: string | undefined) => `/kitchens/categories/${id}`,
    toggleCategoryStatus: (id: string | undefined) =>
      `/kitchens/categories/${id}/toggle-status`,

    createSubcategory: "/kitchens/subcategories",
    getAllSubCategories:(query:any)=> `/kitchens/subcategories/all?page=${query.page}&limit=${query.limit}`,  
    getSubcategoriesByCategory: (categoryId: string | undefined) =>
      `/kitchens/categories/${categoryId}/subcategories`,
    getSubcategoryById: (id: string | undefined) =>
      `/kitchens/subcategories/${id}`,
    updateSubcategory: (id: string | undefined) =>
      `/kitchens/subcategories/${id}`,
    deleteSubcategory: (id: string | undefined) =>
      `/kitchens/subcategories/${id}`,
    toggleSubcategoryStatus: (id: string | undefined) =>
      `/kitchens/subcategories/${id}/toggle-status`,
  },
  organization: {
    newOrganization: "/organization/new",
    updateOrganization: (orgId: string | undefined) =>
      `/organization/update/${orgId}`,
    deleteOrganization: (orgId: string | undefined) =>
      `/organization/delete/${orgId}`,
   getAllOrganization: (query: any) => `/organization/all?page=${query.page}&limit=${query.limit}&search=${query.search || ''}`, 
    getOrganizationById: (orgId: string | undefined) =>
      `/organization/${orgId}`,
    getAllCategoriesByStatus: "/organization/category/status",

    createCategory: "/organization/categories",
    getAllCategories:(query:any)=> `/organization/categories/all?page=${query.page}&limit=${query.limit}`,    
    updateCategory: (id: string | undefined) =>
      `/organization/categories/${id}`,
    deleteCategory: (id: string | undefined) =>
      `/organization/categories/${id}`,
    toggleCategoryStatus: (id: string | undefined) =>
      `/organization/categories/${id}/toggle-status`,

    createSubcategory: "/organization/subcategories",
    getAllSubCategories:(query:any)=> `/organization/subcategories/all?page=${query.page}&limit=${query.limit}`,    
    getSubcategoriesByCategory: (categoryId: string | undefined) =>
      `/organization/categories/${categoryId}/subcategories`,
    getSubcategoryById: (id: string | undefined) =>
      `/organization/subcategories/${id}`,
    updateSubcategory: (id: string | undefined) =>
      `/organization/subcategories/${id}`,
    deleteSubcategory: (id: string | undefined) =>
      `/organization/subcategories/${id}`,
    toggleSubcategoryStatus: (id: string | undefined) =>
      `/organization/subcategories/${id}/toggle-status`,
  },
  menu: {
    createCategory: "/menu-category/categories",
    getAllCategories:(query:any)=> `/menu-category/categories?page=${query.page}&limit=${query.limit}`,       
    updateCategory: (id: string | undefined) =>
      `/menu-category/categories/${id}`,
    deleteCategory: (id: string | undefined) =>
      `/menu-category/categories/${id}`,
    toggleCategoryStatus: (id: string | undefined) =>
      `/menu-category/categories/${id}/toggle-status`,

    createSubcategory: "/sub-menu-category/subcategories",
    getAllCategoriesByStatus: "/sub-menu-category/category/status",
    getAllSubCategories:(query:any)=> `/sub-menu-category/subcategories?page=${query.page}&limit=${query.limit}`,       

    getSubcategoriesByCategory: (categoryId: string | undefined) =>
      `/sub-menu-category/categories/${categoryId}/subcategories`,
    getSubcategoryById: (id: string | undefined) =>
      `/sub-menu-category/subcategories/${id}`,
    updateSubcategory: (id: string | undefined) =>
      `/sub-menu-category/subcategories/${id}`,
    deleteSubcategory: (id: string | undefined) =>
      `/sub-menu-category/subcategories/${id}`,
    toggleSubcategoryStatus: (id: string | undefined) =>
      `/sub-menu-category/subcategories/${id}/toggle-status`,

    createItem: "/menu-items/allmenuitems",
    listItems: "/menu-items/allmenuitems",
    getItemById: (id: string | undefined) => `/menu-items/allmenuitems/${id}`,
    updateItem: (id: string | undefined) => `/menu-items/allmenuitems/${id}`,
    deleteItem: (id: string | undefined) => `/menu-items/allmenuitems/${id}`,
    changeItemStatus: (id: string | undefined) =>
      `/menu-items/allmenuitems/${id}/status`,
  },
  designation: {
    createDesignation: "/designation/designations",
   getAllDesignations:(query:any)=> `/designation/designations/all?page=${query.page}&limit=${query.limit}`,  
    getDesignationById: (id: string | undefined) =>
      `/designation/designations/${id}`,
    updateDesignation: (id: string | undefined) =>
      `/designation/designations/${id}`,
    deleteDesignation: (id: string | undefined) =>
      `/designation/designations/${id}`,
    toggleDesignationStatus: (id: string | undefined) =>
      `/designation/designations/${id}/toggle-status`,
  },
  employee: {
    createEmployee: "/employee/employees",
    getAllEmployees: (query: any) => `/employee/employees/all?page=${query.page}&limit=${query.limit}&search=${query.search || ''}`,
    getEmployeeById: (id: string | undefined) => `/employee/employees/${id}`,
    updateEmployee: (id: string | undefined) => `/employee/employees/${id}`,
    deleteEmployee: (id: string | undefined) => `/employee/employees/${id}`,
    toggleEmployeeStatus: (id: string | undefined) =>
      `/employee/employees/${id}/toggle-status`,
  },
  orgemployee: {
    createOrgEmployee: "/org-employee/orgemployee",
    getAllOrgEmployees:(query:any)=> `/org-employee/orgemployee/all?page=${query.page}&limit=${query.limit}&search=${query.search || ''}`,  
    getOrgEmployeeById: (id: string | undefined) =>
      `/org-employee/orgemployee/${id}`,
    updateOrgEmployee: (id: string | undefined) =>
      `/org-employee/orgemployee/${id}`,
    deleteOrgEmployee: (id: string | undefined) =>
      `/org-employee/orgemployee/${id}`,
    toggleOrgEmployeeStatus: (id: string | undefined) =>
      `/org-employee/orgemployee/${id}/toggle-status`,
  },
  kitchenMenu: {
    getKitchenMenu: (id: string | undefined) =>
      `/kitchens-menu/kitchen-menu/${id}`,
    createkitchenMenu: (id: string | undefined) =>
      `/kitchens-menu/kitchen-menu/${id}`,
    removekitchenMenu: (
      item: string | undefined,
      kitchenId: string | undefined
    ) => `/kitchens-menu/kitchen-menu/${kitchenId}/remove/${item}`,
    kitchenMenuItemChange: (
      kitchenId: string | undefined,
      itemId: string | undefined
    ) => `/kitchens-menu/${kitchenId}/menu-item/${itemId}`,
  },
};
