package endpoint

import (
	"context"

	"github.com/go-kit/kit/endpoint"
	pb "github.com/mrkarna/vocabBuilder/backend/pb/autogen"
	"github.com/mrkarna/vocabBuilder/backend/service"
)

// MakeAddWordEndpoint wraps the AddWord method.
func MakeAddWordEndpoint(svc service.VocabService) endpoint.Endpoint {
	return func(ctx context.Context, request interface{}) (interface{}, error) {
		req := request.(*pb.Word)
		ok, err := svc.AddWord(ctx, service.Word{
			Text:     req.Text,
			Meaning:  req.Meaning,
			Synonyms: req.Synonyms,
			Example:  req.Example,
		})
		return &pb.AddResponse{Success: ok}, err
	}
}

// MakeGetRandomWordEndpoint wraps the GetRandomWord method.
func MakeGetRandomWordEndpoint(svc service.VocabService) endpoint.Endpoint {
	return func(ctx context.Context, request interface{}) (interface{}, error) {
		word, err := svc.GetRandomWord(ctx)
		if err != nil {
			return nil, err
		}
		return &pb.Word{
			Text:     word.Text,
			Meaning:  word.Meaning,
			Synonyms: word.Synonyms,
			Example:  word.Example,
		}, nil
	}
}
