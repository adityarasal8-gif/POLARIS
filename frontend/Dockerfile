FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

# Expose Vite dev server port
EXPOSE 5173

# Run Vite dev server bound to all interfaces for Docker networking
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
