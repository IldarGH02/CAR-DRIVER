FROM node:20-alpine

WORKDIR /app

# Установка зависимостей
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Копирование исходников
COPY . .

# Создание директории для БД с правильными правами
RUN mkdir -p /app/api/data && chmod 755 /app/api/data

# Создание пользователя node и установка прав
RUN chown -R node:node /app
USER node

EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/health', (r) => {r.statusCode === 200 ? process.exit(0) : process.exit(1)})"

CMD ["npm", "run", "start"]