# API Examples

This document provides ready-to-use examples for testing the Grammar Check API with curl, HTTPie, or Postman.

## Prerequisites

Start the Rails server:

```bash
bin/rails server
```

Start the Solid Queue worker (in another terminal):

```bash
bin/jobs
```

## 1. Register a New User

### curl

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "teacher1",
    "password": "password123",
    "password_confirmation": "password123"
  }'
```

### HTTPie

```bash
http POST http://localhost:3000/api/v1/auth/register \
  username=teacher1 \
  password=password123 \
  password_confirmation=password123
```

### Response

```json
{
    "token": "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJleHAiOjE3MDk2NzI0MDB9.abc123...",
    "user": {
        "id": 1,
        "username": "teacher1"
    }
}
```

**Save the token!** You'll need it for subsequent requests.

---

## 2. Login

### curl

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "teacher1",
    "password": "password123"
  }'
```

### HTTPie

```bash
http POST http://localhost:3000/api/v1/auth/login \
  username=teacher1 \
  password=password123
```

### Response

```json
{
    "token": "eyJhbGciOiJIUzI1NiJ9...",
    "user": {
        "id": 1,
        "username": "teacher1"
    }
}
```

---

## 3. Get Current User Info

### curl

```bash
TOKEN="your_token_here"

curl -X GET http://localhost:3000/api/v1/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

### HTTPie

```bash
http GET http://localhost:3000/api/v1/auth/me \
  "Authorization: Bearer $TOKEN"
```

### Response

```json
{
    "user": {
        "id": 1,
        "username": "teacher1"
    }
}
```

---

## 4. Check Username Availability

Check if a username already exists (useful for registration forms).

### curl

```bash
# Check existing username
curl -X GET "http://localhost:3000/api/v1/auth/check_username?username=teacher1"

# Check available username
curl -X GET "http://localhost:3000/api/v1/auth/check_username?username=newteacher"
```

### HTTPie

```bash
# Check existing username
http GET "http://localhost:3000/api/v1/auth/check_username?username=teacher1"

# Check available username
http GET "http://localhost:3000/api/v1/auth/check_username?username=newteacher"
```

### Response (Username Exists)

```json
{
    "username": "teacher1",
    "exists": true
}
```

### Response (Username Available)

```json
{
    "username": "newteacher",
    "exists": false
}
```

### Response (Missing Parameter)

```json
{
    "error": "Username parameter is required"
}
```

**Note:** This endpoint does not require authentication. Usernames are case-insensitive.

---

## 5. Upload Image (Create Writing)

### curl

```bash
TOKEN="your_token_here"

curl -X POST http://localhost:3000/api/v1/writings \
  -H "Authorization: Bearer $TOKEN" \
  -F "image=@/path/to/your/image.jpg"
```

### HTTPie

```bash
http --form POST http://localhost:3000/api/v1/writings \
  "Authorization: Bearer $TOKEN" \
  image@/path/to/your/image.jpg
```

### Response

```json
{
    "writing": {
        "id": 1,
        "user_id": 1,
        "title": null,
        "original_text": null,
        "corrected_text": null,
        "comment": null,
        "image_url": "https://example.com/uploaded-image.jpg",
        "status": "pending",
        "error_count": 0,
        "created_at": "2025-01-15T10:30:00.000Z",
        "updated_at": "2025-01-15T10:30:00.000Z"
    }
}
```

**Note:** Status will change from `pending` → `processing` → `completed` (or `failed`). Use WebSocket or polling to get updates.

---

## 6. List All Writings

### curl

```bash
TOKEN="your_token_here"

curl -X GET http://localhost:3000/api/v1/writings \
  -H "Authorization: Bearer $TOKEN"
```

### HTTPie

```bash
http GET http://localhost:3000/api/v1/writings \
  "Authorization: Bearer $TOKEN"
```

### With Pagination

```bash
curl -X GET "http://localhost:3000/api/v1/writings?page=1&per_page=10" \
  -H "Authorization: Bearer $TOKEN"
```

### Response

```json
{
    "writings": [
        {
            "id": 1,
            "user_id": 1,
            "title": "My Summer Vacation",
            "original_text": "Last summer I went to the beach with my family...",
            "corrected_text": "Last summer, I went to the beach with my family...",
            "comment": "Great work! Watch out for comma usage.",
            "image_url": "https://example.com/image.jpg",
            "status": "completed",
            "error_count": 3,
            "created_at": "2025-01-15T10:30:00.000Z",
            "updated_at": "2025-01-15T10:35:00.000Z",
            "errors": [
                {
                    "id": 1,
                    "error_type": "punctuation",
                    "original": "Last summer I",
                    "correction": "Last summer, I",
                    "explanation": "Add a comma after introductory phrases.",
                    "position_start": 0,
                    "position_end": 13
                }
            ]
        }
    ],
    "meta": {
        "current_page": 1,
        "total_pages": 1,
        "total_count": 1
    }
}
```

---

## 7. Get Single Writing Details

### curl

```bash
TOKEN="your_token_here"
WRITING_ID=1

curl -X GET http://localhost:3000/api/v1/writings/$WRITING_ID \
  -H "Authorization: Bearer $TOKEN"
```

### HTTPie

```bash
http GET http://localhost:3000/api/v1/writings/1 \
  "Authorization: Bearer $TOKEN"
```

### Response

```json
{
    "writing": {
        "id": 1,
        "user_id": 1,
        "title": "My Summer Vacation",
        "original_text": "Last summer I went to the beach...",
        "corrected_text": "Last summer, I went to the beach...",
        "comment": "Great work! Watch your punctuation.",
        "image_url": "https://example.com/image.jpg",
        "status": "completed",
        "error_count": 3,
        "created_at": "2025-01-15T10:30:00.000Z",
        "updated_at": "2025-01-15T10:35:00.000Z",
        "errors": [
            {
                "id": 1,
                "error_type": "punctuation",
                "original": "Last summer I",
                "correction": "Last summer, I",
                "explanation": "Add a comma after introductory phrases.",
                "position_start": 0,
                "position_end": 13
            },
            {
                "id": 2,
                "error_type": "spelling",
                "original": "familiy",
                "correction": "family",
                "explanation": "Correct spelling is 'family'.",
                "position_start": 45,
                "position_end": 52
            }
        ]
    }
}
```

---

## 8. Delete Writing

### curl

```bash
TOKEN="your_token_here"
WRITING_ID=1

curl -X DELETE http://localhost:3000/api/v1/writings/$WRITING_ID \
  -H "Authorization: Bearer $TOKEN"
```

### HTTPie

```bash
http DELETE http://localhost:3000/api/v1/writings/1 \
  "Authorization: Bearer $TOKEN"
```

### Response

```
204 No Content
```

---

## 9. Batch Delete Writings

Delete multiple writings at once by providing an array of IDs.

### curl

```bash
TOKEN="your_token_here"

curl -X DELETE http://localhost:3000/api/v1/writings/batch_destroy \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "ids": [1, 2, 3]
  }'
```

### HTTPie

```bash
http DELETE http://localhost:3000/api/v1/writings/batch_destroy \
  "Authorization: Bearer $TOKEN" \
  ids:='[1, 2, 3]'
```

### Response

```json
{
    "deleted_count": 3,
    "message": "Successfully deleted 3 writing(s)"
}
```

**Notes:**

- Only writings belonging to the current user will be deleted
- If some IDs don't exist or don't belong to you, they will be silently skipped
- The `deleted_count` reflects the actual number of writings that were deleted

### Error Responses

#### Missing or Invalid IDs

```json
{
    "error": "Parameter 'ids' must be a non-empty array"
}
```

#### Invalid ID Format

```json
{
    "error": "All ids must be valid integers"
}
```

---

## 10. WebSocket Connection

### JavaScript Example - Single Writing

Subscribe to updates for a specific writing:

```javascript
import ActionCable from "@rails/actioncable";

// Connect with token
const cable = ActionCable.createConsumer(`ws://localhost:3000/cable?token=${YOUR_TOKEN}`);

// Subscribe to a specific writing
const subscription = cable.subscriptions.create(
    {
        channel: "WritingChannel",
        writing_id: 1,
    },
    {
        connected() {
            console.log("Connected to WritingChannel");
        },

        disconnected() {
            console.log("Disconnected from WritingChannel");
        },

        received(data) {
            console.log("Received update:", data);

            // Update UI based on status
            if (data.status === "completed") {
                displayResults(data);
            } else if (data.status === "failed") {
                showError(data.comment);
            } else if (data.status === "processing") {
                showLoadingSpinner();
            }
        },
    }
);

// Unsubscribe when done
// subscription.unsubscribe();
```

### JavaScript Example - All User Writings

Subscribe to updates for ALL writings belonging to the current user:

```javascript
import ActionCable from "@rails/actioncable";

// Connect with token
const cable = ActionCable.createConsumer(`ws://localhost:3000/cable?token=${YOUR_TOKEN}`);

// Subscribe to all user writings
const userWritingsSubscription = cable.subscriptions.create(
    {
        channel: "UserWritingsChannel",
    },
    {
        connected() {
            console.log("Connected to UserWritingsChannel");
            console.log("Listening for updates on all your writings...");
        },

        disconnected() {
            console.log("Disconnected from UserWritingsChannel");
        },

        received(data) {
            console.log(`Writing ${data.id} status changed to:`, data.status);

            // Update UI for the specific writing
            updateWritingInList(data.id, data);

            // Handle different statuses
            switch (data.status) {
                case "pending":
                    showWritingPending(data.id);
                    break;
                case "processing":
                    showWritingProcessing(data.id);
                    break;
                case "completed":
                    showWritingCompleted(data.id, data);
                    // Optionally show a notification
                    showNotification(`Writing "${data.title}" is ready!`);
                    break;
                case "failed":
                    showWritingFailed(data.id, data.comment);
                    break;
            }
        },
    }
);

// Helper function to update a writing in your list
function updateWritingInList(writingId, data) {
    const writingElement = document.querySelector(`[data-writing-id="${writingId}"]`);
    if (writingElement) {
        writingElement.dataset.status = data.status;
        // Update other elements as needed
    }
}

// Unsubscribe when done
// userWritingsSubscription.unsubscribe();
```

### When to Use Which Channel?

- **WritingChannel**: Use when viewing a single writing's details page. Only receives updates for that specific writing.
- **UserWritingsChannel**: Use when displaying a list of writings (e.g., dashboard). Receives updates for all user's writings, perfect for real-time list updates.

### WebSocket Message Format

When status changes, you'll receive:

```json
{
    "id": 1,
    "status": "completed",
    "title": "My Summer Vacation",
    "original_text": "...",
    "corrected_text": "...",
    "comment": "...",
    "error_count": 3,
    "errors": [
        {
            "id": 1,
            "error_type": "spelling",
            "original": "...",
            "correction": "...",
            "explanation": "...",
            "position_start": 0,
            "position_end": 5
        }
    ]
}
```

---

## Error Responses

### 401 Unauthorized

Missing or invalid token:

```json
{
    "error": "Unauthorized"
}
```

### 404 Not Found

Resource doesn't exist or doesn't belong to you:

```json
{
    "error": "Writing not found"
}
```

### 422 Unprocessable Entity

Validation errors:

```json
{
    "errors": ["Username can't be blank", "Password is too short (minimum is 6 characters)"]
}
```

---

## Testing the Full Flow

Here's a complete example workflow:

```bash
# 1. Check if username is available
curl -s -X GET "http://localhost:3000/api/v1/auth/check_username?username=test_teacher" | jq '.'

# 2. Register (if username is available)
TOKEN=$(curl -s -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "test_teacher",
    "password": "password123",
    "password_confirmation": "password123"
  }' | jq -r '.token')

echo "Token: $TOKEN"

# 3. Upload image
WRITING_ID=$(curl -s -X POST http://localhost:3000/api/v1/writings \
  -H "Authorization: Bearer $TOKEN" \
  -F "image=@sample.jpg" | jq -r '.writing.id')

echo "Writing ID: $WRITING_ID"

# 4. Wait a bit for processing (or use WebSocket)
sleep 10

# 5. Check results
curl -X GET http://localhost:3000/api/v1/writings/$WRITING_ID \
  -H "Authorization: Bearer $TOKEN" | jq '.'

# 6. List all writings
curl -X GET http://localhost:3000/api/v1/writings \
  -H "Authorization: Bearer $TOKEN" | jq '.'
```

---

## Postman Collection

Import this JSON into Postman:

```json
{
    "info": {
        "name": "Grammar Check API",
        "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
    },
    "item": [
        {
            "name": "Register",
            "request": {
                "method": "POST",
                "header": [{"key": "Content-Type", "value": "application/json"}],
                "body": {
                    "mode": "raw",
                    "raw": "{\n  \"username\": \"teacher1\",\n  \"password\": \"password123\",\n  \"password_confirmation\": \"password123\"\n}"
                },
                "url": {
                    "raw": "http://localhost:3000/api/v1/auth/register",
                    "protocol": "http",
                    "host": ["localhost"],
                    "port": "3000",
                    "path": ["api", "v1", "auth", "register"]
                }
            }
        },
        {
            "name": "Login",
            "request": {
                "method": "POST",
                "header": [{"key": "Content-Type", "value": "application/json"}],
                "body": {
                    "mode": "raw",
                    "raw": "{\n  \"username\": \"teacher1\",\n  \"password\": \"password123\"\n}"
                },
                "url": {
                    "raw": "http://localhost:3000/api/v1/auth/login",
                    "protocol": "http",
                    "host": ["localhost"],
                    "port": "3000",
                    "path": ["api", "v1", "auth", "login"]
                }
            }
        },
        {
            "name": "Check Username",
            "request": {
                "method": "GET",
                "header": [],
                "url": {
                    "raw": "http://localhost:3000/api/v1/auth/check_username?username=teacher1",
                    "protocol": "http",
                    "host": ["localhost"],
                    "port": "3000",
                    "path": ["api", "v1", "auth", "check_username"],
                    "query": [
                        {
                            "key": "username",
                            "value": "teacher1"
                        }
                    ]
                }
            }
        }
    ],
    "variable": [
        {
            "key": "baseUrl",
            "value": "http://localhost:3000"
        },
        {
            "key": "token",
            "value": "your_token_here"
        }
    ]
}
```

---

## Environment Variables for Testing

Add to your `.env` or export:

```bash
export OPENROUTER_API_KEY="your_api_key_here"
export RAILS_ENV="development"
```

---

## Troubleshooting

### Token Expired

If you get "Unauthorized", your token might have expired. Login again to get a new token.

### Job Not Processing

Make sure the Solid Queue worker is running:

```bash
bin/jobs
```

Check logs:

```bash
tail -f log/development.log
```

### WebSocket Connection Failed

Ensure Action Cable is mounted:

```bash
grep "mount ActionCable" config/routes.rb
```

Should see:

```ruby
mount ActionCable.server => '/cable'
```

---

**Happy Testing! 🧪**
