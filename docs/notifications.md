# Notifications Documentation

Standardized system for managing user notifications via Webhooks (Discord/Slack), REST API, and real-time WebSockets.

---

## 1. REST API
All endpoints are available under the `/v1/notifications` prefix.

### 1.1 Get All Notifications (Paginated)
Fetch all notifications for the logged-in user.
- **Endpoint**: `GET /api/v1/notifications`
- **Auth**: Bearer Token (JWT)
- **Queries**:
  - `page` (default: 1)
  - `limit` (default: 10, max: 50)
- **Response**:
```json
{
  "status": "success",
  "data": {
    "data": [
      {
        "id": "uuid",
        "title": "Tryout Selesai",
        "message": "Hasil tryout SKD CPNS 2024 sudah keluar.",
        "isRead": false,
        "createdAt": "2026-04-03T10:00:00.000Z"
      }
    ],
    "hasNextPage": false
  },
  "meta": {}
}
```

### 1.2 Get Unread Count
Fetch the current number of unread notifications for the logged-in user.
- **Endpoint**: `GET /api/v1/notifications/unread-count`
- **Auth**: Bearer Token (JWT)
- **Response**:
```json
{
  "status": "success",
  "data": {
    "count": 5
  },
  "meta": {}
}
```

### 1.3 Mark as Read
Mark a specific notification as read.
- **Endpoint**: `POST /api/v1/notifications/:id/mark-read`
- **Auth**: Bearer Token (JWT)
- **Response**:
```json
{
  "status": "success",
  "data": {
    "success": true
  },
  "meta": {}
}
```

---

## 2. WebSockets (Real-time)
Used to keep the unread count updated on the UI without page refresh.

- **Namespace**: `/notifications`
- **Connection URL**: `ws://[hostname]/notifications`
- **Authentication**: JWT Token passed via handshake `auth.token`.

### 2.1 Implementation (Socket.io)
```javascript
import { io } from "socket.io-client";

const socket = io("http://localhost:3002/notifications", {
  auth: {
    token: "CURRENT_USER_JWT_TOKEN"
  }
});

// Listener for unread count updates
socket.on("unreadCount", (data) => {
  console.log("Unread Notifications:", data.count);
  // Update your UI badge here
});
```

### 2.2 Server-side Logic
- Users are automatically joined to a private room: `user_${userId}`.
- Every time a new notification is generated OR marked as read, the server emits the `unreadCount` event to that specific user room.

---

## 3. Webhooks (External)
System-wide alerts sent to a configured `WEBHOOK_URL` (Discord/Slack compatible).
- Currently used for: Tryout publications, security alerts, and platform events.
- Highly customizable via Handlebars templates in `src/modules/notifications/templates/`.
