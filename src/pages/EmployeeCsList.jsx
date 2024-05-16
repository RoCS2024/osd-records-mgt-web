import React from "react";
import '../styles/EmployeeCsList.css';


const EmployeeCsList = () => {
    return (

        <div className="list-cs-page-admin">

            <nav className="navbar">

            <img src="../Assets/logo_new.png" alt="Logo" className="logo"/>

                <div className="nav-links">
                    <a href="#">Reports</a>
                    <a href="#">Logout</a>
                </div>

            </nav>

            <div className="container">
                
                <h1>Community Service Reports</h1>
              
                <div className="content-container">
        
                    <table className="offense-table">
                        <thead>
                            <tr>
                                <th>STUDENT ID</th>
                                <th>STUDENT NAME</th>
                                <th>AREA OF COMMUNITY SERVICE</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>CT21-0047</td>
                                <td>Harold</td>
                                <td>Canteen</td>
                            </tr>
                            <tr>
                                <td>CT21-0048</td>
                                <td>Zhaira</td>
                                <td>Library</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default EmployeeCsList;
