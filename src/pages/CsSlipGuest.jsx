import React from "react";
import '../styles/CsSlipGuest.css';

const CsSlipGuest = () => {
    return (

        <div className="csreport-student">

            <nav className="navbar">

            <img src="../Assets/logo_new.png" alt="Logo" className="logo"/>

                <div className="nav-links">
                    <a href="#">Violation</a>
                    <a href="#">Reports</a>
                    <a href="#">Logout</a>
                </div>

            </nav>

            <div className="container">
                
                <h1>LIST OF COMMUNITY SERVICE SLIP</h1>
              
                <div className="content-container">
        
                    <table className="my-violation-table">
                        <thead>
                            <tr>
                                <th>STUDENT NAME</th>
                                <th>AREA OF COMMUNITY SERVICE</th>
                                <th>ACTION</th>
        
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                
                                <td></td>
                                <td></td>
                                <td><button className="action-button">View</button></td>
                            
                            </tr>
                            <tr>
            
                                <td></td>
                                <td></td>
                                <td><button className="action-button">View</button></td>
                               
                            </tr>
                        </tbody>
                    </table>

                </div>
                    <div className="table2-container">
                        <h2>COMMUNITY SERVICE REPORT</h2>
                            <table className= "student-cs-report-table">
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
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
        </div>
    );
};

export default CsSlipGuest;
