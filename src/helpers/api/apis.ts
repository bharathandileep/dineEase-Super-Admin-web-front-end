import { listItems } from "../../server/admin/items";

export const apiConfig = {
  token: {
    getAccessToken: "/api/refresh-token",
  },
  admin: {
    login: "/auth/admin/login",
    generateForgotOtp: "/auth/admin/forgot-password",
    verifyForgotOtp: "/auth/admin/verify-password",
    updatePassword: "/auth/admin/update-password",
    approveOrganization: (id: string | undefined) =>
      `/admin/approve/organization/${id}`,
    approvekitchen: (id: string | undefined) => `/admin/approve/kitchen/${id}`,
  },
  auth: {
    google: "/google-auth",
    sendOtp: "/send-otp",
    loginOtp: "/login-Otp",
    verifyOtp: "/verify-otp",
    verifyLoginOtp: "/verify-loginotp",
    logout: "/logout",
    accessAccount: "/user/access/login",
    checkUserExistence: "/auth/user/present",
    createUser: "/auth/user/new",
    getUserInfo: (userId: string | number) => `/auth/user/${userId}`,
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
      `/kitchens/all?page=${query.page}&limit=${
        query.limit
      }&search=${encodeURIComponent(query.search || "")}` +
      `${
        query.category ? `&category=${encodeURIComponent(query.category)}` : ""
      }` +
      `${
        query.subcategory
          ? `&subcategory=${encodeURIComponent(query.subcategory)}`
          : ""
      }`,
    getkitchensById: (kitchenId: string | undefined) =>
      `/kitchens/${kitchenId}`,
    toggleKitchenStatus: (id: string | undefined) => `/kitchens/status/${id}`,
    getUserApprovedKitchens: "/kitchens/user/approved",

    createCategory: "/kitchens/categories",
    getallCategories: (query: any) =>
      `/kitchens/categories/all?page=${query.page}&limit=${query.limit}${
        query.search ? `&search=${encodeURIComponent(query.search)}` : ""
      }${
        query.status && query.status !== "all" ? `&status=${query.status}` : ""
      }`,
    updateCategory: (id: string | undefined) => `/kitchens/categories/${id}`,
    deleteCategory: (id: string | undefined) => `/kitchens/categories/${id}`,
    toggleCategoryStatus: (id: string | undefined) =>
      `/kitchens/categories/${id}/toggle-status`,

    createSubcategory: "/kitchens/subcategories",
    getallSubCategories: (query: any) =>
      `/kitchens/subcategories/all?page=${query.page}&limit=${query.limit}${
        query.search ? `&search=${encodeURIComponent(query.search)}` : ""
      }${
        query.status && query.status !== "all" ? `&status=${query.status}` : ""
      }`,
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
    getUnapprovedKitchens: (query: any) =>
      `/kitchens/requested/all?page=${query.page}&limit=${query.limit}&search=${
        query.search || ""
      }`,
    getCollabeDetails: "/kitchens/get-details",
  },
  organization: {
    newOrganization: "/organization/new",
    updateOrganization: (orgId: string | undefined) =>
      `/organization/update/${orgId}`,
    deleteOrganization: (orgId: string | undefined) =>
      `/organization/delete/${orgId}`,
    getAllOrganization: (query: any) =>
      `/organization/all?page=${query.page}&limit=${
        query.limit
      }&search=${encodeURIComponent(query.search || "")}` +
      `${
        query.category ? `&category=${encodeURIComponent(query.category)}` : ""
      }` +
      `${
        query.subcategory
          ? `&subcategory=${encodeURIComponent(query.subcategory)}`
          : ""
      }`,

    getOrganizationById: (orgId: string | undefined) =>
      `/organization/${orgId}`,
    getAllCategoriesByStatus: "/organization/category/status",
    toggleOrgStatus: (id: string | undefined) => `/organization/status/${id}`,
    getUserApprovedOrganizations: "/organization//user/get-all",

    createCategory: "/organization/categories",
    getAllCategories: (query: any) =>
      `/organization/categories/all?page=${query.page}&limit=${query.limit}` +
      `${query.search ? `&search=${encodeURIComponent(query.search)}` : ""}` +
      `${
        query.status && query.status !== "all" ? `&status=${query.status}` : ""
      }`,
    updateCategory: (id: string | undefined) =>
      `/organization/categories/${id}`,
    deleteCategory: (id: string | undefined) =>
      `/organization/categories/${id}`,
    toggleCategoryStatus: (id: string | undefined) =>
      `/organization/categories/${id}/toggle-status`,

    createSubcategory: "/organization/subcategories",
    getAllSubCategories: (query: any) =>
      `/organization/subcategories/all?page=${query.page}&limit=${query.limit}` +
      `${query.search ? `&search=${encodeURIComponent(query.search)}` : ""}` +
      `${
        query.status && query.status !== "all" ? `&status=${query.status}` : ""
      }`,
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
    getUnapprovedOrganizations: (query: any) =>
      `/organization/requested/all?page=${query.page}&limit=${
        query.limit
      }&search=${query.search || ""}`,
    approveOrganization: (orgId: string | undefined) =>
      `/organization/approve/${orgId}`,

    // selectKitchen:(orgId: string | undefined)=>`/organization/select`,
    // getSelectedKitchen:(orgId: string | undefined)=>`/organization/${orgId}/selcted-kitchens`
  },
  menu: {
    createCategory: "/menu/categories",
    getAllCategories: (query: any) =>
      `/menu/categories?page=${query.page}&limit=${query.limit}${
        query.search ? `&search=${encodeURIComponent(query.search)}` : ""
      }${
        query.status && query.status !== "all" ? `&status=${query.status}` : ""
      }`,
    updateCategory: (id: string | undefined) => `/menu/categories/${id}`,
    deleteCategory: (id: string | undefined) => `/menu/categories/${id}`,
    toggleCategoryStatus: (id: string | undefined) =>
      `/menu/categories/${id}/toggle-status`,

    createSubcategory: "/sub-menu-category/subcategories",
    getAllCategoriesByStatus: "/sub-menu-category/category/status",
    getAllSubCategories: (query: any) =>
      `/menu/subcategories?page=${query.page}&limit=${query.limit}${
        query.search ? `&search=${encodeURIComponent(query.search)}` : ""
      }${
        query.status && query.status !== "all" ? `&status=${query.status}` : ""
      }`,

    getSubcategoriesByCategory: (categoryId: string | undefined) =>
      `/menu/categories/${categoryId}/subcategories`,
    getSubcategoryById: (id: string | undefined) => `/menu/subcategories/${id}`,
    updateSubcategory: (id: string | undefined) => `/menu/subcategories/${id}`,
    deleteSubcategory: (id: string | undefined) => `/menu/subcategories/${id}`,
    toggleSubcategoryStatus: (id: string | undefined) =>
      `/menu/subcategories/${id}/toggle-status`,

    createItem: "/menu-items/allmenuitems",
    listItems: (query: any) =>
      `/menu-items/allmenuitems?page=${query.page}&limit=${
        query.limit
      }&search=${encodeURIComponent(query.search || "")}` +
      `${
        query.category ? `&category=${encodeURIComponent(query.category)}` : ""
      }` +
      `${
        query.subcategory
          ? `&subcategory=${encodeURIComponent(query.subcategory)}`
          : ""
      }`,
    getItemById: (id: string | undefined) => `/menu-items/allmenuitems/${id}`,
    updateItem: (id: string | undefined) => `/menu-items/allmenuitems/${id}`,
    deleteItem: (id: string | undefined) => `/menu-items/allmenuitems/${id}`,
    changeItemStatus: (id: string | undefined) =>
      `/menu-items/allmenuitems/${id}/status`,

    getMenuItemsByKitchen: (id: string | undefined, role: string) =>
      `/menu-items/kitchen/${id}?role=${role}`,

    createNewMenutags: "/menu/new/menu-tags",
    getAllTags: (query: any) =>
      `/menu/get/menu-tags?page=${query.page}&limit=${query.limit}${
        query.search ? `&search=${encodeURIComponent(query.search)}` : ""
      }${
        query.status && query.status !== "all" ? `&status=${query.status}` : ""
      }`,
    updateTag: (id: string | undefined) => `/menu/update/menu-tags/${id}`,
    deleteTag: (id: string | undefined) => `/menu/delete/menu-tags/${id}`,
    toggleTagStatus: (id: string | undefined) => `/menu/toggle/menu-tags/${id}`,
  },
  designation: {
    createDesignation: "/designation/designations",
    getAllDesignations: (query: any) =>
      `/designation/designations/all?page=${query.page}&limit=${query.limit}${
        query.search ? `&search=${query.search}` : ""
      }${
        query.status && query.status !== "all" ? `&status=${query.status}` : ""
      }`,
    getDesignationById: (id: string | undefined) =>
      `/designation/designations/${id}`,
    updateDesignation: (id: string | undefined) =>
      `/designation/designations/${id}`,
    deleteDesignation: (id: string | undefined) =>
      `/designation/designations/${id}`,
    toggleDesignationStatus: (id: string | undefined) =>
      `/designation/designations/${id}/toggle-status`,
  },
  adminEmployee: {
    createEmployee: "/admin-employee/employees",
    getAllEmployees: (query: any) =>
      `/admin-employee/employees/all?page=${query.page}&limit=${
        query.limit
      }&search=${query.search || ""}`,
    getEmployeeById: (id: string | undefined) =>
      `/admin-employee/employees/${id}`,
    updateEmployee: (id: string | undefined) =>
      `/admin-employee/employees/${id}`,
    deleteEmployee: (id: string | undefined) =>
      `/admin-employee/employees/${id}`,
    toggleEmployeeStatus: (id: string | undefined) =>
      `/admin-employee/employees/${id}/toggle-status`,

    verifyDocument: (docId: string | undefined, docType: string) =>
      `/admin/verify/document?documentId=${docId}&documentType=${docType}`,
  },
  orgemployee: {
    createOrgEmployee: "/org-employee/orgemployee",
    getAllOrgEmployees: (id: string | number, query: any) =>
      `/org-employee/orgemployee/all/${id}?page=${query.page}&limit=${
        query.limit
      }&search=${query.search || ""}`,
    getOrgEmployeeById: (id: string | undefined) =>
      `/org-employee/orgemployee/${id}`,
    updateOrgEmployee: (id: string | undefined) =>
      `/org-employee/orgemployee/${id}`,
    deleteOrgEmployee: (id: string | undefined) =>
      `/org-employee/orgemployee/${id}`,
    toggleOrgEmployeeStatus: (id: string | undefined) =>
      `/org-employee/orgemployee/${id}/toggle-status`,
    getEmployeeOrg: (email: string | undefined) =>
      `/org-employee/employee/org?email=${email}`,
  },
  kitchenEmployee: {
    createEmployee: "/kitchen-employee/employees",
    getAllEmployees: (kitchenId: string | number, query: any) =>
      `/kitchen-employee/employees-all/${kitchenId}?page=${query.page}&limit=${
        query.limit
      }&search=${query.search || ""}`,
    getEmployeeById: (id: string | undefined) =>
      `/kitchen-employee/employees/${id}`,
    updateEmployee: (id: string | undefined) =>
      `/kitchen-employee/employees/${id}`,
    deleteEmployee: (id: string | undefined) =>
      `/kitchen-employee/employees/${id}`,
    toggleEmployeeStatus: (id: string | undefined) =>
      `/kitchen-employee/employees/${id}/toggle-status`,
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
  addressDetails: {
    getAllCountries: "/addressDetails/allcountries",
    getStatesByCountry: (countryName: string | undefined) =>
      `/addressDetails/states/${countryName}`,
    getCitiesByState: (stateName: string | undefined) =>
      `/addressDetails/cities/${stateName}`,
    getDistrictsByState: (stateId: string | undefined) =>
      `/addressDetails/districts/${stateId}`,
  },
  notification: {
    generateKitchenNotification: "/notification/generate-kitchen",
    getUserNotifications: (id: string | undefined) => `/notification/get/${id}`,
    getAllNotifications: "/notification/all",
    generateOrganizationNotification: "/notification/generate-organization",
  },
  collab: {
    collaborateKitchen: "collab/select",
    listCollaboratedKitchens: (orgId: string | undefined) =>
      `collab/organization/${orgId}`,
    getAllCollaborations: "collab/all",
    getCollaborationById: (id: string | undefined) => `collab/${id}`,
    requestCollaboration: "/collab/request/add-new-collab",
    getCollaborationDetails: "/collab/get-collaboration-details",
  },
  roleAndAccess: {
    newDesignation: "/role-and-access/new",
    editDesignation: (roleId: string | number) => `/role-and-access/${roleId}`,
    getDesignation: (entity_id: string | number, entity_type: string) =>
      `/role-and-access?entity_id=${encodeURIComponent(
        String(entity_id)
      )}&entity_type=${encodeURIComponent(entity_type)}`,
    getRoleAndAccess: (roleId: string | number) => `/role-and-access/${roleId}`,
  },
};
