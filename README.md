# Tribe Chat App

## Overview

Tribe Chat is a cross-platform React Native single-room chat application built using **Expo**, **Zustand**, and **async-storage** for persistent data storage. This app provides essential chat functionalities like sending messages, viewing reactions, and interacting with participants while maintaining a clean and efficient codebase.

---

## Installation

### Prerequisites
- Node.js >= 20.18.1
- Yarn or npm
- Expo CLI

### Steps
1. Clone the repository:  
   ```bash
   git clone https://github.com/bruce-sdb71/tribe-chat.git
   cd tribe-chat
   ```
2. Install dependencies:  
   ```bash
   yarn install
   ```
3. Start the development server:  
   ```bash
   yarn start
   ```

---

## Tech Stack

### Core Libraries
- **React Native**: Cross-platform development.
- **Expo**: Simplified setup and development experience.
- **Zustand**: State management.
- **async-storage**: Persistent local storage.

### UI Libraries
- **React Native Modal**: For displaying modals.
- **React Navigation**: Navigation and routing.
- **Expo Image**: Efficient image handling.

### Dev Tools
- **TypeScript**: Static typing for better code quality.
- **ESLint**: Code linting and style enforcement.

---

## Project Structure

```
.
├── app
│   ├── _layout.tsx                // Layout configuration
│   ├── ChatComponent.tsx          // Main chat screen
│   └── assets                     // Static assets
├── components
│   ├── DateSeparator.tsx          // Date separator between messages
│   ├── ImageModal.tsx             // Image preview modal
│   ├── MessageInput.tsx           // Input bar for sending messages
│   ├── MessageItem.tsx            // Individual message component
│   ├── ParticipantModal.tsx       // Participant details modal
│   └── ReactionModal.tsx          // Reactions list modal
├── constants
│   └── Colors.ts                  // Color palette for the app
├── services
│   └── api.ts                     // API service for interacting with endpoints
├── store
│   └── chatStore.ts               // Zustand store for managing app state
├── types
│   └── chat.ts                    // Type definitions for messages and participants
├── .gitignore                     // Files to ignore in version control
├── app.json                       // Expo configuration
├── eas.json                       // Expo Application Services config
├── eslint.config.js               // ESLint configuration
├── package.json                   // Project metadata and dependencies
├── README.md                      // Project documentation
├── tsconfig.json                  // TypeScript configuration
└── yarn.lock                      // Dependency lock file
```

---

## API Integration

### Base URL
`https://dummy-chat-server.tribechat.com`

### Endpoints
- **GET /info**  
  Retrieves session UUID and API version.
- **GET /messages/all**  
  Returns all messages.
- **GET /messages/latest**  
  Fetches the latest 25 messages.
- **GET /messages/older/<ref-message-uuid>**  
  Fetches older messages before the given reference message UUID.
- **GET /messages/updates/<time>**  
  Returns messages updated after the provided timestamp.
- **POST /messages/new**  
  Adds a new message.
- **GET /participants/all**  
  Retrieves all chat participants.
- **GET /participants/updates/<time>**  
  Fetches participants updated after the provided timestamp.

---

## Development Process

### Key Considerations
- **State Management**: Zustand was chosen for its lightweight and scalable approach to managing global state.
- **Performance Optimization**: Used memoization and lazy loading to minimize re-rendering and improve app responsiveness.
- **Offline Support**: Leveraged async-storage to store messages and participants locally for seamless offline access.
- **Reusable Components**: Modularized UI components for maintainability and scalability.

### Challenges
- Efficiently grouping consecutive messages from the same participant.
- Implementing lazy loading for older messages while maintaining smooth scrolling.
- Ensuring the app remains performant with real-time updates from the API.

---

## How to Use

1. Open the app and view the list of messages.
2. Use the input bar to send new messages.
3. Interact with messages:
   - View reactions.
   - Reply to messages.
   - Preview images.
4. Explore participant details by clicking on their name.

---