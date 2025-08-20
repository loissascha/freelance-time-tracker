-- +goose Up
-- +goose StatementBegin
CREATE TABLE customers (
		"id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
		"name" TEXT NOT NULL UNIQUE,
		"created_at" DATETIME DEFAULT CURRENT_TIMESTAMP
	);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE customers;
-- +goose StatementEnd
