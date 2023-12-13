import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { reservationSchema } from '../validation/validationSchema.js';
import '../css/user.css';

const User = () => {
    const editorEndpoint = 'https://ads-booking-service.onrender.com/editors';
    const serviceEndpoint = 'https://ads-booking-service.onrender.com/services';

    const [editorOptions, setEditorOptions] = useState([]);
    const [serviceOptions, setServiceOptions] = useState([]);

    useEffect(() => {
        fetch(editorEndpoint)
            .then((response) => response.json())
            .then((data) => setEditorOptions(data))
            .catch((error) => console.error('Error fetching editors:', error));

        fetch(serviceEndpoint)
            .then((response) => response.json())
            .then((data) => setServiceOptions(data))
            .catch((error) => console.error('Error fetching services:', error));
    }, []);

    const formik = useFormik({
        initialValues: {
            reservationId: '',
            firstName: '',
            middleName: '',
            lastName: '',
            serviceType: '',
            schedule: new Date(),
            description: '',
            editor: '',
        },
        validationSchema: reservationSchema,  // Use the imported schema here
        onSubmit: (values) => {
            handleGenerateId();

            const formattedDate = values.schedule.toISOString().slice(0, 19).replace('T', ' ');
            fetch('https://ads-booking-service.onrender.com/reservations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    reservation_id: values.reservationId,
                    firstName: values.firstName,
                    middleName: values.middleName,
                    lastName: values.lastName,
                    serviceType: values.serviceType,
                    schedule: formattedDate,
                    description: values.description,
                    editor: values.editor,
                }),
            })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                formik.resetForm();
            })
            .catch((error) => console.error('Error submitting reservation:', error));
        },
    });

    const handleChange = (e) => {
        formik.handleChange(e);
    };

    const handleScheduleChange = (date) => {
        formik.setFieldValue('schedule', date);
    };

    const handleEditorChange = (e) => {
        formik.handleChange(e);
    };

    const handleSaveToFile = () => {
        const blob = new Blob([formik.values.reservationId], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'reservation_id.txt';
        link.click();
    };

    const handleGenerateId = () => {
        const randomId = Math.floor(1000000000000 + Math.random() * 9000000000000);
        formik.setFieldValue('reservationId', randomId.toString());
    };

    return (
        <div>
            <h2 className='user-head'>FILL RESERVATION</h2>
            <div className="form-container">
                <h3 className='user-container-head'>Reservation Form</h3>
                <form onSubmit={formik.handleSubmit}>
                    <div className="form-group">
                        <label>
                            Reservation ID:
                            <input
                                type="text"
                                name="reservationId"
                                value={formik.values.reservationId}
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
                        {formik.touched.reservationId && formik.errors.reservationId ? (
                            <div className="error">{formik.errors.reservationId}</div>
                        ) : null}
                    </div>
                    <div className="form-group">
                        <label>
                            First Name:
                            <input
                                type="text"
                                name="firstName"
                                value={formik.values.firstName}
                                onChange={handleChange}
                                required
                            />
                            {formik.touched.firstName && formik.errors.firstName ? (
                                <div className="error">{formik.errors.firstName}</div>
                            ) : null}
                        </label>
                    </div>
                    <div className="form-group">
                        <label>
                            Middle Name:
                            <input
                                type="text"
                                name="middleName"
                                value={formik.values.middleName}
                                onChange={handleChange}
                                required
                            />
                            {formik.touched.middleName && formik.errors.middleName ? (
                                <div className="error">{formik.errors.middleName}</div>
                            ) : null}
                        </label>
                    </div>
                    <div className="form-group">
                        <label>
                            Last Name:
                            <input
                                type="text"
                                name="lastName"
                                value={formik.values.lastName}
                                onChange={handleChange}
                                required
                            />
                            {formik.touched.lastName && formik.errors.lastName ? (
                                <div className="error">{formik.errors.lastName}</div>
                            ) : null}
                        </label>
                    </div>
                    <div className="form-group">
                        <label>
                            Service Type:
                            <select
                                name="serviceType"
                                value={formik.values.serviceType}
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
                            {formik.touched.serviceType && formik.errors.serviceType ? (
                                <div className="error">{formik.errors.serviceType}</div>
                            ) : null}
                        </label>
                    </div>
                    <div className="form-group">
                        <label>
                            Enter Schedule:
                            <DatePicker
                                selected={formik.values.schedule}
                                onChange={handleScheduleChange}
                                showTimeSelect
                                dateFormat="yyyy-MM-dd h:mm aa"
                            />
                            {formik.touched.schedule && formik.errors.schedule ? (
                                <div className="error">{formik.errors.schedule}</div>
                            ) : null}
                        </label>
                    </div>
                    <div className="form-group">
                        <label>
                            Description:
                            <textarea
                                name="description"
                                value={formik.values.description}
                                onChange={handleChange}
                                required
                            />
                            {formik.touched.description && formik.errors.description ? (
                                <div className="error">{formik.errors.description}</div>
                            ) : null}
                        </label>
                    </div>
                    <div className="form-group">
                        <label>
                            Select Editor:
                            <select
                                name="editor"
                                value={formik.values.editor}
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
                            {formik.touched.editor && formik.errors.editor ? (
                                <div className="error">{formik.errors.editor}</div>
                            ) : null}
                        </label>
                    </div>
                    <button type="submit">Submit Reservation</button>
                </form>
            </div>
        </div>
    );
};

export default User;
