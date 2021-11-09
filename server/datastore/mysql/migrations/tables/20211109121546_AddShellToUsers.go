package tables

import (
	"database/sql"
)

func init() {
	MigrationClient.AddMigration(Up_20211109121546, Down_20211109121546)
}

func Up_20211109121546(tx *sql.Tx) error {
	_, err := tx.Exec("ALTER TABLE host_users ADD COLUMN shell varchar(255) DEFAULT NULL")
	return err
}

func Down_20211109121546(tx *sql.Tx) error {
	return nil
}
