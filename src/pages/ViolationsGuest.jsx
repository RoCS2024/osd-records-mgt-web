import React from "react";
import '../styles/ViolationGuest.css';

const ViolationGuest = () => {
    return (

        <div className="violation-student">

            <nav className="navbar">

            <img src="../Assets/logo_new.png" alt="Logo" className="logo"/>

                <div className="nav-links">
                    <a href="#">Offense</a>
                    <a href="#">Reports</a>
                    <a href="#">Logout</a>
                </div>

            </nav>

            <div className="container">
                
                <h1>VIOLATIONS</h1>
              
                <div className="content-container">
        
                    <div className="date-filter">
                        <input type="date" class = "date-input" id="start-date" name="start-date"/>
                        <p id = "to">to</p>
                        <input type="date" class = "date-input" id="end-date" name="end-date"/>
                        <select className="beneficiary-button">
                            <option disabled selected>Beneficiary</option>
                            <option>student1</option>
                            <option>student2</option>
                            <option>student3</option>
                        </select>
                    </div>

                    <table className="my-violation-table">
                        <thead>
                            <tr>
                                <th>STUDENT</th>
                                <th>OFFENSE</th>
                                <th>DATE OF NOTICE</th>
                                <th>NUMBER OF OCCURENCE</th>
                                <th>DISCIPLINARY ACTION</th>
                                <th>COMMUNITY SERVICE HOUR</th>
        
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
                                
                            </tr>
                            <tr>
                                <td>CT21-0048</td>
                                <td>Fighting</td>
                                <td>15/05/2024</td>
                                <td>5</td>
                                <td>Probation</td>
                                <td>4 HOURS</td>
                               
                            </tr>
                        </tbody>
                    </table>



                </div>
            </div>
        </div>
    );
};

export default ViolationGuest;
