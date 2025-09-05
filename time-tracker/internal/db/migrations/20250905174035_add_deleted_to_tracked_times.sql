-- +goose Up
-- +goose StatementBegin
ALTER TABLE tracked_times
ADD COLUMN deleted BOOLEAN NOT NULL DEFAULT FALSE;
CREATE INDEX idx_times_deleted ON tracked_times (deleted);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP INDEX idx_times_deleted;
ALTER TABLE tracked_times DROP COLUMN deleted;
-- +goose StatementEnd
