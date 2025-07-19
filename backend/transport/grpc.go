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

	addWordHandler       grpc.Handler
	getRandomWordHandler grpc.Handler
	listWordsHandler     grpc.Handler
	updateWordHandler    grpc.Handler
	deleteWordHandler    grpc.Handler
}

// NewGRPCServer returns a new gRPC server instance that wraps the endpoints.
func NewGRPCServer(add endpoint.Endpoint, get endpoint.Endpoint, list endpoint.Endpoint, update endpoint.Endpoint, delete endpoint.Endpoint) pb.VocabServiceServer {
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
		listWordsHandler: grpc.NewServer(
			list,
			decodeGRPCEmptyRequest,
			encodeGRPCListWordsResponse,
		),
		updateWordHandler: grpc.NewServer(
			update,
			decodeGRPCUpdateWordRequest,
			encodeGRPCAddWordResponse,
		),
		deleteWordHandler: grpc.NewServer(
			delete,
			decodeGRPCDeleteWordRequest,
			encodeGRPCAddWordResponse,
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

// ListWords gRPC method
func (s *grpcServer) ListWords(ctx context.Context, req *pb.Empty) (*pb.ListWordsResponse, error) {
	_, resp, err := s.listWordsHandler.ServeGRPC(ctx, req)
	if err != nil {
		return nil, err
	}
	return resp.(*pb.ListWordsResponse), nil
}

// UpdateWord gRPC method
func (s *grpcServer) UpdateWord(ctx context.Context, req *pb.UpdateWordRequest) (*pb.AddResponse, error) {
	_, resp, err := s.updateWordHandler.ServeGRPC(ctx, req)
	if err != nil {
		return nil, err
	}
	return resp.(*pb.AddResponse), nil
}

// DeleteWord gRPC method
func (s *grpcServer) DeleteWord(ctx context.Context, req *pb.DeleteWordRequest) (*pb.AddResponse, error) {
	_, resp, err := s.deleteWordHandler.ServeGRPC(ctx, req)
	if err != nil {
		return nil, err
	}
	return resp.(*pb.AddResponse), nil
}
