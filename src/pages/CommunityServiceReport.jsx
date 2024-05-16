import React from "react";
import '../styles/CommunityServiceReport.css';


const CsReportPageAdmin = () => {
    return (

        <div className="cs-report-page-admin">

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
                
                <h1>COMMUNITY SERVICE REPORT</h1>
              
                <div className="content-container">
        
                    <div className="inputs-container">
                        <div class = "field-container">
                            <input type="text" class = "input-field" name="student-id" placeholder = "STUDENT NAME"/>
                        </div>

                        <div class = "field-container">
                            <input type="text" class = "input-field" name="name" placeholder = "AREA OF COMMUNITY SERVICE"/>
                        </div>                    
                    </div>

                    

                    <table className="offense-table">
                        <thead>
                            <tr>
                                <th>DATE</th>
                                <th>TIME STARTED</th>
                                <th>TIME ENDED</th>
                                <th>HOURS COMPLETED</th>
                                <th>NATURE OF WORK</th>
                                <th>OFFICE</th>
                                <th>STATUS</th>
                                <th>SUPERVISING PERSONNEL</th>
                                <th>ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td><button className="action-button">Action</button></td>
                            </tr>
                            <tr>
                            <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td><button className="action-button">Action</button></td>
                            </tr>
                        </tbody>
                    </table>

                </div>
            </div>
        </div>
    );
};

export default CsReportPageAdmin;
