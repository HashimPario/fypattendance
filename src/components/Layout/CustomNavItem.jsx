import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavItem } from './Sidebar';
import { AiFillCaretDown, AiFillCaretRight } from 'react-icons/ai';

const CustomNavItem = ({ link, onClose }) => {
  let navigate = useNavigate();
  const [showSubMenu, setShowSubMenu] = useState(false);
  useEffect(() => {
    const url = window.location.pathname;
    setShowSubMenu(link?.subMenu?.find((item) => item?.path === url));
  }, []);

  const SubMenuClickHandler = (val) => {
    if (val.path) {
      onClose?.();
      return navigate(val.path);
    }
  };

  const ClickHandler = () => {
    if (link.path) {
      onClose?.();
      return navigate(link.path);
    } else {
      return setShowSubMenu((prev) => !prev);
    }
  };
  return (
    <>
      <NavItem
        onClick={ClickHandler}
        key={link.name}
        icon={link.icon}
        rightIcon={
          link.subMenu && (showSubMenu ? AiFillCaretDown : AiFillCaretRight)
        }
        isActive={window?.location?.pathname === link?.path}
      >
        {link.name}
      </NavItem>
      {showSubMenu &&
        link.subMenu &&
        link.subMenu.map((val) => (
          <NavItem
            sx={{ fontSize: 15, marginLeft: 8 }}
            key={val.name}
            icon={val.icon}
            onClick={() => SubMenuClickHandler(val)}
            isActive={window?.location?.pathname === val?.path}
          >
            {val.name}
          </NavItem>
        ))}
    </>
  );
};

export default CustomNavItem;
