import React from 'react';
import edit from '../assets/compose.png';

const TableOffenseAdmin = ({ offenses, onEdit }) => {
    return (
        <table className="offense-table-container">
            <thead>
                <tr>
                    <th className='name-column'>OFFENSE</th>
                    <th className='type-column'>TYPE</th>
                    <th className='action-column'>ACTION</th>
                </tr>
            </thead>
            <tbody>
                {offenses.map(offense => (
                    <tr key={offense.id}>
                        <td className='name-column'>{offense.description}</td>
                        <td className='type-column'>{offense.type}</td>

                        <td className='action-column'>

                            <button className="edit-button" onClick={() => onEdit(offense)}>
                                <img src={edit} alt="Edit" className="edit-icon"/>
                            </button>

                        </td>
                    </tr>
                ))}
                {offenses.length === 0 && (
                    <tr>
                        <td colSpan="3">No Results Found.</td>
                    </tr>
                )}
            </tbody>
        </table>
    );
};

export default TableOffenseAdmin;
