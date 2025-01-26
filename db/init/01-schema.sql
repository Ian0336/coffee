CREATE TABLE menu_items (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price INTEGER NOT NULL,
    has_milk BOOLEAN DEFAULT false,
    is_deleted BOOLEAN DEFAULT false,
    series VARCHAR(50) NOT NULL DEFAULT '其他'
);

CREATE TABLE orders (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50),
    user_name VARCHAR(100),
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
    update_time TIMESTAMP WITH TIME ZONE DEFAULT '2020-01-01 00:00:00+00',
    password VARCHAR(100) DEFAULT '1234'
);
-- 精品豆系列

-- 經典手沖
-- 淡淡菸草味，麥芽香
-- $45
-- 經典拿鐵
-- 嚴選冠軍咖啡以及牛奶的組合
-- $60

-- 莊園咖啡豆系列

-- Gayo曼特寧G1
-- 口感黏稠厚實，具有牛奶巧克力、堅果葡萄乾的風味，平衡感極佳
-- $80
-- 谷吉
-- 莓果、覆盆莓、熱帶水果香氣、甜感強韻，回甘
-- $80
-- 仙境花園
-- 玫瑰、桃花，莓果，桃子，黑醋栗，尾韻帶有茶感，甘甜留香
-- $80
-- 聖騎士
-- 玫瑰，莓果，百香，可可，酒釀香，酸值明亮，尾韻豐富焦糖香
-- $100
-- 插入初始菜單資料
INSERT INTO menu_items (id, name, description, price, has_milk, series) VALUES
    ('1', '經典手沖', '淡淡菸草味，麥芽香', 45, false, '精品豆系列'),
    ('2', '經典拿鐵', '嚴選冠軍咖啡以及牛奶的組合', 60, false, '精品豆系列'),
    ('3', 'Gayo曼特寧G1', '口感黏稠厚實，具有牛奶巧克力、堅果葡萄乾的風味，平衡感極佳', 80, false, '莊園咖啡豆系列'),
    ('4', '谷吉', '莓果、覆盆莓、熱帶水果香氣、甜感強韻，回甘', 80, false, '莊園咖啡豆系列'),
    ('5', '仙境花園', '玫瑰、桃花，莓果，桃子，黑醋栗，尾韻帶有茶感，甘甜留香', 80, false, '莊園咖啡豆系列'),
    ('6', '聖騎士', '玫瑰，莓果，百香，可可，酒釀香，酸值明亮，尾韻豐富焦糖香', 100, false, '莊園咖啡豆系列');
-- 插入初始 seed
INSERT INTO admin_session (seed) VALUES ('tesarearettead');
