import React, { useEffect, useRef, useState, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { Collapse } from "react-bootstrap";
import classNames from "classnames";
import FeatherIcon from "feather-icons-react";


import { findAllParent, findMenuItem } from "../helpers/menu";


import { MenuItemTypes } from "../constants/menu";
import { getAccessDetailsFromLocalStorage } from "../helpers/api/utils";

interface SubMenus {
  item: MenuItemTypes;
  linkClassName?: string;
  subMenuClassNames?: string;
  activeMenuItems?: string[];
  toggleMenu?: (item: MenuItemTypes, status: boolean) => void;
  className?: string;
}

const MenuItemWithChildren = ({
  item,
  linkClassName,
  subMenuClassNames,
  activeMenuItems = [],
  toggleMenu,
}: SubMenus) => {
  const [open, setOpen] = useState<boolean>(activeMenuItems.includes(item.key));
  const accessDetails = getAccessDetailsFromLocalStorage();
  const userRole = accessDetails?.role || "";

  useEffect(() => {
    setOpen(activeMenuItems.includes(item.key));
  }, [activeMenuItems, item]);

  const toggleMenuItem = (e: React.MouseEvent) => {
    e.preventDefault();
    const status = !open;
    setOpen(status);
    if (toggleMenu) toggleMenu(item, status);
    return false;
  };
  const accessibleChildren = (item.children || []).filter((child) => {
    if (!child.access) return true;
    return child.access.includes(userRole);
  });

  if (accessibleChildren.length === 0) return null;

  return (
    <li className={classNames("menu-item ps-3", { "menuitem-active": open })}>
      <Link
        to="#"
        onClick={toggleMenuItem}
        data-menu-key={item.key}
        aria-expanded={open}
        className={classNames("menu-link", linkClassName, {
          active: activeMenuItems.includes(item.key),
        })}
      >
        {item.icon && (
          <span className="menu-icon">
            <FeatherIcon icon={item.icon} />{" "}
          </span>
        )}
        <span className="menu-text"> {item.label} </span>
        {!item.badge ? (
          <span className="menu-arrow"></span>
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
                        activeMenuItems.includes(child.key) ? "active" : ""
                      }
                      activeMenuItems={activeMenuItems}
                      subMenuClassNames="sub-menu"
                      toggleMenu={toggleMenu}
                    />
                  ) : (
                    <MenuItem
                      item={child}
                      className={
                        activeMenuItems.includes(child.key)
                          ? "menuitem-active"
                          : ""
                      }
                      linkClassName={
                        activeMenuItems.includes(child.key) ? "active" : ""
                      }
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

const MenuItem = ({ item, className, linkClassName }: SubMenus) => {
  const accessDetails = getAccessDetailsFromLocalStorage();
  const userRole = accessDetails?.role || "";

  if (item.access && !item.access.includes(userRole)) {
    return null;
  }

  return (
    <li className={classNames("menu-item", className)}>
      <MenuItemLink item={item} className={linkClassName} />
    </li>
  );
};

const MenuItemLink = ({ item, className }: SubMenus) => {
  return (
    <Link
      to={item.url!}
      target={item.target}
      className={classNames("side-nav-link-ref menu-link", className)}
      data-menu-key={item.key}
    >
      {item.icon && (
        <span className="menu-icon">
          <FeatherIcon icon={item.icon} />{" "}
        </span>
      )}
      <span className="menu-text"> {item.label} </span>
      {item.badge && (
        <span className={`badge bg-${item.badge.variant}`}>
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
  const accessDetails = getAccessDetailsFromLocalStorage();
  const [activeMenuItems, setActiveMenuItems] = useState<string[]>([]);
  const userRole = accessDetails?.role || "";

  const toggleMenu = useCallback((menuItem: MenuItemTypes, show: boolean) => {
    if (show) {
      setActiveMenuItems((prev) => [
        ...new Set([menuItem.key, ...findAllParent(menuItems, menuItem), ...prev]),
      ]);
    } else {
      setActiveMenuItems((prev) => prev.filter((item) => item !== menuItem.key));
    }
  }, [menuItems]);

  const activeMenu = useCallback(() => {
    const div = document.getElementById("main-side-menu");
    let matchingMenuItem: HTMLAnchorElement | null = null;

    if (div) {
      const items = div.getElementsByClassName("side-nav-link-ref");
      
      for (let i = 0; i < items.length; i++) {
        const item = items[i] as HTMLAnchorElement;
        const trimmedURL = location.pathname.replace(process.env.PUBLIC_URL || "", "");
        const itemPath = new URL(item.href, window.location.origin).pathname.replace(
          process.env.PUBLIC_URL || "",
          ""
        );

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
              activeMt.key,
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
    if (!item.access) return true;
    return item.access.includes(userRole);
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
                  />
                ) : (
                  <MenuItem
                    item={item}
                    linkClassName="menu-link"
                    className={
                      activeMenuItems.includes(item.key)
                        ? "menuitem-active"
                        : ""
                    }
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