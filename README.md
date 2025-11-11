# lgsDB

Academic project about languages ​​for the Web Services Programming course.

## Key Features & Benefits

- **User Authentication:** Secure user registration and login functionality.
- **Language Data Management:** Create, read, update, and delete language information.
- **Language Family Management:** Organize languages into families.
- **Fluency Tracking:** Track user fluency in different languages.
- **Profile Management:** Users can manage their profiles.
- **Statistical Data:** Provides statistical information related to languages and project.

## Prerequisites & Dependencies

Before you begin, ensure you have the following installed:

- **Node.js:** [https://nodejs.org/](https://nodejs.org/)
- **MySQL:** [https://www.mysql.com/](https://www.mysql.com/)

The project also relies on the following Node.js packages:

- `bcrypt`
- `express`
- `express-session`
- `mysql2`

## Installation & Setup Instructions

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Tellay/lgsDB.git
   cd lgsDB
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure the database:**

   - Create a MySQL database.
   - Rename `config/options.json.example` to `config/options.json`.
   - Edit `config/options.json` to match your MySQL configuration:

   ```json
   {
     "server": {
       "port": 8081,
       "environment": "DEVELOPMENT"
     },
     "database": {
       "connectionLimit": 10,
       "host": "localhost",
       "user": "root",
       "password": "root",
       "database": "lgsdb"
     },
     "session": {
       "secret": "my_super_session_secret"
     },
     "auth": {
       "min_password_length": 6,
       "salt_rounds": 10
     }
   }
   ```

4. **Create the database schema:**

   Run the SQL script to create the necessary tables:

   ```bash
   mysql -u your_user -p your_database < db/create_database.sql
   ```

   (Replace `your_user` and `your_database` with your actual MySQL credentials.)

5. **Start the server:**

   ```bash
   npm run dev
   ```

   The server will start at `http://localhost:8081` (or the port specified in `config/options.json`).

## Usage Examples & API Documentation

### Endpoints:

- **Authentication:**
  - `POST /signup`: Register a new user.
  - `POST /login`: Login an existing user.
  - `POST /logout`: Logout the current user.
  - `POST /session`: Get the current session if exists.
- **Languages:**
  - `GET /languages`: Get all languages.
  - `GET /languages/:id`: Get a specific language by ID.
  - `POST /languages`: Create a new language. Requires authentication.
  - `PUT /languages/:id`: Update a language. Requires authentication.
  - `DELETE /languages/:id`: Delete a language. Requires authentication.
- **Families:**
  - `GET /families`: Get all language families.
- **Fluencies:**
  - `GET /fluencies`: Get all fluencies.
- **Profile:**
  - `GET /profile`: Get the current user's profile. Requires authentication.
  - `PUT /profile`: Update the current user's profile. Requires authentication.
  - `DELETE /profile`: Delete the current user's profile. Requires authentication.
  - `GET /profile/ranking/top-polyglots`: Get the current user's ranking in top polyglots.
  - `GET /profile/ranking/top-accesses`: Get the current user's ranking in top accesses.
  - `GET /profile/languages`: Get the current user's languages. Requires authentication.
  - `POST /profile/languages`: Create a language to current user. Requires authentication.
  - `DELETE /profile/languages`: Delete a language to current user. Requires authentication.
- **Stats:**
  - `GET /dashboard-summary`: Get the dashboard summary.
  - `GET /top-polyglots`: Get the top polyglots.
  - `GET /top-language-families`: Get the top language families.
  - `GET /top-languages`: Get the top languages.
  - `GET /top-users-access`: Get the top users accesses.

### Example (Get all languages):

```javascript
// JavaScript example (using fetch)
fetch("/languages")
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error("Error:", error));
```

## Configuration Options

The following configuration options are available in `config/options.json`:

- **`server.port`:** The port the server will listen on. Defaults to 8081.
- **`server.environment`:** The environment the srrver will be running.
- **`database.connectionLimit`:** The limit of connection to the database.
- **`database.host`:** The MySQL server hostname. Defaults to `localhost`.
- **`database.user`:** The MySQL username.
- **`database.password`:** The MySQL password.
- **`database.database`:** The MySQL database name.
- **`session.secret`:** The secret used by express-session.
- **`auth.min_password_length`:** The min length that passwords can have.
- **`auth.salt_rounds`:** The salt rounds used by bcrypt to hash the password.

## Contributing Guidelines

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes.
4. Submit a pull request.

## License Information

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

This project was developed as part of the Web Services Programming course.
