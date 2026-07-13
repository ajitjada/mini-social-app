# Mini Social Platform

A full-stack web application that allows users to register, log in securely, upload a profile picture, create and edit posts, and like or unlike posts. Built using Node.js, Express.js, MongoDB, EJS, Tailwind CSS, JWT authentication, bcrypt password hashing, and Multer for image uploads.

---

## 🚀 Features

- 🔐 User Registration & Login
- 🔑 JWT Authentication
- 🔒 Password Hashing with bcrypt
- 👤 User Profile
- 🖼️ Profile Picture Upload
- ✍️ Create Posts
- 📝 Edit Posts
- ❤️ Like & Unlike Posts
- 💾 MongoDB Database Integration
- 🎨 Responsive UI using Tailwind CSS

---

## 🛠️ Tech Stack

### Frontend
- EJS
- Tailwind CSS

### Backend
- Node.js
- Express.js

### Database
- MongoDB
- Mongoose

### Authentication & Security
- JWT (JSON Web Token)
- bcrypt

### File Upload
- Multer

---

## 📁 Project Structure

```

├── config/
│   └── multerconfig.js
│
├── models/
│   ├── user.js
│   └── post.js
│
├── public/
│   ├── images/
│
├── views/
│   ├── index.ejs
│   ├── login.ejs
│   ├── profile.ejs
│   ├── edit.ejs
│   └── profileupload.ejs
│
├── index.js
├── package.json
└── README.md
```

---

## ⚙️ Installation

### Clone the repository

```bash
git clone https://github.com/ajitjada/mini-social-app.git
```

### Go to project directory

```bash
cd mini-social-app
```

### Install dependencies

```bash
npm install
```

### Start MongoDB

Make sure MongoDB is running locally.

```
mongodb://127.0.0.1:27017/miniApp
```

### Start the server

```bash
node index.js
```

Open your browser:

```
http://localhost:3000
```

---

## 📸 Screenshots


### Register Page

```
![Register Page](/images/register.png)
```

### Login Page

```
![Login Page](/images/login.png)
```

### User Profile

```
![Profile Page](/images/profile.png)
```


---

## 🎯 Future Improvements

- Delete Posts
- Comment System
- Follow/Unfollow Users
- User Search
- Notifications
- Password Reset
- Dark/Light Theme
- Responsive Mobile Design

---

## 👨‍💻 Author

**Ajit**

GitHub: https://github.com/ajitjada

---