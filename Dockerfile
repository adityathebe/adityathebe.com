FROM node:20-bullseye

WORKDIR /app

# Install required system dependencies for Gatsby and sharp
RUN apt-get update && apt-get install -y \
    build-essential \
    libcairo2-dev \
    libgif-dev \
    libjpeg-dev \
    libpango1.0-dev \
    librsvg2-dev \
    libvips-dev \
    pkg-config \
    python3 \
    python3-pip \
    && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./

RUN npm install --legacy-peer-deps && \
    npm install @parcel/watcher-linux-arm64-glibc

RUN npm install -g gatsby-cli

COPY . .

EXPOSE 8000

CMD ["gatsby", "develop", "-H", "0.0.0.0"]
