import React, { useState, useEffect } from 'react';
import '../css/adminDashboard.css';

const ApprovedReservationsContent = () => {
  const [approvedReservations, setApprovedReservations] = useState([]);

  useEffect(() => {
    fetch('https://ads-booking-service.onrender.com/approved')
      .then((response) => response.json())
      .then((data) => {
        setApprovedReservations(data);
      })
      .catch((error) => console.error('Error fetching approved reservations:', error));
  }, []);

  const handleDone = (reservationId) => {
    updateStatus(reservationId, 'Done');
  };

  const handleCancel = (reservationId) => {
    updateStatus(reservationId, 'Cancelled');
  };

  const updateStatus = (reservationId, status) => {
    fetch(`https://ads-booking-service.onrender.com/reservations/${reservationId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: status,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log(`Reservation ${reservationId} updated to ${status}`);
        setApprovedReservations((prevReservations) =>
          prevReservations.map((reservation) =>
            reservation.reservation_id === reservationId
              ? { ...reservation, status: status }
              : reservation
          )
        );
      })
      .catch((error) => console.error(`Error updating reservation ${reservationId}:`, error));
  };

  return (
    <div>
      <h3>Approved Reservations</h3>
      <table>
        <thead>
          <tr>
            <th>Reservation ID</th>
            <th>First Name</th>
            <th>Middle Name</th>
            <th>Last Name</th>
            <th>Service Type</th>
            <th>Schedule</th>
            <th>Description</th>
            <th>Editor</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {approvedReservations.map((reservation) => (
            <tr key={reservation.reservation_id}>
              <td>{reservation.reservation_id}</td>
              <td>{reservation.firstName}</td>
              <td>{reservation.middleName}</td>
              <td>{reservation.lastName}</td>
              <td>{reservation.serviceType}</td>
              <td>{new Date(reservation.schedule).toLocaleString()}</td>
              <td>{reservation.description}</td>
              <td>{reservation.editor}</td>
              <td>{reservation.status}</td>
              <td>
                <button className="done-button" onClick={() => handleDone(reservation.reservation_id)}>Done</button>
                <button className="cancel-button" onClick={() => handleCancel(reservation.reservation_id)}>Cancel</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const ReservationManagementContent = () => {
  const [reservations, setReservations] = useState([]);
  const [approvedMessage, setApprovedMessage] = useState(null);

  useEffect(() => {
    fetch('https://ads-booking-service.onrender.com/reservations')
      .then((response) => response.json())
      .then((data) => {
        setReservations(data);
      })
      .catch((error) => console.error('Error fetching reservations:', error));
  }, []);

  const handleApprove = (reservationId) => {
    fetch(`https://ads-booking-service.onrender.com/reservations/${reservationId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: 'Approved',
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log(`Reservation ${reservationId} approved`);
        window.alert(`Reservation ${reservationId} approved`);

        setReservations((prevReservations) =>
          prevReservations.map((reservation) =>
            reservation.reservation_id === reservationId
              ? { ...reservation, status: 'Approved' }
              : reservation
          )
        );
      })
      .catch((error) => console.error(`Error approving reservation ${reservationId}:`, error));
  };

  const showDeleteConfirmation = (reservationId) => {
    return window.confirm(`Are you sure you want to delete Reservation ${reservationId}?`);
  };

  const handleDelete = (reservationId) => {
    if (showDeleteConfirmation(reservationId)) {
      fetch(`https://ads-booking-service.onrender.com/reservations/${reservationId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log(`Reservation ${reservationId} deleted`);
          window.alert(`Reservation ${reservationId} deleted`);

          setReservations((prevReservations) =>
            prevReservations.filter((reservation) => reservation.reservation_id !== reservationId)
          );
        })
        .catch((error) => console.error(`Error deleting reservation ${reservationId}:`, error));
    }
  };

  return (
    <div>
      <h3>Reservation Management</h3>
      <table>
        <thead>
          <tr>
            <th>Reservation ID</th>
            <th>First Name</th>
            <th>Middle Name</th>
            <th>Last Name</th>
            <th>Service Type</th>
            <th>Schedule</th>
            <th>Description</th>
            <th>Editor</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((reservation) => (
            <tr key={reservation.reservation_id}>
              <td>{reservation.reservation_id}</td>
              <td>{reservation.firstName}</td>
              <td>{reservation.middleName}</td>
              <td>{reservation.lastName}</td>
              <td>{reservation.serviceType}</td>
              <td>{new Date(reservation.schedule).toLocaleString()}</td>
              <td>{reservation.description}</td>
              <td>{reservation.editor}</td>
              <td>{reservation.status}</td>
              <td>
                <button className="approve-button" onClick={() => handleApprove(reservation.reservation_id)}>Approve</button>
                <button className="delete-button" onClick={() => handleDelete(reservation.reservation_id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

/* Show Reservations History Tab */
const ReservationHistoryContent = () => {
  const [reservations, setReservations] = useState([]);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetch('https://ads-booking-service.onrender.com/reservations')
      .then((response) => response.json())
      .then((data) => {
        setReservations(data);
      })
      .catch((error) => console.error('Error fetching reservations:', error));
  }, []);

  const filteredReservations = reservations.filter((reservation) => {
    if (filter === 'All') {
      return true; 
    } else {
      return reservation.status === filter;
    }
  });

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  return (
    <div>
      <h3>Reservation History</h3>
      <div className="filter">
        <label className="filter-label">Filter by Status:</label>
        <select value={filter} onChange={handleFilterChange}>
          <option value="All">All</option>
          <option value="Done">Done</option>
          <option value="Cancelled">Cancelled</option>
          <option value="Approved">Approved</option>
          <option value="Pending">Pending</option>
        </select>
      </div>
      <table>
        <thead>
          <tr>
            <th>Reservation ID</th>
            <th>First Name</th>
            <th>Middle Name</th>
            <th>Last Name</th>
            <th>Service Type</th>
            <th>Schedule</th>
            <th>Description</th>
            <th>Editor</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredReservations.map((reservation) => (
            <tr key={reservation.reservation_id}>
              <td>{reservation.reservation_id}</td>
              <td>{reservation.firstName}</td>
              <td>{reservation.middleName}</td>
              <td>{reservation.lastName}</td>
              <td>{reservation.serviceType}</td>
              <td>{new Date(reservation.schedule).toLocaleString()}</td>
              <td>{reservation.description}</td>
              <td>{reservation.editor}</td>
              <td>{reservation.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const ManageEditorsContent = () => {
  const [editors, setEditors] = useState([]);
  const [fullName, setFullName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    fetch('https://ads-booking-service.onrender.com/editors')
      .then((response) => response.json())
      .then((data) => {
        setEditors(data);
      })
      .catch((error) => console.error('Error fetching editors:', error));
  }, []);

  const handleAddEditor = () => {
    const newEditor = {
      fullname: fullName,
      contact: contactNumber,
      address: address,
    };

    fetch('https://ads-booking-service.onrender.com/editors', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newEditor),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(() => {
        fetch('https://ads-booking-service.onrender.com/editors')
          .then((response) => response.json())
          .then((data) => {
            setEditors(data);
          })
          .catch((error) => {
            console.error('Error fetching editors:', error);
          });
      })
      .catch((error) => {
        console.error('Error adding new editor:', error);
      })
      .finally(() => {
        setFullName('');
        setContactNumber('');
        setAddress('');
      });
  };

  const handleRemoveEditor = (editorId) => {
    fetch(`https://ads-booking-service.onrender.com/editors/${editorId}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
      })
      .then(() => {
        setEditors((prevEditors) => prevEditors.filter((editor) => editor.editor_id !== editorId));
      })
      .catch((error) => console.error('Error removing editor:', error));
  };

  return (
    <div>
      <h3>Manage Editors</h3>
      <div className="editor-container">
        <h4>Add New Editor</h4>
        <div>
          <label>Full Name:</label>
          <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} />
        </div>
        <div>
          <label>Contact Number:</label>
          <input type="text" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} />
        </div>
        <div>
          <label>Address:</label>
          <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
        </div>
        <button onClick={handleAddEditor}>Add Editor</button>
      </div>
      <div>
        <h4>Editor List</h4>
        <table>
          <thead>
            <tr>
              <th>Editor ID</th>
              <th>Full Name</th>
              <th>Contact Number</th>
              <th>Address</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {editors.map((editor) => (
              <tr key={editor.editor_id}>
                <td>{editor.editor_id}</td>
                <td>{editor.fullName}</td>
                <td>{editor.contact}</td>
                <td>{editor.address}</td>
                <td>
                  <button className="remove-button" onClick={() => handleRemoveEditor(editor.editor_id)}>
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};


const ManageServicesContent = () => {
  const [services, setServices] = useState([]);
  const [serviceName, setServiceName] = useState('');

  useEffect(() => {
    fetch('https://ads-booking-service.onrender.com/services')
      .then((response) => response.json())
      .then((data) => {
        setServices(data);
      })
      .catch((error) => console.error('Error fetching services:', error));
  }, []);

  const handleAddService = () => {
    fetch('https://ads-booking-service.onrender.com/services', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        serviceName: serviceName,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(() => {
        // Fetch the updated list of services from the server
        fetch('https://ads-booking-service.onrender.com/services')
          .then((response) => response.json())
          .then((data) => {
            // Set the state with the updated list of services
            setServices(data);
          })
          .catch((error) => console.error('Error fetching services:', error));
      })
      .catch((error) => console.error('Error adding new service:', error));
  
    setServiceName('');
  };

  const handleRemoveService = (serviceId) => {
    fetch(`https://ads-booking-service.onrender.com/services/${serviceId}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
      })
      .then(() => {
        setServices((prevServices) => prevServices.filter((service) => service.service_id !== serviceId));
      })
      .catch((error) => console.error('Error removing service:', error));
  };

  return (
    <div>
      <h3>Manage Services</h3>
      <div className="services-container">
        <h4>Add New Service</h4>
        <div>
          <label>Service Name:</label>
          <input type="text" value={serviceName} onChange={(e) => setServiceName(e.target.value)} />
        </div>
        <button onClick={handleAddService}>Add Service</button>
      </div>
      <div>
        <h4>Service List</h4>
        <table>
          <thead>
            <tr>
              <th>Service ID</th>
              <th>Service Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr key={service.service_id}>
                <td>{service.service_id}</td>
                <td>{service.serviceName}</td>
                <td>
                  <button className = "remove-button" onClick={() => handleRemoveService(service.service_id)}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('user');

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'user':
        return <ApprovedReservationsContent />;
      case 'reservation':
        return <ReservationManagementContent />;
      case 'history':
        return <ReservationHistoryContent />;
      case 'editors':
        return <ManageEditorsContent />;
      case 'services':
        return <ManageServicesContent/>;
      default:
        return null;
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-sidebar">
        <div className={`tab ${activeTab === 'user' && 'active'}`} onClick={() => handleTabClick('user')}>
          Approved Reservations
        </div>
        <div className={`tab ${activeTab === 'reservation' && 'active'}`} onClick={() => handleTabClick('reservation')}>
          Manage Reservations
        </div>
        <div className={`tab ${activeTab === 'history' && 'active'}`} onClick={() => handleTabClick('history')}>
          Reservation History
        </div>
        <div className={`tab ${activeTab === 'editors' && 'active'}`} onClick={() => handleTabClick('editors')}>
          Manage Editors
        </div>
        <div className={`tab ${activeTab === 'services' && 'active'}`} onClick={() => handleTabClick('services')}>
          Manage Services
        </div>
      </div>
      <div className="content">
        <h2>Admin Dashboard</h2>
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminDashboard;
