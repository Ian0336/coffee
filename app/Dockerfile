FROM node:18-alpine

WORKDIR /app

ENV TZ=Asia/Taipei

# 安裝必要的系統依賴
RUN apk add --no-cache openssl libc6-compat

# 複製配置文件
COPY package*.json ./
COPY prisma ./prisma/
COPY postcss.config.mjs ./
COPY tailwind.config.ts ./
COPY tsconfig.json ./

# 安裝依賴
RUN npm install

# 生成 Prisma Client
RUN npx prisma generate

# 複製其餘檔案
COPY . .

EXPOSE 3000

# 開發模式啟動
CMD ["npm", "run", "dev"]