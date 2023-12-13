import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../css/user.css';

const User = () => {
    const [formData, setFormData] = useState({
        reservationId: '',
        firstName: '',
        middleName: '',
        lastName: '',
        serviceType: '',
        schedule: new Date(),
        description: '',
        editor: '',
    });

    const [editorOptions, setEditorOptions] = useState([]);
    const [serviceOptions, setServiceOptions] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/editors')
            .then((response) => response.json())
            .then((data) => setEditorOptions(data))
            .catch((error) => console.error('Error fetching editors:', error));

        fetch('http://localhost:5000/services')
            .then((response) => response.json())
            .then((data) => setServiceOptions(data))
            .catch((error) => console.error('Error fetching services:', error));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleScheduleChange = (date) => {
        setFormData((prevData) => ({ ...prevData, schedule: date }));
    };

    const handleEditorChange = (e) => {
        setFormData((prevData) => ({ ...prevData, editor: e.target.value }));
    };

    const handleSaveToFile = () => {
        const blob = new Blob([formData.reservationId], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'reservation_id.txt';
        link.click();
    };
    
    const handleGenerateId = () => {
        const randomId = Math.floor(1000000000000 + Math.random() * 9000000000000);
        setFormData((prevData) => ({ ...prevData, reservationId: randomId.toString() }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleGenerateId();

        const formattedDate = formData.schedule.toISOString().slice(0, 19).replace('T', ' ');
        fetch('http://localhost:5000/reservations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                reservation_id: formData.reservationId,
                firstName: formData.firstName,
                middleName: formData.middleName,
                lastName: formData.lastName,
                serviceType: formData.serviceType,
                schedule: formattedDate,
                description: formData.description,
                editor: formData.editor,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                setFormData({
                    reservationId: '',
                    firstName: '',
                    middleName: '',
                    lastName: '',
                    serviceType: '',
                    schedule: new Date(),
                    description: '',
                    editor: '',
                });
            })
            .catch((error) => console.error('Error submitting reservation:', error));
    };

    return (
        <div>
            <h2 className='user-head'>FILL RESERVATION</h2>
            <div className="form-container">
                <h3 className='user-container-head'>Reservation Form</h3>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>
                            Reservation ID:
                            <input
                                type="text"
                                name="reservationId"
                                value={formData.reservationId}
                                readOnly
                            />
                            <button type="button" className='generatebtn' onClick={handleGenerateId}>
                                Generate
                            </button>
                            <button type="button" className='copybtn' onClick={handleSaveToFile}>
                                Save
                            </button>
                            <h4> NOTE: Save reservation ID before submitting </h4>
                        </label>
                    </div>
                    <div className="form-group">
                        <label>
                            First Name:
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                            />
                        </label>
                    </div>
                    <div className="form-group">
                        <label>
                            Middle Name:
                            <input
                                type="text"
                                name="middleName"
                                value={formData.middleName}
                                onChange={handleChange}
                                required
                            />
                        </label>
                    </div>
                    <div className="form-group">
                        <label>
                            Last Name:
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                            />
                        </label>
                    </div>
                    <div className="form-group">
                        <label>
                            Service Type:
                            <select
                                name="serviceType"
                                value={formData.serviceType}
                                onChange={handleChange}
                                required
                            >
                                <option value="" disabled>Select Service</option>
                                {serviceOptions.map((service) => (
                                    <option key={service.service_id} value={service.serviceName}>
                                        {service.serviceName}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>
                    <div className="form-group">
                        <label>
                            Enter Schedule:
                            <DatePicker
                                selected={formData.schedule}
                                onChange={handleScheduleChange}
                                showTimeSelect
                                dateFormat="yyyy-MM-dd h:mm aa"
                            />
                        </label>
                    </div>
                    <div className="form-group">
                        <label>
                            Description:
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                            />
                        </label>
                    </div>
                    <div className="form-group">
                        <label>
                            Select Editor:
                            <select
                                name="editor"
                                value={formData.editor}
                                onChange={handleEditorChange}
                                required
                            >
                                <option value="" disabled>Select an editor</option>
                                {editorOptions.map((editor) => (
                                    <option key={editor.editor_id} value={editor.fullName}>
                                        {editor.fullName}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>
                    <button type="submit">Submit Reservation</button>
                </form>
            </div>
        </div>
    );
};

export default User;
