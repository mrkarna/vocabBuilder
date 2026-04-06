---
name: start
description: Kill any existing vocabBuilder processes, compile protobuf files, and start the backend + frontend services
---

# Start VocabBuilder

Follow these steps to start the app:

1. **Kill existing processes** on ports 8080 (backend REST), 50051 (gRPC), and 5173 (frontend Vite):
   ```bash
   lsof -ti :8080 -ti :50051 -ti :5173 | xargs kill -9 2>/dev/null; echo "Cleaned up old processes"
   ```

2. **Start everything** using the startup script from the repo root:
   ```bash
   bash start_vocab_learner.sh &> /tmp/vocab_start.log &
   ```

3. **Wait 6 seconds** then verify both services started by checking the log:
   ```bash
   sleep 6 && cat /tmp/vocab_start.log
   ```

4. **Verify the API** is responding:
   ```bash
   curl -s http://localhost:8080/v1/vocab/all | head -c 100
   ```

5. **Report back** to the user:
   - Frontend: http://localhost:5173
   - Backend REST: http://localhost:8080
   - gRPC: :50051
   - If port 8080 shows "address already in use", check `lsof -i :8080` — another service (e.g. product-catalog) may be occupying it

6. **Open in Chrome**:
   ```bash
   open -a "Google Chrome" http://localhost:5173
   ```
