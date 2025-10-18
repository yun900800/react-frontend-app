import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Breadcrumb.module.css'; 
const Breadcrumb = ({ links }) => {
  return (
    <>
      <ul className={styles['sidebar-nav']}>
        {links.map((link, index) => (
          <li key={index}>
            <Link to={link.path}>{link.label}</Link>
          </li>
        ))}
        <li>
          <Logout />
        </li>
      </ul>
    </>
  );
};

const Logout = () => {
  return (
    <a onClick={() => {}}>退出</a>
  )
}

export default Breadcrumb;