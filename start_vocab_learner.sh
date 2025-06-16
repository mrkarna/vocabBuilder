## To start both backend and frontend
```bash
#!/bin/bash

# Exit on error
set -e

echo "Compiling protobuf files..."
protoc \
  -I backend/pb \
  -I "$(go list -f '{{ .Dir }}' -m github.com/grpc-ecosystem/grpc-gateway/v2)" \
  -I "$(go list -f '{{ .Dir }}' -m github.com/googleapis/googleapis)" \
  --go_out=paths=source_relative:backend/pb/autogen \
  --go-grpc_out=paths=source_relative:backend/pb/autogen \
  --grpc-gateway_out=paths=source_relative:backend/pb/autogen \
  backend/pb/vocab.proto

# Start backend (in background)
echo "Starting backend..."
go run backend/cmd/server/main.go &

BACKEND_PID=$!

# Start frontend (in foreground)
echo "Starting frontend..."
cd frontend
npm run dev

# When frontend stops, kill backend
kill $BACKEND_PID