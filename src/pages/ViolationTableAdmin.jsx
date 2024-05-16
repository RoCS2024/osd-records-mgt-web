import React from "react";
import '../styles/ViolationTableAdmin.css';

const ViolationPageAdmin = () => {
    return (

        <div className="violation-page-admin">

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
                
                <h1>VIOLATION</h1>
              
                <div className="content-container">
        
                    <div className="violation-search-filter">
                        <input type="text" placeholder="Search" className="violation-search-input"/>
                        <input type="date" class = "date-input" id="start-date" name="start-date"/>
                        <p id = "to">to</p>
                        <input type="date" class = "date-input" id="end-date" name="end-date"/>
                
                    </div>

                    <h2>List of Violation</h2>

                    <table className="violation-table">
                        <thead>
                            <tr>
                                <th>STUDENT</th>
                                <th>OFFENSE</th>
                                <th>DATE OF NOTICE</th>
                                <th>NUMBER OF OCCURENCE</th>
                                <th>DISCIPLINARY ACTION</th>
                                <th>COMMUNITY SERVICE HOUR</th>
                                <th>ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>CT21-0047</td>
                                <td>Smoking</td>
                                <td>15/05/2024</td>
                                <td>5</td>
                                <td>Probation</td>
                                <td>4 HOURS</td>
                                <td><button className="action-button">Action</button></td>
                            </tr>
                            <tr>
                                <td>CT21-0048</td>
                                <td>Fighting</td>
                                <td>15/05/2024</td>
                                <td>5</td>
                                <td>Probation</td>
                                <td>4 HOURS</td>
                                <td><button className="action-button">Action</button></td>
                            </tr>
                        </tbody>
                    </table>

                    <div className="violation-btns-container">
                        <button className="create-cs-button">CREATE CS SLIP</button>
                        <button className="add-violation-button">ADD VIOLATION</button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ViolationPageAdmin;
