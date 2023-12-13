import * as Yup from 'yup';

export const reservationSchema = Yup.object().shape({
    reservationId: Yup.string().required('Reservation ID is required, Click Generate and Save'),
    firstName: Yup.string().required('First Name is required'),
    middleName: Yup.string().required('Middle Name is required'),
    lastName: Yup.string().required('Last Name is required'),
    serviceType: Yup.string().required('Service Type is required'),
    schedule: Yup.date().required('Schedule is required'),
    description: Yup.string().required('Description is required'),
    editor: Yup.string().required('Editor is required'),
});