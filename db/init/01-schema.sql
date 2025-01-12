CREATE TABLE menu_items (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price INTEGER NOT NULL,
    has_milk BOOLEAN DEFAULT false
);

CREATE TABLE orders (
    id VARCHAR(50) PRIMARY KEY,
    status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id VARCHAR(50) REFERENCES orders(id),
    menu_item_id VARCHAR(50) REFERENCES menu_items(id),
    ice VARCHAR(20) NOT NULL,
    milk_ratio VARCHAR(20),
    quantity INTEGER NOT NULL,
    price INTEGER NOT NULL,
    CONSTRAINT fk_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    CONSTRAINT fk_menu_item FOREIGN KEY (menu_item_id) REFERENCES menu_items(id)
);

CREATE TABLE admin_session (
    id SERIAL PRIMARY KEY,
    seed VARCHAR(100) NOT NULL,
    update_time TIMESTAMP WITH TIME ZONE DEFAULT '2020-01-01 00:00:00+00'
);

-- 插入初始菜單資料
INSERT INTO menu_items (id, name, description, price, has_milk) VALUES
    ('1', '美式咖啡', '香濃黑咖啡', 60, false),
    ('2', '拿鐵', '牛奶與咖啡結合', 80, true); 

-- 插入初始 seed
INSERT INTO admin_session (seed) VALUES ('tesarearettead');