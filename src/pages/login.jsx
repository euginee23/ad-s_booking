import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import '../css/login.css';



const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    adminUsername: '',
    adminPassword: '',
    reservationId: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);

    try {
      const response = await fetch('https://ads-booking-service.onrender.com/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Login successful. Token:', data.token);
        navigate('/admin');
      } else {
        let errorData;
        try {
          errorData = await response.json();
        } catch (jsonError) {
          errorData = { message: response.statusText };
        }
        console.error('Login failed:', errorData.message);
        window.alert('Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      window.alert('An unexpected error occurred during login.');
    }
  };

  const handleCheckReservation = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch(`https://ads-booking-service.onrender.com/checkReservation/${formData.reservationId}`);
  
      if (response.ok) {
        const data = await response.json();
        console.log('Reservation check result:', data);
  
        if (data.isValid) {
          if (data.reservation.status === 'Approved') {
            alert('Reservation is approved. Approach to the shop.');
          } else if (data.reservation.status === 'Pending') {
            alert('Reservation is still pending. Try checking again later.');
          } else {
            alert(`Reservation status: ${data.reservation.status}`);
          }
        } else {
          alert('Invalid Reservation ID. Please check and try again.');
        }
      } else {
        const errorData = await response.json();
        console.error('Reservation check failed:', errorData.message);
        alert('Error checking reservation. Please try again.');
      }
    } catch (error) {
      console.error('Invalid reservation check:', error);
      alert('An unexpected error occurred during reservation check.');
    }
  };
  
  return (
    <div className="home-container">
      <h3 className="sub-head">AD's PRINTING SHOP</h3>
      <h2 className="head">Online Booking Reservation</h2>
      <div className="admin-login-section">
        <h3 className="head">Admin Login</h3>
        <form onSubmit={handleLoginSubmit}>
          <label>
            Username:
            <input type="text" name="username" onChange={handleInputChange} />
          </label>
          <br />
          <label>
            Password:
            <input type="password" name="password" onChange={handleInputChange} />
          </label>
          <br />
          <button className="submit-button" type="submit">
            Login
          </button>
        </form>
      </div>
      <div className="user-reservation-section">
        <h3 className='head'>Book a reservation here</h3>
        <Link to="/user" className="book-button-link">
          <button className="book-button">Book Now!</button>
        </Link>
      </div>
      <div className="check-reservation-section">
      <h3 className='head'>Already booked a reservation? Check it here</h3>
      <label>
        Reservation ID:
        <input
          type="text"
          name="reservationId"
          value={formData.reservationId}
          onChange={handleInputChange}
        />
      </label>
      <button className="check-button" onClick={handleCheckReservation}>
        Check Reservation
      </button>
    </div>
    </div>
  );
};

export default Login;
