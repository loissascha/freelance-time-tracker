-- +goose Up
-- +goose StatementBegin
CREATE TABLE tracked_times (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "customer_id" INTEGER NOT NULL,
    "startTime" DATETIME NOT NULL,
    "endTime" DATETIME NOT NULL,
    "comment" TEXT,
    FOREIGN KEY (customer_id) REFERENCES customers (id)
);
CREATE INDEX idx_tracked_times_customer_id ON tracked_times (customer_id);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP INDEX idx_tracked_times_customer_id;
DROP TABLE tracked_times;
-- +goose StatementEnd
