# PostMan App

## Login Demo

![Demo1](./postman_demo1.gif)

## Main functionalities Demo

![Demo2](./postman_demo2.gif)

## Introduction

PostMan is a convenient and lightning-fast delivery service app designed to handle errands at a tap of a screen. Whether it's delivering items to friends or partners or picking up groceries from a store, PostMan ensures a seamless and hassle-free experience. With real-time tracking, estimated delivery times, and notifications, you're always kept informed. We believe in building stronger communities, providing new ways for people to earn, work, and live.

## Setting Up Environments

### Prerequisites

Ensure that you have the following installed on your local machine:

- Node.js and npm (Node Package Manager): You can download these from [here](https://nodejs.org/en/download/)
- MongoDB: Instructions for installation can be found [here](https://docs.mongodb.com/manual/installation/)
- Git: You can download it from [here](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)

### Steps to Setup

1. **Clone the repository**: Run the following command in the terminal:

```bash
git clone https://github.com/itsEricWu/postman.git
```

2. **Navigate into the postman directory**:

```bash
cd postman
```

### Setting Up the Backend

3. **Go into the backend folder**:

```bash
cd backend
```

4. **Install the dependencies**:

```bash
npm install
```

5. **Set up your MongoDB database**:

   Open `backend/config/db.js` in your text editor and replace `<YOUR_MONGODB_URL>` with your MongoDB URL.

6. **Start the server**:

```bash
npm start
```

### Setting Up the Frontend

7. **Go into the frontend folder**:

```bash
cd ../frontend
```

8. **Install the dependencies**:

```bash
npm install
```

9. **Start the application**:

```bash
npm start
```

## Running the Project

After setting up both the front end and the back end, you can now run the project. Open a browser and go to `http://localhost:3000` to view the PostMan App.

Please note that any changes made in the code will reflect immediately in your browser due to the hot-reload feature of `create-react-app`.
