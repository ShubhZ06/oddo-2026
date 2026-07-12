# Project-Scoped Rules

## Background Tasks
- **NEVER** kill, stop, or interrupt any running `ngrok` processes or background tasks, as the user relies on a persistent ngrok tunnel to share their local MySQL database with collaborators. Stopping it breaks their connection and changes the public URL.
