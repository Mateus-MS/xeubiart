-- 1. Main Works Table
CREATE TABLE tb_works (
    id UUID PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    style VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    visible BOOLEAN NOT NULL,

    -- Embedded Thumbnail attributes
    thumbnail_url VARCHAR(255),
    thumbnail_width INT,
    thumbnail_height INT
);

-- 2. ElementCollection Table for Work Photos (Order-preserved)
CREATE TABLE tb_work_photos (
    work_id UUID NOT NULL,
    photo_order INT NOT NULL,
    url VARCHAR(255) NOT NULL,
    width INT NOT NULL,
    height INT NOT NULL,

    PRIMARY KEY (work_id, photo_order),
    CONSTRAINT fk_tb_work_photos_work
        FOREIGN KEY (work_id)
            REFERENCES tb_works (id)
            ON DELETE CASCADE
);

-- Index for fast lookup on photos by work ID
CREATE INDEX idx_tb_work_photos_work_id ON tb_work_photos (work_id);