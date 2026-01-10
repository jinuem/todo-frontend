# TODO Frontend Application

A React-based frontend for the TODO application, built according to PRD specifications.

## Features

- Add new todos
- View all todos
- Mark todos as completed/incomplete
- Delete todos
- Responsive design
- Error handling and loading states

## Components

- `App.jsx` - Main application component with state management and API calls
- `TodoInput.jsx` - Input form for adding new todos
- `TodoList.jsx` - Container for rendering the list of todos
- `TodoItem.jsx` - Individual todo item with checkbox and delete functionality

## API Integration

The frontend communicates with the backend at `http://localhost:4000/api/todos` using the following endpoints:

- `GET /api/todos` - Fetch all todos
- `POST /api/todos` - Create a new todo
- `PUT /api/todos/:id` - Update todo completion status
- `DELETE /api/todos/:id` - Delete a todo

## Development

### Prerequisites

- Node.js (v16 or higher)
- npm

### Installation

```bash
npm install
```

### Running the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

### Building for Production

```bash
npm run build
```

### Running Tests

```bash
npm test
```

## Project Structure

```
src/
├── App.jsx              # Main application component
├── TodoInput.jsx        # Todo input form component
├── TodoList.jsx         # Todo list container component
├── TodoItem.jsx         # Individual todo item component
├── main.jsx            # Application entry point
├── index.css           # Global styles
└── test/               # Unit tests
    ├── App.test.jsx
    ├── TodoInput.test.jsx
    ├── TodoList.test.jsx
    ├── TodoItem.test.jsx
    └── setup.js
```

## Technologies Used

- React 19
- Vite (build tool)
- Vitest (testing framework)
- React Testing Library
- CSS3 for styling

## PRD Compliance

This frontend implementation strictly follows the PRD requirements:
- All mandatory components are implemented
- State management is centralized in App.jsx
- API integration matches the specified endpoints
- UI behavior aligns with user stories
- Unit tests cover all components
- Responsive design with basic styling
