import React, { useState, useEffect } from 'react'
import axios from 'axios';

function Log() {
    const [logs, setLogs] = useState([]);
    useEffect(() => {
        axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASE_URL}/logs/`)
            .then(res => {
                console.log(res.data)
                setLogs(res.data);
            })
            .catch(err => console.log(err));


    }, []);

    return (

        <div style={{ marginTop: '150px' }}>
            <div className='container mt-5' >
                <table className='table table-striped'>
                    <thead className='thead-dark'>
                        <tr>
                            <th>ID</th>
                            <th>Mesaj</th>
                            <th>Makale ID</th>
                            <th>Tarih</th>
                        </tr>
                    </thead>
                    <tbody>

                        {logs.map((log) => (
                            <tr key={log._id}>
                                <td>{log._id}</td>
                                <td>{log.message}</td>
                                <td>{log.trackingId}</td>
                                <td>{log.date}</td>
                            </tr>
                        ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Log