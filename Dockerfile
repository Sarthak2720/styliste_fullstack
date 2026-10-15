# ==============================================================
# Multi-Stage Production Dockerfile for STYLISTE Fullstack
# ==============================================================

# Stage 1: Build React Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/ecommerce

COPY ecommerce/package*.json ./
RUN npm ci --prefer-offline --no-audit

COPY ecommerce/ ./
RUN npm run build

# Stage 2: Build Spring Boot Backend
FROM maven:3.9.6-eclipse-temurin-17 AS backend-builder
WORKDIR /app/styliste

COPY styliste/pom.xml ./
RUN mvn dependency:go-offline -B

COPY styliste/src ./src
# Copy built frontend assets into static resources
COPY --from=frontend-builder /app/ecommerce/dist ./src/main/resources/static

RUN mvn clean package -DskipTests -B

# Stage 3: Lightweight Production JRE Runtime
FROM eclipse-temurin:17-jre-alpine AS runner
WORKDIR /app

# Install curl for healthcheck
RUN apk add --no-cache curl tzdata

# Set timezone
ENV TZ=UTC

# Create uploads directory
RUN mkdir -p uploads/images uploads/videos

# Copy built JAR from stage 2
COPY --from=backend-builder /app/styliste/target/styliste-*.jar app.jar

EXPOSE 8010

# Healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:8010/index.html || exit 1

ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
