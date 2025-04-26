package service

import (
	"context"
	"errors"
	"math/rand"
	"sync"
)

type vocabService struct {
	mu    sync.RWMutex
	words []Word
}

func NewService() VocabService {
	return &vocabService{
		words: make([]Word, 0),
	}
}

func (s *vocabService) AddWord(ctx context.Context, word Word) (bool, error) {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.words = append(s.words, word)
	return true, nil
}

func (s *vocabService) GetRandomWord(ctx context.Context) (Word, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	if len(s.words) == 0 {
		return Word{}, errors.New("no words added yet")
	}
	idx := rand.Intn(len(s.words))
	return s.words[idx], nil
}
