import React from "react";
import '../styles/CommunityServiceSlip.css';




const CsSlipPageAdmin = () => {
    return (

        <div className="cs-slip-page-admin">

            <nav className="navbar">

            <img src="../Assets/logo_new.png" alt="Logo" className="logo"/>

                <div className="nav-links">
                    <a href="#">Offense</a>
                    <a href="#">Violation</a>
                    <a href="#">Reports</a>
                    <a href="#">Logout</a>
                </div>

            </nav>

            <div className="csSlipcontainer">
                
                <h1>COMMUNITY SERVICE SLIP</h1>
              
                <div className="cs-slip-container">

                    <div className="input-container">
                        <div class = "field-container">
                            <label>Student ID:</label>
                            <input type="text" class = "input-field" name="student-id"/>
                        </div>

                        <div class = "field-container">
                            <label>Full Name:</label>
                            <input type="text" class = "input-field" name="name"/>
                        </div>

                        <div class = "field-container">
                            <label>Section:</label>
                            <input type="text" class = "input-field" name="section"/>
                        </div>

                        <div class = "field-container">
                            <label>Cluster Head:</label>
                            <input type="text" class = "input-field" name="head"/>
                        </div>

                        <div class = "field-container">
                            <label>Hours to deduct:</label>
                            <input type="text" class = "input-field" name="deduction"/>
                        </div>

                        <div class = "field-container">
                            <label>Area of Community Service:</label>
                            <input type="text" class = "input-field" name="area"/>
                        </div>
                    </div>
        
                    <table className="cs-slip-table">
                        <thead>
                            <tr>
                                <th>STUDENT</th>
                                <th>OFFENSE</th>
                                <th>CS HOURS</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>CT21-0048</td>
                                <td>Fighting</td>
                                <td>4 Hours</td>
                            </tr>
                            <tr>
                                <td>CT21-0048</td>
                                <td>Fighting</td>
                                <td>4 Hours</td>
                            </tr>
                        </tbody>
                    </table>

                    <div className="bottom-container">
                        <div class = "total-container">
                            <label>Total Hours Required: </label>
                            <input type="text" class = "input-hours" name="hours-required"/>
                        </div>
                        <button className="create-button">CREATE</button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default CsSlipPageAdmin;
