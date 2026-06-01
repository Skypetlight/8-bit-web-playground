# 8bit Web Playground

A web-based playground for the **8-Bit programming language**, allowing users to write, compile, and execute code directly from the browser.

This project acts as a frontend and API layer on top of the standalone **8bit Compiler & Virtual Machine** project, integrating the compiler and runtime into a modern full-stack web application.

> ⚠️ Work in Progress — This project is currently under active development.

---

# Overview

The goal of this project is to provide an interactive environment where users can:

- Write 8-Bit programs directly in the browser
- Send code to a backend compilation service
- Compile source code dynamically using Java compiler JARs
- Execute generated assembly using the 8-Bit virtual machine
- View compilation results, runtime output, and errors in real time

The application follows a service-oriented architecture where the frontend communicates with an Express backend responsible for invoking the compiler and runtime processes.

---

# Architecture

```text
Browser Client
       ↓
React Frontend
       ↓
Express API Server
       ↓
Java Compiler JAR
       ↓
Assembly Output
       ↓
Java Virtual Machine JAR
       ↓
Execution Result
```

---

# Technologies Used

## Frontend

- React
- TypeScript
- GraphQL
- Apollo Client
- CodeMirror

## Backend

- Node.js
- Express
- GraphQL

## Compiler Runtime

- Java
- ANTLR4
- Custom Stack-Based Virtual Machine

---

# Features

## Code Editor

- Browser-based source code editing
- Multi-line code support
- CodeMirror integration
- Syntax-oriented editing workflow

## Compilation Pipeline

- Dynamic compilation through Java JAR execution
- Assembly generation
- Runtime execution

## Execution Output

- Runtime console output
- Compilation error reporting
- Execution feedback

## API Integration

- GraphQL communication between frontend and backend
- Compiler request handling
- Runtime result serialization

---

# Current Development Status

The project is currently focused on:

- Frontend/backend integration
- Dynamic Java process execution
- Compiler service orchestration
- Runtime output handling
- API communication architecture

Future development will include:

- Better UI/UX
- Improved error visualization
- Sandboxed execution
- Deployment support
- Mobile responsiveness
- Editor improvements

---

# Related Project

This playground depends on the standalone compiler/runtime project:

```text
8bit-compiler-vm
```

The compiler and virtual machine are maintained separately and consumed by this application as executable Java dependencies.

---

# Installation

## Requirements

- Node.js
- Java JDK 8+
- npm

---

# Backend Setup

```bash
cd server
npm install
npm start
```

---

# Frontend Setup

```bash
cd frontend
npm install
npm start
```

---

# Future Goals

Planned long-term improvements include:

- Online deployment
- Persistent projects
- User accounts
- Interactive debugger
- Bytecode visualization
- Assembly viewer
- Educational tooling
- Multi-file project support

---

# Educational Purpose

This project was developed as an educational and portfolio-oriented system focused on:

- Compiler integration
- Full-stack architecture
- Runtime orchestration
- API communication
- Process execution
- Programming language tooling

---

# Author

Alejandro Vega

---

# Important Credits

The compiler and virtual machine are based on the standalone 8-Bit compiler ecosystem project.

Original virtual machine implementation:
- Marco Schweighauser (2015, JavaScript implementation)

Java migration and compiler integration:
- Alejandro Vega
