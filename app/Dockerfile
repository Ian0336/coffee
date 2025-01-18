# 使用 Debian 基底映像
FROM node:18

# 設定工作目錄
WORKDIR /app

# 設定時區
ENV TZ=Asia/Taipei

# 更新 apt 並安裝必要的系統依賴
RUN apt-get update && apt-get install -y openssl libpq-dev postgresql-client && rm -rf /var/lib/apt/lists/*

# 複製 Prisma 檔案與 package.json
COPY prisma ./prisma/
COPY package*.json ./

# 安裝依賴
RUN npm install

# 複製其餘程式碼
COPY . .

# 生成 Prisma Client
RUN npx prisma generate

# 暴露應用程式埠
EXPOSE 3000

# 開發模式啟動
# CMD npm run dev

# 生產模式啟動
RUN npm run build
CMD npm run start