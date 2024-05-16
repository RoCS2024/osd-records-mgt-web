import React from "react";
import '../styles/offenseTableAdmin.css';

const OffensePageAdmin = () => {
    return (

        <div className="offense-page-admin">

            <nav className="navbar">

            <img src="../Assets/logo_new.png" alt="Logo" className="logo"/>

                <div className="nav-links">
                    <a href="#">Offense</a>
                    <a href="#">Violation</a>
                    <a href="#">Reports</a>
                    <a href="#">Logout</a>
                </div>

            </nav>

            <div className="container">
                
                <h1>OFFENSE</h1>
              
                <div className="content-container">
        
                    <div className="offense-search-filter">
                        <input type="text" placeholder="Search" className="offense-search-input"/>
                        <select className="filter-button">
                            <option disabled selected>Filter Type</option>
                            <option>All</option>
                            <option>Major</option>
                            <option>Minor</option>
                        </select>
                    </div>

                    <table className="offense-table">
                        <thead>
                            <tr>
                                <th>Offense</th>
                                <th>Type</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Smoking</td>
                                <td>Major</td>
                                <td><button className="action-button">Action</button></td>
                            </tr>
                            <tr>
                                <td>Fighting</td>
                                <td>Major</td>
                                <td><button className="action-button">Action</button></td>
                            </tr>
                        </tbody>
                    </table>

                    <div className="btns">
                        <button className="add-offense-button">ADD OFFENSE</button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default OffensePageAdmin;
