import React, { useEffect, useRef, useState, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { Collapse } from "react-bootstrap";
import classNames from "classnames";
import FeatherIcon from "feather-icons-react";
import { findAllParent, findMenuItem } from "../helpers/menu";
import { MenuItemTypes } from "../constants/menu";
import { useAuthDetails } from "../hooks/useAuthDetails";
import { getRoleAndAccessById } from "../server/admin/auth";

interface SubMenus {
  item: MenuItemTypes;
  linkClassName?: string;
  subMenuClassNames?: string;
  activeMenuItems?: string[];
  toggleMenu?: (item: MenuItemTypes, status: boolean) => void;
  className?: string;
  userAccess?: Record<string, string[]>;
  userHasFullAccess?: boolean;
  level?: number;
}

interface Permissions {
  [key: string]: string[];
}

const normalizeKey = (key: string) => key.toLowerCase().replace(/-/g, "");

const hasPermission = (
  key: string | undefined,
  permissions: Permissions,
  requiredPermission: string = "view"
): boolean => {
  if (!key) return false;
  const permissionKey = Object.keys(permissions).find(
    (permKey) => normalizeKey(permKey) === normalizeKey(key)
  );

  return permissionKey
    ? permissions[permissionKey].includes(requiredPermission)
    : false;
};

const MenuItemWithChildren = ({
  item,
  linkClassName,
  subMenuClassNames,
  activeMenuItems = [],
  toggleMenu,
  userAccess = {},
  userHasFullAccess = false,
  level = 0,
}: SubMenus) => {
  const [open, setOpen] = useState<boolean>(
    activeMenuItems.includes(item.key || "")
  );

  useEffect(() => {
    setOpen(activeMenuItems.includes(item.key || ""));
  }, [activeMenuItems, item.key]);

  const toggleMenuItem = (e: React.MouseEvent) => {
    e.preventDefault();
    const status = !open;
    setOpen(status);
    if (toggleMenu && item.key) toggleMenu(item, status);
    return false;
  };

  const accessibleChildren = (item.children || []).filter((child) => {
    if (userHasFullAccess) return true;
    return hasPermission(child.key, userAccess);
  });

  if (!userHasFullAccess && accessibleChildren.length === 0) return null;

  return (
    <li className={classNames("menu-item", { "menuitem-active": open })}>
      <Link
        to="#"
        onClick={toggleMenuItem}
        data-menu-key={item.key}
        aria-expanded={open}
        className={classNames("menu-link", linkClassName, {
          active: activeMenuItems.includes(item.key || ""),
        })}
        style={{ paddingLeft: `${12 + level * 16}px` }}
      >
        {item.icon && (
          <span className="menu-icon">
            <FeatherIcon icon={item.icon} size={16} />
          </span>
        )}
        <span className="menu-text">{item.label}</span>
        {!item.badge ? (
          <span className="menu-arrow">
            {/* {item.children && (
                <FeatherIcon icon={open ? "chevron-up" : "chevron-down"} size={14} />
              )} */}
          </span>
        ) : (
          <span
            className={`badge bg-${item.badge.variant} rounded-pill ms-auto`}
          >
            {item.badge.text}
          </span>
        )}
      </Link>
      <Collapse in={open}>
        <div>
          <ul className={classNames(subMenuClassNames)}>
            {accessibleChildren.map((child, i) => {
              return (
                <React.Fragment key={i}>
                  {child.children ? (
                    <MenuItemWithChildren
                      item={child}
                      linkClassName={
                        activeMenuItems.includes(child.key || "")
                          ? "active"
                          : ""
                      }
                      activeMenuItems={activeMenuItems}
                      subMenuClassNames="sub-menu"
                      toggleMenu={toggleMenu}
                      userAccess={userAccess}
                      userHasFullAccess={userHasFullAccess}
                      level={level + 1}
                    />
                  ) : (
                    <MenuItem
                      item={child}
                      className={
                        activeMenuItems.includes(child.key || "")
                          ? "menuitem-active"
                          : ""
                      }
                      linkClassName={
                        activeMenuItems.includes(child.key || "")
                          ? "active"
                          : ""
                      }
                      level={level + 1}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </ul>
        </div>
      </Collapse>
    </li>
  );
};

const MenuItem = ({ item, className, linkClassName, level = 0 }: SubMenus) => {
  const { context } = useAuthDetails();

  if (item.access && !item.access.includes(context?.contextType)) {
    return null;
  }

  return (
    <li className={classNames("menu-item", className)}>
      <MenuItemLink item={item} className={linkClassName} level={level} />
    </li>
  );
};

const MenuItemLink = ({ item, className, level = 0 }: SubMenus) => {
  return (
    <Link
      to={item.url!}
      target={item.target}
      className={classNames("side-nav-link-ref menu-link", className)}
      data-menu-key={item.key}
      style={{ paddingLeft: `${12 + level * 16}px` }}
    >
      {item.icon && (
        <span className="menu-icon">
          <FeatherIcon icon={item.icon} size={16} />
        </span>
      )}
      <span className="menu-text">{item.label}</span>
      {item.badge && (
        <span className={`badge bg-${item.badge.variant} rounded-pill ms-auto`}>
          {item.badge.text}
        </span>
      )}
    </Link>
  );
};

interface AppMenuProps {
  menuItems: MenuItemTypes[];
}

const AppMenu = ({ menuItems }: AppMenuProps) => {
  const location = useLocation();
  const menuRef = useRef<HTMLUListElement>(null);
  const [activeMenuItems, setActiveMenuItems] = useState<string[]>([]);
  const [userAccess, setUserAccess] = useState<Permissions>({});
  const [userHasFullAccess, setUserhasFullAccess] = useState<boolean>(false);
  const { context } = useAuthDetails();

  useEffect(() => {
    const fetchUserRoleAndAccess = async () => {
      try {
        if (context?.role) {
          const response = await getRoleAndAccessById(context.role);
          if (response.data) {
            setUserAccess(response.data.permissions || {});
            setUserhasFullAccess(response.data.hasFullAccess || false);
          }
        }
      } catch (error) {
        console.error("Error fetching user role and access:", error);
      }
    };
    fetchUserRoleAndAccess();
  }, [context?.role]);

  const toggleMenu = useCallback(
    (menuItem: MenuItemTypes, show: boolean) => {
      if (menuItem.key) {
        if (show) {
          // When opening a menu, close all others by only keeping the current menu and its parents
          setActiveMenuItems([
            menuItem.key,
            ...findAllParent(menuItems, menuItem),
          ]);
        } else {
          // When closing a menu, just remove its key
          setActiveMenuItems((prev) =>
            prev.filter((item) => item !== menuItem.key)
          );
        }
      }
    },
    [menuItems]
  );

  const activeMenu = useCallback(() => {
    const div = document.getElementById("main-side-menu");
    let matchingMenuItem: HTMLAnchorElement | null = null;

    if (div) {
      const items = div.getElementsByClassName("side-nav-link-ref");

      for (let i = 0; i < items.length; i++) {
        const item = items[i] as HTMLAnchorElement;
        const trimmedURL = location.pathname.replace(
          process.env.PUBLIC_URL || "",
          ""
        );
        const itemPath = new URL(
          item.href,
          window.location.origin
        ).pathname.replace(process.env.PUBLIC_URL || "", "");

        if (trimmedURL === itemPath) {
          matchingMenuItem = item;
          break;
        }
      }

      if (matchingMenuItem) {
        const mid = matchingMenuItem.getAttribute("data-menu-key");
        if (mid) {
          const activeMt = findMenuItem(menuItems, mid);
          if (activeMt) {
            setActiveMenuItems([
              activeMt.key || "",
              ...findAllParent(menuItems, activeMt),
            ]);
          }
        }
      }
    }
  }, [location.pathname, menuItems]);

  useEffect(() => {
    activeMenu();
  }, [activeMenu]);

  const filteredMenuItems = menuItems.filter((item) => {
    if (!item.key) return true;
    if (userHasFullAccess) return true;
    return hasPermission(item.key, userAccess);
  });

  return (
    <ul className="menu" ref={menuRef} id="main-side-menu">
      {filteredMenuItems.map((item, idx) => {
        return (
          <React.Fragment key={idx}>
            {item.isTitle ? (
              <li
                className={classNames("menu-title", {
                  "mt-2": idx !== 0,
                })}
              >
                {item.label}
              </li>
            ) : (
              <>
                {item.children ? (
                  <MenuItemWithChildren
                    item={item}
                    toggleMenu={toggleMenu}
                    subMenuClassNames="sub-menu"
                    activeMenuItems={activeMenuItems}
                    linkClassName="menu-link"
                    userAccess={userAccess}
                    userHasFullAccess={userHasFullAccess}
                    level={0}
                  />
                ) : (
                  <MenuItem
                    item={item}
                    linkClassName="menu-link"
                    className={
                      activeMenuItems.includes(item.key || "")
                        ? "menuitem-active"
                        : ""
                    }
                    level={0}
                  />
                )}
              </>
            )}
          </React.Fragment>
        );
      })}
    </ul>
  );
};

export default AppMenu;
