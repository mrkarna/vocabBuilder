package transport

import (
	"context"

	pb "github.com/mrkarna/vocabBuilder/backend/pb/autogen"
)

// Decoders just pass gRPC types through (no transformation needed)
func decodeGRPCAddWordRequest(_ context.Context, req interface{}) (interface{}, error) {
	return req.(*pb.Word), nil
}

func decodeGRPCEmptyRequest(_ context.Context, req interface{}) (interface{}, error) {
	return req.(*pb.Empty), nil
}

func encodeGRPCAddWordResponse(_ context.Context, resp interface{}) (interface{}, error) {
	return resp, nil
}

func encodeGRPCGetWordResponse(_ context.Context, resp interface{}) (interface{}, error) {
	return resp, nil
}

func encodeGRPCListWordsResponse(_ context.Context, resp interface{}) (interface{}, error) {
	return resp, nil
}
