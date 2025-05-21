CREATE TABLE product (
    id SERIAL,
    image_url TEXT PRIMARY KEY,
    price_per_unit DOUBLE PRECISION,
    medicine_name TEXT,
    description TEXT
);
