-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Content" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "heading" TEXT NOT NULL,
    "subHeading" TEXT,
    "text" TEXT,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Content" ("heading", "id", "subHeading", "text", "updatedAt") SELECT "heading", "id", "subHeading", "text", "updatedAt" FROM "Content";
DROP TABLE "Content";
ALTER TABLE "new_Content" RENAME TO "Content";
CREATE UNIQUE INDEX "Content_heading_key" ON "Content"("heading");
CREATE TABLE "new_OpenTimes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "day" TEXT NOT NULL,
    "morningOpen" TEXT,
    "morningClose" TEXT,
    "afternoonOpen" TEXT,
    "afternoonClose" TEXT,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_OpenTimes" ("afternoonClose", "afternoonOpen", "day", "id", "morningClose", "morningOpen", "updatedAt") SELECT "afternoonClose", "afternoonOpen", "day", "id", "morningClose", "morningOpen", "updatedAt" FROM "OpenTimes";
DROP TABLE "OpenTimes";
ALTER TABLE "new_OpenTimes" RENAME TO "OpenTimes";
CREATE TABLE "new_TermDates" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "term" TEXT NOT NULL,
    "startDate" DATETIME,
    "endDate" DATETIME,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_TermDates" ("endDate", "id", "startDate", "term", "updatedAt") SELECT "endDate", "id", "startDate", "term", "updatedAt" FROM "TermDates";
DROP TABLE "TermDates";
ALTER TABLE "new_TermDates" RENAME TO "TermDates";
CREATE UNIQUE INDEX "TermDates_term_key" ON "TermDates"("term");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
