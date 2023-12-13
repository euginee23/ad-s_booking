const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const pool = require('./db');
const app = express();

app.use(cors());
app.use(bodyParser.json());

// Starting route
app.get('/', (_req, res) => {
  res.send('HELLO SERVER');
});

//Log in
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  console.log('Received login request:', { username, password });

  const userQuery = 'SELECT * FROM admin WHERE username = ? AND password = ?';
  pool.query(userQuery, [username, password], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
      return;
    }

    if (results.length === 0) {
      res.status(401).send('Invalid username or password');
    } else {
      res.json({ message: 'Login successful' });
    }
  });
});

//Show Reservations
app.get('/reservations', (_req, res) => {
  pool.query('SELECT * FROM reservation', (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    } else {
      res.json(results);
    }
  });
});

//Get Reservation by ID
app.get('/reservations/:id', (req, res) => {
  const { id } = req.params;
  pool.query('SELECT * FROM reservation WHERE reservation_id = ?', [id], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    } else if (results.length === 0) {
      res.status(404).send('Reservation not found');
    } else {
      res.json(results[0]);
    }
  });
});

//Get Approved Reservation by Status
app.get('/approved', (_req, res) => {
  pool.query('SELECT * FROM reservation WHERE status = "Approved"', (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    } else {
      res.json(results);
    }
  });
});

//Update Reservation Status
app.put('/reservations/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const sql = 'UPDATE reservation SET status = ? WHERE reservation_id = ?';
  const values = [status, id];

  pool.query(sql, values, (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    } else if (results.affectedRows === 0) {
      res.status(404).send('Reservation not found');
    } else {
      res.json({ message: 'Reservation updated successfully' });
    }
  });
});

//Delete Reservation by ID
app.delete('/reservations/:id', (req, res) => {
  const { id } = req.params;

  pool.query('DELETE FROM reservation WHERE reservation_id = ?', [id], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    } else if (results.affectedRows === 0) {
      res.status(404).send('Reservation not found');
    } else {
      res.json({ message: 'Reservation deleted successfully' });
    }
  });
});

//Add a new Reservation
app.post('/reservations', (req, res) => {
  const { reservation_id, firstName, middleName, lastName, serviceType, schedule, description, editor } = req.body;
  const sql = 'INSERT INTO reservation (reservation_id, firstName, middleName, lastName, serviceType, schedule, description, editor) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
  const values = [reservation_id, firstName, middleName, lastName, serviceType, schedule, description, editor];

  pool.query(sql, values, (error, _results) => {
    if (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    } else {
      res.json({ message: 'Reservation created successfully', reservation_id});
    }
  });
});

//Retrieve all editors
app.get('/editors', (_req, res) => {
  pool.query('SELECT * FROM editor', (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    } else {
      res.json(results);
    }
  });
});

//Add a new Editor
app.post('/editors', (req, res) => {
  const { fullname, contact, address } = req.body;

  const sql = 'INSERT INTO editor (fullname, contact, address) VALUES (?, ?, ?)';
  const values = [fullname, contact, address];

  pool.query(sql, values, (error) => {
    if (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    } else {
      const newEditor = {
        fullName: fullname,
        contact: contact,
        address: address,
      };
      res.json(newEditor);
    }
  });
});

// Get all services
app.get('/services', (_req, res) => {
  pool.query('SELECT * FROM service', (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    } else {
      res.json(results);
    }
  });
});

// Add a new service
app.post('/services', (req, res) => {
  const { serviceName } = req.body;

  const sql = 'INSERT INTO service (serviceName) VALUES (?)';
  const values = [serviceName];

  pool.query(sql, values, (error) => {
    if (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    } else {
      const newService = {
        serviceName: serviceName,
      };
      res.json(newService);
    }
  });
});

//Remove Service
app.delete('/services/:id', (req, res) => {
  const { id } = req.params;

  const sql = 'DELETE FROM service WHERE service_id = ?';
  const values = [id];

  pool.query(sql, values, (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    } else if (results.affectedRows === 0) {
      res.status(404).send('Service not found');
    } else {
      res.json({ message: 'Service deleted successfully' });
    }
  });
});

// Check Reservation by ID
app.get('/checkReservation/:id', (req, res) => {
  const { id } = req.params;

  pool.query('SELECT * FROM reservation WHERE reservation_id = ?', [id], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    } else {
      const isValid = results.length > 0 && (results[0].status === 'Approved' || results[0].status === 'Pending');

      if (isValid) {
        const reservation = results[0];
        res.json({ isValid, status: reservation.status, reservation });
      } else {
        res.status(404).json({ isValid: false, message: 'Invalid Reservation ID' });
      }
    }
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
