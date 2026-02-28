-- AlterTable
ALTER TABLE `Content` ADD COLUMN `sectionType` VARCHAR(191) NULL;

-- Populate sectionType for all existing rows using their current heading as the canonical type.
-- Custom sections created after this migration will have sectionType = NULL.
UPDATE `Content` SET `sectionType` = `heading`;