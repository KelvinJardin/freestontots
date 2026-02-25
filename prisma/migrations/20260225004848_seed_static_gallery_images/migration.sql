-- Insert static gallery images (idempotent via INSERT IGNORE on unique filename)
INSERT IGNORE INTO `GalleryImage` (`id`, `filename`, `url`, `inGallery`, `createdAt`, `updatedAt`) VALUES
  (LOWER(REPLACE(UUID(), "-", "")), "img_inside1.jpg",  "/images/img_inside1.jpg",  true, NOW(), NOW()),
  (LOWER(REPLACE(UUID(), "-", "")), "img_inside2.jpg",  "/images/img_inside2.jpg",  true, NOW(), NOW()),
  (LOWER(REPLACE(UUID(), "-", "")), "img_inside3.jpg",  "/images/img_inside3.jpg",  true, NOW(), NOW()),
  (LOWER(REPLACE(UUID(), "-", "")), "img_outside1.jpg", "/images/img_outside1.jpg", true, NOW(), NOW()),
  (LOWER(REPLACE(UUID(), "-", "")), "img_outside2.jpg", "/images/img_outside2.jpg", true, NOW(), NOW()),
  (LOWER(REPLACE(UUID(), "-", "")), "img_outside3.jpg", "/images/img_outside3.jpg", true, NOW(), NOW()),
  (LOWER(REPLACE(UUID(), "-", "")), "img_outside4.jpg", "/images/img_outside4.jpg", true, NOW(), NOW());
