package transport

import (
	"context"

	"github.com/go-kit/kit/endpoint"
	"github.com/go-kit/kit/transport/grpc"
	pb "github.com/mrkarna/vocabBuilder/backend/pb/autogen"
)

// gRPC server struct
type grpcServer struct {
	pb.UnimplementedVocabServiceServer

	addWordHandler        grpc.Handler
	getRandomWordHandler  grpc.Handler
}

// NewGRPCServer returns a new gRPC server instance that wraps the endpoints.
func NewGRPCServer(add endpoint.Endpoint, get endpoint.Endpoint) pb.VocabServiceServer {
	return &grpcServer{
		addWordHandler: grpc.NewServer(
			add,
			decodeGRPCAddWordRequest,
			encodeGRPCAddWordResponse,
		),
		getRandomWordHandler: grpc.NewServer(
			get,
			decodeGRPCEmptyRequest,
			encodeGRPCGetWordResponse,
		),
	}
}

// AddWord gRPC method
func (s *grpcServer) AddWord(ctx context.Context, req *pb.Word) (*pb.AddResponse, error) {
	_, resp, err := s.addWordHandler.ServeGRPC(ctx, req)
	if err != nil {
		return nil, err
	}
	return resp.(*pb.AddResponse), nil
}

// GetRandomWord gRPC method
func (s *grpcServer) GetRandomWord(ctx context.Context, req *pb.Empty) (*pb.Word, error) {
	_, resp, err := s.getRandomWordHandler.ServeGRPC(ctx, req)
	if err != nil {
		return nil, err
	}
	return resp.(*pb.Word), nil
}
