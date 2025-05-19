import React, { useEffect, useState } from "react";
import {
  PlusCircle,
  X,
  Shield,
  Users,
  FileText,
  BarChart as ChartBar,
  Settings,
  Coffee,
  Trello,
  Twitch,
  Zap,
  Command,
  Airplay,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import PageTitle from "../../../components/PageTitle";
import {
  createNewDesignation,
  getDesignation,
} from "../../../server/admin/orgemployeemanagment";
import { useAuthDetails } from "../../../hooks/useAuthDetails";
import { toast } from "react-toastify";
import {
  getMenuItems,
  getMenuKitchenItems,
  getMenuOrgItems,
  getMenuSuperAdminItems,
} from "../../../helpers/menu";

interface AccessPermission {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

const menuIconMap: Record<string, React.ReactNode> = {
  airplay: <Airplay className="text-primary" size={20} />,
  coffee: <Coffee className="text-primary" size={20} />,
  trello: <Trello className="text-primary" size={20} />,
  twitch: <Twitch className="text-primary" size={20} />,
  zap: <Zap className="text-primary" size={20} />,
  command: <Command className="text-primary" size={20} />,
  fileText: <FileText className="text-primary" size={20} />,
  chartBar: <ChartBar className="text-primary" size={20} />,
  users: <Users className="text-primary" size={20} />,
  shield: <Shield className="text-primary" size={20} />,
  settings: <Settings className="text-primary" size={20} />,
};

const PERMISSION_TYPES = ["view", "add", "edit", "delete"];

const PermissionControls = ({
  items,
  selectedPermissions,
  onAllToggle,
  onAccessToggle,
}: any) => {
  return (
    <>
      {items.map((permissionItem: any) => {
        const itemId = permissionItem.key;
        const selected = selectedPermissions[itemId] || [];
        const isAllChecked = PERMISSION_TYPES.every((t) =>
          selected.includes(t)
        );

        return (
          <div key={itemId} className="mb-3">
            <div className="card border-0 bg-light">
              <div className="card-body p-3">
                {/* <div className="d-flex justify-content-between align-items-center mb-2">
                  <label className="fw-semibold">{permissionItem.label}</label>
                  <div className="form-check form-switch">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id={`${itemId}-all`}
                      checked={isAllChecked}
                      onChange={() => onAllToggle(itemId)}
                    />
                    <label
                      className="form-check-label"
                      htmlFor={`${itemId}-all`}
                    >
                      All
                    </label>
                  </div>
                </div> */}

                <div className="d-flex flex-wrap gap-4">
                  <div className="form-check form-check-inline">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id={`${itemId}-all`}
                      checked={isAllChecked}
                      onChange={() => onAllToggle(itemId)}
                    />
                    <label
                      className="form-check-label"
                      htmlFor={`${itemId}-all`}
                    >
                      All
                    </label>
                  </div>
                  {PERMISSION_TYPES.map((type) => (
                    <div key={type} className="form-check form-check-inline">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id={`${itemId}-${type}`}
                        checked={selected.includes(type)}
                        onChange={() => onAccessToggle(itemId, type)}
                      />
                      <label
                        className="form-check-label text-capitalize"
                        htmlFor={`${itemId}-${type}`}
                      >
                        {type}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

function NewDesignation() {
  const { user, context, isContext, isSuperAdmin } = useAuthDetails();
  const [designations, setDesignations] = useState<any[]>([]);
  const [selectedDesignation, setSelectedDesignation] = useState("");
  const [newDesignation, setNewDesignation] = useState("");
  const [showNewDesignationInput, setShowNewDesignationInput] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState<
    Record<string, string[]>
  >({});
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const [originalDesignation, setOriginalDesignation] = useState<{
    roleName: string;
    permissions: Record<string, string[]>;
  } | null>(null);

  // Get menu items based on user role/context
  const menuItems = (() => {
    switch (true) {
      case isSuperAdmin:
        return getMenuSuperAdminItems();
      case isContext && context?.contextType === "Organization":
        return getMenuOrgItems();
      case isContext && context?.contextType === "Kitchen":
        return getMenuKitchenItems();
      default:
        return getMenuItems();
    }
  })();

  // Recursively get all menu keys including nested ones
  const getAllMenuKeys = (items: any[]): string[] => {
    return items.reduce((keys: string[], item) => {
      keys.push(item.key);
      if (item.children) {
        keys.push(...getAllMenuKeys(item.children));
      }
      return keys;
    }, []);
  };

  // Get all permission keys
  const getAllPermissionKeys = () => {
    return getAllMenuKeys(menuItems);
  };

  // Toggle permission for an item and its children
  const handleToggleItem = (item: any) => {
    setSelectedPermissions((prev) => {
      const newPerms = { ...prev };
      const allKeys = [item.key];

      // Recursively collect all child keys
      const collectKeys = (menuItem: any) => {
        if (menuItem.children) {
          menuItem.children.forEach((child: any) => {
            allKeys.push(child.key);
            collectKeys(child);
          });
        }
      };

      collectKeys(item);

      // Toggle all collected keys
      const isCurrentlySelected = !!newPerms[item.key];
      allKeys.forEach((key) => {
        if (isCurrentlySelected) {
          delete newPerms[key];
        } else {
          newPerms[key] = [...PERMISSION_TYPES];
        }
      });

      return newPerms;
    });
  };

  // Toggle specific permission type for a key
  const handleAccessToggle = (permissionId: string, accessType: string) => {
    setSelectedPermissions((prev) => {
      const current = prev[permissionId] || [];
      const isChecked = current.includes(accessType);
      const updated = isChecked
        ? current.filter((t) => t !== accessType)
        : [...current, accessType];
      return { ...prev, [permissionId]: updated };
    });
  };

  // Toggle all permission types for a key
  const handleAllToggle = (permissionId: string) => {
    setSelectedPermissions((prev) => {
      const hasAll = PERMISSION_TYPES.every((t) =>
        prev[permissionId]?.includes(t)
      );
      return {
        ...prev,
        [permissionId]: hasAll ? [] : [...PERMISSION_TYPES],
      };
    });
  };

  // Toggle menu expansion
  const toggleExpand = (key: string) => {
    setExpandedMenus((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  // Add new designation
  const handleAddNewDesignation = () => {
    if (newDesignation.trim()) {
      const roleName = newDesignation.trim();
      const newDesignationObj = {
        _id: `temp-${Date.now()}`,
        roleName,
        permissions: [],
      };
      setDesignations((prev) => [...prev, newDesignationObj]);
      setNewDesignation("");
      setShowNewDesignationInput(false);
      setSelectedDesignation(roleName);
    }
  };

  // Save designation to backend
  const saveNewDesignation = async (data: {
    roleName: string;
    permissions: Record<string, string[]>;
  }) => {
    try {
      if (!context?.contextId) throw new Error("Context missing");
      const response = await createNewDesignation({
        ...data,
        entityId: context.contextId,
        entityType: context.contextType,
      });
      response.status
        ? toast.success(response.message)
        : toast.error(response.message);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  // Check if there are unsaved changes
  const hasChanges = () => {
    if (!originalDesignation) return true;
    const current = JSON.stringify(selectedPermissions);
    const original = JSON.stringify(originalDesignation.permissions);
    return (
      selectedDesignation !== originalDesignation.roleName ||
      current !== original
    );
  };

  // Toggle select all permissions
  const handleSelectAllToggle = () => {
    const allKeys = getAllPermissionKeys();
    const allSelected = allKeys.every(
      (key) => selectedPermissions[key]?.length === PERMISSION_TYPES.length
    );

    if (allSelected) {
      setSelectedPermissions({});
    } else {
      const newPerms: Record<string, string[]> = {};
      allKeys.forEach((key) => {
        newPerms[key] = [...PERMISSION_TYPES];
      });
      setSelectedPermissions(newPerms);
    }
  };

  // Fetch designations on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getDesignation(
          context?.contextId,
          context?.contextType
        );
        if (response.status) setDesignations(response.data);
        else toast.error(response.message);
      } catch (err: any) {
        toast.error(err.message);
      }
    };
    fetchData();
  }, []);

  // Update permissions when designation changes
  useEffect(() => {
    const selected = designations.find(
      (d) => d.roleName === selectedDesignation
    );
    if (selected) {
      setSelectedPermissions(selected.permissions || {});
      setOriginalDesignation({
        roleName: selected.roleName,
        permissions: selected.permissions || {},
      });
    } else {
      setSelectedPermissions({});
      setOriginalDesignation(null);
    }
  }, [selectedDesignation, designations]);
  const renderPermissionGroup = (item: any, level = 0) => {
    const isExpanded = expandedMenus.includes(item.key);
    const itemSelected = selectedPermissions[item.key];
    const isLeafNode = !item.children || item.children.length === 0;

    return (
      <div
        key={item.key}
        className="permission-group"
        style={{ marginLeft: `${level * 20}px` }}
      >
        <div
          className={`card ${
            itemSelected?.length
              ? "border-primary bg-primary bg-opacity-10"
              : "border"
          }`}
        >
          <div className="card-body p-3">
            <div className="d-flex align-items-center justify-content-between">
              <div className="form-check d-flex align-items-center">
                <input
                  type="checkbox"
                  className="form-check-input me-3"
                  id={item.key}
                  checked={!!itemSelected}
                  onChange={() => handleToggleItem(item)}
                />
                <label
                  className="form-check-label fw-semibold"
                  htmlFor={item.key}
                >
                  {item.label}
                </label>
              </div>
              {item.children && (
                <button
                  className="btn btn-sm btn-link text-decoration-none"
                  onClick={() => toggleExpand(item.key)}
                >
                  {isExpanded ? (
                    <ChevronUp size={18} />
                  ) : (
                    <ChevronDown size={18} />
                  )}
                </button>
              )}
            </div>

            {item.children && isExpanded && (
              <div className="mt-3">
                {item.children.map((child: any) =>
                  renderPermissionGroup(child, level + 1)
                )}

                {isLeafNode && (
                  <PermissionControls
                    items={[item]}
                    selectedPermissions={selectedPermissions}
                    onAllToggle={handleAllToggle}
                    onAccessToggle={handleAccessToggle}
                  />
                )}
              </div>
            )}
            {!item.children && (
              <div className="mt-3">
                <PermissionControls
                  items={[item]}
                  selectedPermissions={selectedPermissions}
                  onAllToggle={handleAllToggle}
                  onAccessToggle={handleAccessToggle}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-vh-100 bg-light">
      <PageTitle
        breadCrumbItems={[
          { label: "Kitchens", path: "/apps/kitchen/list" },
          { label: "List", path: "/apps/kitchen/list", active: true },
        ]}
        title={"Kitchens"}
      />

      <div
        className="mb-3"
        style={{ backgroundColor: "#5bd2bc", padding: "10px" }}
      >
        <div className="d-flex align-items-center justify-content-between">
          <h3 className="page-title m-0" style={{ color: "#fff" }}>
            Create New Designation
          </h3>
        </div>
      </div>

      <div className="container p-0">
        <div className="row justify-content-center">
          <div className="col-12">
            <div className="card shadow">
              <div className="card-body p-4">
                <div className="mb-4">
                  <label className="form-label fw-semibold mb-2">
                    Designation Name
                  </label>
                  <div className="mb-3">
                    <select
                      value={selectedDesignation}
                      onChange={(e) => setSelectedDesignation(e.target.value)}
                      className="form-select"
                    >
                      <option value="">Select a designation</option>
                      {designations.map((designation) => (
                        <option
                          key={designation._id}
                          value={designation.roleName}
                        >
                          {designation.roleName}
                        </option>
                      ))}
                    </select>
                  </div>
                  {!showNewDesignationInput ? (
                    <button
                      onClick={() => setShowNewDesignationInput(true)}
                      className="btn btn-sm btn-outline-primary d-inline-flex align-items-center"
                    >
                      <PlusCircle size={16} className="me-2" />
                      Add New Designation
                    </button>
                  ) : (
                    <div className="mt-3 d-flex align-items-center gap-2">
                      <input
                        type="text"
                        value={newDesignation}
                        onChange={(e) => setNewDesignation(e.target.value)}
                        placeholder="Enter new designation"
                        className="form-control"
                      />
                      <button
                        onClick={handleAddNewDesignation}
                        className="btn btn-primary"
                      >
                        Add
                      </button>
                      <button
                        onClick={() => {
                          setShowNewDesignationInput(false);
                          setNewDesignation("");
                        }}
                        className="btn btn-outline-secondary rounded-circle p-1"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  )}
                </div>
                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h2 className="h5 fw-semibold">Access Permissions</h2>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary"
                      onClick={handleSelectAllToggle}
                    >
                      {getAllPermissionKeys().every(
                        (key) =>
                          selectedPermissions[key]?.length ===
                          PERMISSION_TYPES.length
                      )
                        ? "Deselect All"
                        : "Select All"}
                    </button>
                  </div>

                  <div className="d-flex flex-column gap-3">
                    {menuItems.map((item: any) => renderPermissionGroup(item))}
                  </div>
                </div>
                <div className="d-flex justify-content-end pt-4 border-top">
                  <button
                    type="button"
                    className="btn btn-primary px-4 py-2"
                    onClick={() => {
                      if (!selectedDesignation.trim()) {
                        alert("Please select or enter a designation name.");
                        return;
                      }

                      saveNewDesignation({
                        roleName: selectedDesignation.trim(),
                        permissions: selectedPermissions,
                      });
                    }}
                    disabled={!hasChanges()}
                  >
                    Save Designation
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewDesignation;
