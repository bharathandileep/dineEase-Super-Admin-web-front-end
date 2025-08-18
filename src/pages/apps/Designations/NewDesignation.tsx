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
  ChevronDown,
  ChevronRight,
  Edit,
  Check,
  Minus,
} from "lucide-react";
import PageTitle from "../../../components/PageTitle";
import {
  createNewDesignation,
  editRoleName,
  getDesignation,
} from "../../../services/admin/orgemployeemanagment";
import { useAuthDetails } from "../../../hooks/useAuthDetails";
import { toast } from "react-toastify";
import {
  getMenuItems,
  getMenuKitchenItems,
  getMenuOrgItems,
  getMenuSuperAdminItems,
} from "../../../helpers/menu";

interface MenuItem {
  key: string;
  label: string;
  icon?: string;
  children?: MenuItem[];
}

const menuIconMap: Record<string, React.ReactNode> = {
  airplay: <Airplay className="text-primary" size={16} />,
  coffee: <Coffee className="text-primary" size={16} />,
  trello: <Trello className="text-primary" size={16} />,
  twitch: <Twitch className="text-primary" size={16} />,
  zap: <Zap className="text-primary" size={16} />,
  command: <Command className="text-primary" size={16} />,
  fileText: <FileText className="text-primary" size={16} />,
  chartBar: <ChartBar className="text-primary" size={16} />,
  users: <Users className="text-primary" size={16} />,
  shield: <Shield className="text-primary" size={16} />,
  settings: <Settings className="text-primary" size={16} />,
};

const PERMISSION_TYPES = ["view", "add", "edit", "delete"];

const PermissionRow = ({
  item,
  level = 0,
  selectedPermissions,
  onToggleItem,
  onTogglePermission,
  expandedItems,
  onToggleExpand,
}: {
  item: MenuItem;
  level?: number;
  selectedPermissions: Record<string, string[]>;
  onToggleItem: (item: MenuItem) => void;
  onTogglePermission: (itemKey: string, permission: string) => void;
  expandedItems: string[];
  onToggleExpand: (key: string) => void;
}) => {
  const isExpanded = expandedItems.includes(item.key);
  const hasChildren = item.children && item.children.length > 0;
  const isSelected = !!selectedPermissions[item.key];
  const isPartiallySelected =
    hasChildren &&
    !isSelected &&
    item.children?.some(
      (child) =>
        selectedPermissions[child.key] ||
        child.children?.some(
          (grandchild) => selectedPermissions[grandchild.key]
        )
    );

  const getIcon = () => {
    if (!hasChildren) return null;
    return isExpanded ? (
      <ChevronDown size={16} className="me-2" />
    ) : (
      <ChevronRight size={16} className="me-2" />
    );
  };

  return (
    <>
      <tr
        className={`${level > 0 ? "child-row" : ""} ${
          isSelected ? "table-primary" : ""
        }`}
        style={{
          backgroundColor: level % 2 === 0 ? "#f8f9fa" : "white",
        }}
      >
        <td style={{ paddingLeft: `${level * 20 + 8}px` }}>
          <div className="d-flex align-items-center">
            {hasChildren && (
              <button
                className="btn btn-sm btn-link p-0 me-2"
                onClick={() => onToggleExpand(item.key)}
              >
                {getIcon()}
              </button>
            )}
            {!hasChildren && (
              <span style={{ width: 24, display: "inline-block" }} />
            )}
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                checked={isSelected}
                onChange={() => onToggleItem(item)}
                id={`perm-${item.key}`}
              />
              <label className="form-check-label" htmlFor={`perm-${item.key}`}>
                {item.label}
              </label>
              {isPartiallySelected && (
                <Minus size={16} className="text-primary ms-2" />
              )}
            </div>
          </div>
        </td>
        {PERMISSION_TYPES.map((permission) => (
          <td key={permission} className="text-center">
            <input
              type="checkbox"
              className="form-check-input"
              checked={
                selectedPermissions[item.key]?.includes(permission) || false
              }
              onChange={() => onTogglePermission(item.key, permission)}
              disabled={!isSelected && !isPartiallySelected}
            />
          </td>
        ))}
      </tr>
      {hasChildren &&
        isExpanded &&
        item.children?.map((child) => (
          <PermissionRow
            key={child.key}
            item={child}
            level={level + 1}
            selectedPermissions={selectedPermissions}
            onToggleItem={onToggleItem}
            onTogglePermission={onTogglePermission}
            expandedItems={expandedItems}
            onToggleExpand={onToggleExpand}
          />
        ))}
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
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [originalDesignation, setOriginalDesignation] = useState<{
    roleName: string;
    permissions: Record<string, string[]>;
  } | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [designationToEdit, setDesignationToEdit] = useState("");

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

  const getAllMenuKeys = (items: any[]): string[] => {
    return items.reduce((keys: string[], item) => {
      keys.push(item.key);
      if (item.children) {
        keys.push(...getAllMenuKeys(item.children));
      }
      return keys;
    }, []);
  };

  const getAllPermissionKeys = () => {
    return getAllMenuKeys(menuItems);
  };

  const handleToggleItem = (item: any) => {
    setSelectedPermissions((prev) => {
      const newPerms = { ...prev };
      const allKeys = [item.key];

      const collectKeys = (menuItem: any) => {
        if (menuItem.children) {
          menuItem.children.forEach((child: any) => {
            allKeys.push(child.key);
            collectKeys(child);
          });
        }
      };

      collectKeys(item);
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

  const handleTogglePermission = (itemKey: string, permission: string) => {
    setSelectedPermissions((prev) => {
      const current = prev[itemKey] || [];
      const isChecked = current.includes(permission);
      const updated = isChecked
        ? current.filter((t) => t !== permission)
        : [...current, permission];
      return { ...prev, [itemKey]: updated };
    });
  };

  const handleToggleExpand = (key: string) => {
    setExpandedItems((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const handleAddNewDesignation = async () => {
    if (newDesignation.trim()) {
      try {
        if (isEditing) {
          const designationToUpdate = designations.find(
            (d) => d.roleName === designationToEdit
          );

          if (!designationToUpdate) {
            toast.error("Designation not found");
            return;
          }
          const response = await editRoleName({
            id: designationToUpdate._id,
            roleName: newDesignation.trim(),
          });

          if (response.status) {
            setDesignations((prev) =>
              prev.map((d) =>
                d.roleName === designationToEdit
                  ? {
                      ...d,
                      roleName: newDesignation.trim(),
                      permissions: selectedPermissions,
                    }
                  : d
              )
            );

            if (selectedDesignation === designationToEdit) {
              setSelectedDesignation(newDesignation.trim());
            }

            toast.success(response.message);
          } else {
            toast.error(response.message);
          }
        } else {
          // Add new designation
          const roleName = newDesignation.trim();
          const response = await createNewDesignation({
            roleName,
            permissions: selectedPermissions,
            entityId: context?.contextId,
            entityType: context?.contextType,
          });

          if (response.status) {
            const newDesignationObj = {
              ...response.data,
              roleName,
              permissions: selectedPermissions,
            };
            setDesignations((prev) => [...prev, newDesignationObj]);
            setSelectedDesignation(roleName);
            toast.success(response.message);
          } else {
            toast.error(response.message);
          }
        }

        // Reset form
        setNewDesignation("");
        setShowNewDesignationInput(false);
        setIsEditing(false);
        setDesignationToEdit("");
      } catch (err: any) {
        toast.error(err.message);
      }
    }
  };

  const handleEditDesignation = (designationName: string) => {
    setDesignationToEdit(designationName);
    setNewDesignation(designationName);
    setShowNewDesignationInput(true);
    setIsEditing(true);
  };

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

  const hasChanges = () => {
    if (!originalDesignation) return true;
    const currentPermissions = JSON.stringify(selectedPermissions);
    const originalPermissions = JSON.stringify(originalDesignation.permissions);
    const permissionsChanged = currentPermissions !== originalPermissions;
    const nameChanged =
      !isEditing && selectedDesignation !== originalDesignation.roleName;
    const editingNameChanged =
      isEditing &&
      newDesignation.trim() !== originalDesignation.roleName &&
      newDesignation.trim() !== "";

    return permissionsChanged || nameChanged || editingNameChanged;
  };

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
      // Expand all items when a designation is selected
      setExpandedItems(getAllMenuKeys(menuItems));
    } else {
      setSelectedPermissions({});
      setOriginalDesignation(null);
    }
  }, [selectedDesignation, designations]);

  return (
    <div className="min-vh-100 bg-light">
      <PageTitle
        breadCrumbItems={[
          { label: "designations", path: "/apps/designations" },
          { label: "list", path: "/apps/designations", active: true },
        ]}
        title={"designations"}
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
                  <div className="d-flex gap-2">
                    {/* Always show Add New button */}

                    {selectedDesignation ? (
                      <button
                        onClick={() =>
                          handleEditDesignation(selectedDesignation)
                        }
                        className="btn btn-sm btn-outline-secondary d-inline-flex align-items-center"
                      >
                        <Edit size={16} className="me-2" />
                        Edit Designation
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setShowNewDesignationInput(true);
                          setIsEditing(false);
                          setDesignationToEdit("");
                          setNewDesignation("");
                        }}
                        className="btn btn-sm btn-primary d-inline-flex align-items-center"
                      >
                        <PlusCircle size={16} className="me-2" />
                        Add New Designation
                      </button>
                    )}
                  </div>

                  {showNewDesignationInput && (
                    <div className="mt-3 d-flex align-items-center gap-2">
                      <input
                        type="text"
                        value={newDesignation}
                        onChange={(e) => setNewDesignation(e.target.value)}
                        placeholder={
                          isEditing
                            ? "Edit designation name"
                            : "Enter new designation"
                        }
                        className="form-control"
                      />
                      <button
                        onClick={handleAddNewDesignation}
                        className="btn btn-primary"
                      >
                        {isEditing ? "Update" : "Add"}
                      </button>
                      <button
                        onClick={() => {
                          setShowNewDesignationInput(false);
                          setNewDesignation("");
                          setIsEditing(false);
                          setDesignationToEdit("");
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

                  <div className="table-responsive">
                    <table className="table table-bordered table-hover">
                      <thead className="table-light">
                        <tr>
                          <th style={{ width: "40%" }}>Permission</th>
                          {PERMISSION_TYPES.map((perm) => (
                            <th key={perm} className="text-center">
                              {perm.charAt(0).toUpperCase() + perm.slice(1)}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {menuItems.map((item: any) => (
                          <PermissionRow
                            key={item.key}
                            item={item}
                            selectedPermissions={selectedPermissions}
                            onToggleItem={handleToggleItem}
                            onTogglePermission={handleTogglePermission}
                            expandedItems={expandedItems}
                            onToggleExpand={handleToggleExpand}
                          />
                        ))}
                      </tbody>
                    </table>
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
