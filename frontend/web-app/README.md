# Frontend

## Overview

ACH Processor is a web-based application designed for seamless, fast, and secure ACH file processing. It provides a modern interface with a responsive design, featuring a dark-themed UI for enhanced user experience.

## Features

- **Hero Section with Animation**:
  - A visually appealing hero section with a title, subtitle, and scroll indicator.
  - Smooth fade-in and bounce animations for an engaging experience.
- **Fully Responsive Layout**:
  - The webpage adjusts to different screen sizes for a consistent experience across devices.
- **Navigation Bar**:
  - Includes `Home`, `About`, and `Contact` links.
- **Smooth Scrolling & Transitions**:
  - Elements become visible as the user scrolls down.
- **Dark Theme with Gradient Background**:
  - A modern dark UI with a gradient background for a sleek look.

## Run

```sh
npm install
```
Start the Development Server
``` sh
npm run dev
```
Build for Production
```sh
npm start
```
## Using Plop for Component Generation
Plop is used in this project to generate components quickly. To use it:
```sh
npx plop component
```
## Folder Structure
```sh
ach-processor/
│── public/        # Static assets
│── src/           # Source code
│   ├── components/  # Reusable UI components
│   ├── pages/       # Page-specific components
│   ├── styles/      # Global styles
│── .gitignore      # Files to ignore in Git
│── package.json    # Project dependencies and scripts
│── README.md       # Project documentation
```