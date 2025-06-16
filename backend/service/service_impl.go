package service

import (
	"context"
	"database/sql"
	"encoding/json"
	"errors"
	"math/rand"

	_ "github.com/mattn/go-sqlite3"
)

type vocabService struct {
	db *sql.DB
}

func NewService() VocabService {
	db, err := sql.Open("sqlite3", "vocab.db")
	if err != nil {
		panic(err)
	}
	// Create table if not exists
	_, err = db.Exec(`CREATE TABLE IF NOT EXISTS words (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		text TEXT NOT NULL UNIQUE,
		meaning TEXT NOT NULL,
		synonyms TEXT,
		example TEXT,
		created_at TEXT DEFAULT (datetime('now'))
	)`)
	if err != nil {
		panic(err)
	}
	return &vocabService{db: db}
}

func (s *vocabService) AddWord(ctx context.Context, word Word) (bool, error) {
	synonymsJSON, err := json.Marshal(word.Synonyms)
	if err != nil {
		return false, err
	}
	_, err = s.db.ExecContext(ctx, `INSERT INTO words (text, meaning, synonyms, example, created_at) VALUES (?, ?, ?, ?, datetime('now'))`,
		word.Text, word.Meaning, string(synonymsJSON), word.Example)
	if err != nil {
		if err.Error() == "UNIQUE constraint failed: words.text" {
			return false, errors.New("word already exists")
		}
		return false, err
	}
	return true, nil
}

func (s *vocabService) GetRandomWord(ctx context.Context) (Word, error) {
	rows, err := s.db.QueryContext(ctx, `SELECT text, meaning, synonyms, example, created_at FROM words`)
	if err != nil {
		return Word{}, err
	}
	defer rows.Close()
	words := []Word{}
	for rows.Next() {
		var w Word
		var synonymsJSON string
		if err := rows.Scan(&w.Text, &w.Meaning, &synonymsJSON, &w.Example, &w.CreatedAt); err != nil {
			return Word{}, err
		}
		json.Unmarshal([]byte(synonymsJSON), &w.Synonyms)
		words = append(words, w)
	}
	if len(words) == 0 {
		return Word{}, errors.New("no words added yet")
	}
	idx := rand.Intn(len(words))
	return words[idx], nil
}

func (s *vocabService) ListWords(ctx context.Context) ([]Word, error) {
	rows, err := s.db.QueryContext(ctx, `SELECT text, meaning, synonyms, example, created_at FROM words`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	words := []Word{}
	for rows.Next() {
		var w Word
		var synonymsJSON string
		if err := rows.Scan(&w.Text, &w.Meaning, &synonymsJSON, &w.Example, &w.CreatedAt); err != nil {
			return nil, err
		}
		json.Unmarshal([]byte(synonymsJSON), &w.Synonyms)
		words = append(words, w)
	}
	return words, nil
}
