package service

import (
	"context"
)

// Word represents a word and its meaning.
type Word struct {
	Text      string
	Meaning   string
	Synonyms  []string
	Example   string
	CreatedAt string // RFC3339 timestamp
}

// VocabService defines the core logic interface.
type VocabService interface {
	AddWord(ctx context.Context, word Word) (bool, error)
	GetRandomWord(ctx context.Context) (Word, error)
	ListWords(ctx context.Context) ([]Word, error)
}
