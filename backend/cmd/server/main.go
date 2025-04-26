package main

import (
	"context"
	"flag"
	"fmt"
	"log"
	"net"
	"net/http"

	"github.com/grpc-ecosystem/grpc-gateway/v2/runtime"
	"github.com/mrkarna/vocabBuilder/backend/endpoint"
	pb "github.com/mrkarna/vocabBuilder/backend/pb/autogen"
	"github.com/mrkarna/vocabBuilder/backend/service"
	"github.com/mrkarna/vocabBuilder/backend/transport"
	"google.golang.org/grpc"
)

func main() {
	var (
		grpcPort = flag.Int("grpc-port", 50051, "gRPC server port")
		httpPort = flag.Int("http-port", 8080, "HTTP gateway port")
	)
	flag.Parse()

	// Initialize the core service
	svc := service.NewService()

	// Create endpoints
	addWordEndpoint := endpoint.MakeAddWordEndpoint(svc)
	getWordEndpoint := endpoint.MakeGetRandomWordEndpoint(svc)

	// Create gRPC server that wraps endpoints
	grpcSrv := transport.NewGRPCServer(addWordEndpoint, getWordEndpoint)

	// Start gRPC server
	go func() {
		lis, err := net.Listen("tcp", fmt.Sprintf(":%d", *grpcPort))
		if err != nil {
			log.Fatalf("Failed to listen: %v", err)
		}
		s := grpc.NewServer()
		pb.RegisterVocabServiceServer(s, grpcSrv)
		log.Printf("gRPC server listening on :%d", *grpcPort)
		log.Fatal(s.Serve(lis))
	}()

	// Start HTTP (REST) gateway
	ctx := context.Background()
	ctx, cancel := context.WithCancel(ctx)
	defer cancel()

	mux := runtime.NewServeMux()
	opts := []grpc.DialOption{grpc.WithInsecure()} // for local dev only

	err := pb.RegisterVocabServiceHandlerFromEndpoint(ctx, mux, fmt.Sprintf("localhost:%d", *grpcPort), opts)
	if err != nil {
		log.Fatalf("Failed to start HTTP gateway: %v", err)
	}

	log.Printf("HTTP REST gateway listening on :%d", *httpPort)
	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%d", *httpPort), mux))
}
