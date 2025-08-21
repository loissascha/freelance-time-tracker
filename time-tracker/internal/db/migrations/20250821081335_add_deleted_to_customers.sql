-- +goose Up
-- +goose StatementBegin
ALTER TABLE customers
ADD COLUMN deleted BOOLEAN NOT NULL DEFAULT FALSE;
CREATE INDEX idx_customers_deleted ON customers (deleted);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP INDEX idx_customers_deleted;
ALTER TABLE customers DROP COLUMN deleted;
-- +goose StatementEnd
