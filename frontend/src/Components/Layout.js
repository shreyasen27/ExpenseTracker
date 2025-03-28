import React from "react";
import "antd/dist/antd.min.css"
import { Menu, Dropdown} from "antd";
import {useNavigate} from 'react-router-dom'
import "../styles/layout.css";

function Layout(props) {
  const user = JSON.parse(localStorage.getItem("expense-tracker"));
  const navigate = useNavigate()
  const menu = (
    <Menu
      items={[
        {
          label: (
            <li onClick={()=>{
              localStorage.removeItem('expense-tracker')
              navigate("/login");
            }}>Logout</li>
          ),
        }
      ]}
    />
  );
  return (
    <div className="layout">
      <div className="header d-flex justify-content-between align-items-center">
        <div>
          <h1 className="logo">EXPENSE TRACKER</h1>
        </div>
        <div>
          <Dropdown overlay={menu} placement="bottomLeft">
            <button className='primary'>{user.name}</button>
          </Dropdown>
        </div>
      </div>
      
      <div className="content">{props.children}</div>
    </div>
  );
}

export default Layout;