## To compile the backend app
```bash
protoc \
  -I backend/pb \
  -I "$(go list -f '{{ .Dir }}' -m github.com/grpc-ecosystem/grpc-gateway/v2)" \
  -I "$(go list -f '{{ .Dir }}' -m github.com/googleapis/googleapis)" \
  --go_out=paths=source_relative:backend/pb/autogen \
  --go-grpc_out=paths=source_relative:backend/pb/autogen \
  --grpc-gateway_out=paths=source_relative:backend/pb/autogen \
  backend/pb/vocab.proto
```

## To start the backend app
```bash
go run backend/cmd/server/main.go
```

## To hit the API add vocab API
### Add a word (HTTP):
```bash
curl -X POST http://localhost:8080/v1/vocab \
  -H "Content-Type: application/json" \
  -d '{"text":"sonder", "meaning":"the realization that everyone has a complex life"}'
```

### Get a random word (HTTP):
```bash
curl http://localhost:8080/v1/vocab
```


## To start the frontend app
```bash
cd frontned
npm run dev
```