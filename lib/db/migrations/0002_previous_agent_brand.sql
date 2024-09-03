ALTER TABLE `decks` DROP COLUMN `public`;--> statement-breakpoint
ALTER TABLE `decks` ADD `public` integer DEFAULT 0 NOT NULL;