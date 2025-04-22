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
import { Link } from "react-router-dom";
import PageTitle from "../../../components/PageTitle";
import { ORG_MENU } from "../../../constants/menu";
import {
  createNewDesignation,
  getDesignation,
} from "../../../server/admin/orgemployeemanagment";
import { useAuthDetails } from "../../../hooks/useAuthDetails";
import { toast } from "react-toastify";

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
                <div className="d-flex justify-content-between align-items-center mb-2">
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
                </div>

                <div className="d-flex flex-wrap gap-4">
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
  const { context } = useAuthDetails();
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

  const saveNewDesignation = async (data: {
    roleName: string;
    permissions: Record<string, string[]>;
  }) => {
    try {
      console.log(data);
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
    const current = JSON.stringify(selectedPermissions);
    const original = JSON.stringify(originalDesignation.permissions);
    return (
      selectedDesignation !== originalDesignation.roleName ||
      current !== original
    );
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
    } else {
      setSelectedPermissions({});
      setOriginalDesignation(null);
    }
  }, [selectedDesignation, designations]);

  const toggleExpand = (key: string) => {
    setExpandedMenus((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const getAllPermissionKeys = () => {
    const keys: string[] = [];
    ORG_MENU.forEach((parent) => {
      keys.push(parent.key);
      parent.children?.forEach((child: any) => keys.push(child.key));
    });
    return keys;
  };

  const handleSelectAllToggle = () => {
    const allKeys = getAllPermissionKeys();
    const allSelected = allKeys.every(
      (key) => selectedPermissions[key]?.length === PERMISSION_TYPES.length
    );

    if (allSelected) {
      // Deselect all
      const cleared: Record<string, string[]> = {};
      setSelectedPermissions(cleared);
    } else {
      // Select all
      const newPerms: Record<string, string[]> = {};
      allKeys.forEach((key) => {
        newPerms[key] = [...PERMISSION_TYPES];
      });
      setSelectedPermissions(newPerms);
    }
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
                    {ORG_MENU.map((parent) => {
                      const parentId = parent.key;
                      const children = parent.children || [];
                      const isParentExpanded = expandedMenus.includes(parentId);
                      const parentSelected = selectedPermissions[parentId];

                      return (
                        <div key={parentId} className="permission-group">
                          <div
                            className={`card ${
                              parentSelected?.length
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
                                    id={parentId}
                                    checked={!!parentSelected}
                                    onChange={() => {
                                      setSelectedPermissions((prev) => {
                                        const childKeys = children.map(
                                          (c) => c.key
                                        );
                                        const all = [parentId, ...childKeys];
                                        const newPerms = { ...prev };
                                        if (newPerms[parentId]) {
                                          all.forEach(
                                            (key) => delete newPerms[key]
                                          );
                                        } else {
                                          all.forEach(
                                            (key) =>
                                              (newPerms[key] = [
                                                ...PERMISSION_TYPES,
                                              ])
                                          );
                                        }
                                        return newPerms;
                                      });
                                    }}
                                  />
                                  <label
                                    className="form-check-label fw-semibold"
                                    htmlFor={parentId}
                                  >
                                    {parent.label}
                                  </label>
                                </div>

                                {children.length > 0 && (
                                  <button
                                    className="btn btn-sm btn-link text-decoration-none"
                                    onClick={() => toggleExpand(parentId)}
                                  >
                                    {isParentExpanded ? (
                                      <ChevronUp size={18} />
                                    ) : (
                                      <ChevronDown size={18} />
                                    )}
                                  </button>
                                )}
                              </div>
                              {(children.length > 0 && isParentExpanded) ||
                              children.length === 0 ? (
                                <div className="mt-3">
                                  <PermissionControls
                                    items={
                                      children.length > 0 ? children : [parent]
                                    }
                                    selectedPermissions={selectedPermissions}
                                    onAllToggle={handleAllToggle}
                                    onAccessToggle={handleAccessToggle}
                                  />
                                </div>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      );
                    })}
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
