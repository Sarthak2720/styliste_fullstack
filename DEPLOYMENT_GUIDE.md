# STYLISTE - Deployment Guide (Production Ready)

This guide provides step-by-step instructions to deploy the STYLISTE fullstack platform (Spring Boot backend + React frontend + MySQL database).

---

## 1. Database Setup (MySQL)

Log in to your MySQL server (via CLI, phpMyAdmin, or MySQL Workbench) as `root` and run the following commands to create the deployment database and user:

```sql
-- 1. Create database
CREATE DATABASE IF NOT EXISTS styliste_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- 2. Create the deployment user
CREATE USER IF NOT EXISTS 'stylist_user'@'%' IDENTIFIED BY 'stylist@321';
CREATE USER IF NOT EXISTS 'stylist_user'@'localhost' IDENTIFIED BY 'stylist@321';

-- 3. Grant full privileges on the database
GRANT ALL PRIVILEGES ON styliste_db.* TO 'stylist_user'@'%';
GRANT ALL PRIVILEGES ON styliste_db.* TO 'stylist_user'@'localhost';

-- 4. Apply changes
FLUSH PRIVILEGES;
```

> **Default Deployment Credentials**:
> - **Host**: `localhost` (or database IP)
> - **Port**: `3306`
> - **Database**: `styliste_db`
> - **Username**: `stylist_user`
> - **Password**: `stylist@321`

---

## 2. Deployment Options

### Option A: Direct JAR Deployment (Ubuntu / Linux VPS / Windows Server)

The project is built as a single unified Spring Boot JAR containing both the backend and the compiled React frontend static assets.

1. **Prerequisites**:
   - Java 17+ JRE or JDK (`openjdk-17-jre-headless`)
   - MySQL 8.x running

2. **Copy Artifact**:
   Upload `styliste/target/styliste-1.0.0.jar` to your server (e.g., `/opt/styliste/app.jar`).

3. **Create Environment File (`/opt/styliste/.env`)**:
   ```bash
   PORT=8010
   SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/styliste_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true&characterEncoding=UTF-8
   SPRING_DATASOURCE_USERNAME=stylist_user
   SPRING_DATASOURCE_PASSWORD=stylist@321
   JWT_SECRET=V++rtkXU/o3lDiqyholA7pqyCDPZpeTgoSP6cYoRB4fwlf9Fq7gdx/EkTK9wZxe6ZDOwgP2UZqzAqL+lJJSbKQ==
   CORS_ALLOWED_ORIGINS=https://styliste-couturier.com,https://www.styliste-couturier.com
   ```

4. **Run Directly**:
   ```bash
   cd /opt/styliste
   java -jar app.jar
   ```

5. **(Recommended) Run as a Systemd Service**:
   Create `/etc/systemd/system/styliste.service`:
   ```ini
   [Unit]
   Description=Styliste Fullstack Application
   After=syslog.target network.target mysql.service

   [Service]
   User=ubuntu
   WorkingDirectory=/opt/styliste
   EnvironmentFile=/opt/styliste/.env
   ExecStart=/usr/bin/java -Xms512m -Xmx1024m -jar /opt/styliste/app.jar
   SuccessExitStatus=143
   Restart=always
   RestartSec=10

   [Install]
   WantedBy=multi-user.target
   ```
   Start and enable on boot:
   ```bash
   sudo systemctl daemon-reload
   sudo systemctl enable styliste
   sudo systemctl start styliste
   ```

---

### Option B: Docker Compose Deployment (1-Command Deploy)

A complete `docker-compose.yml` and multi-stage `Dockerfile` are included in the repository.

1. **Deploy with Docker**:
   ```bash
   # From the project root
   docker compose up -d --build
   ```

2. **What this does**:
   - Launches MySQL 8 container with persistent volume `mysql_data`
   - Builds frontend with Node 20
   - Builds backend with Maven 3.9 + Java 17
   - Bundles and runs the app on port `8010` with persistent volume `uploads_data` for images & banners

---

### Option C: Cloud Deployment (Render / Railway / AWS / DigitalOcean)

- **Port**: `8010` (or dynamic via `${PORT}`)
- **Build Command**:
  ```bash
  cd ecommerce && npm install && npm run build && cd .. && Copy-Item ecommerce/dist/* styliste/src/main/resources/static/ -Recurse -Force && cd styliste && ./mvnw clean package -DskipTests
  ```
- **Start Command**:
  ```bash
  java -jar styliste/target/styliste-1.0.0.jar
  ```

---

## 3. Reverse Proxy & SSL Setup (Nginx)

If hosting on a domain (e.g., `styliste-couturier.com`), configure Nginx to forward traffic to `http://localhost:8010`:

```nginx
server {
    listen 80;
    server_name styliste-couturier.com www.styliste-couturier.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name styliste-couturier.com www.styliste-couturier.com;

    ssl_certificate /etc/letsencrypt/live/styliste-couturier.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/styliste-couturier.com/privkey.pem;

    client_max_body_size 500M;

    location / {
        proxy_pass http://127.0.0.1:8010;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 4. Production Environment Variables Reference

| Variable | Description | Default Value |
| :--- | :--- | :--- |
| `PORT` | HTTP port for the backend | `8010` |
| `SPRING_DATASOURCE_URL` | MySQL JDBC Connection String | `jdbc:mysql://localhost:3306/styliste_db?...` |
| `SPRING_DATASOURCE_USERNAME` | Deployment MySQL User | `stylist_user` |
| `SPRING_DATASOURCE_PASSWORD` | Deployment MySQL Password | `stylist@321` |
| `HIKARI_MAX_POOL_SIZE` | Max active database connections | `15` |
| `SPRING_JPA_HIBERNATE_DDL_AUTO` | Hibernate schema update mode | `update` |
| `JWT_SECRET` | Base64 secret key for authentication | Pre-configured strong key |
| `CORS_ALLOWED_ORIGINS` | Permitted website origins | `https://styliste-couturier.com,...` |
| `GOOGLE_CLIENT_ID` | Google OAuth2 Client ID | Pre-configured production ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth2 Client Secret | Pre-configured production Secret |
| `SPRING_MAIL_USERNAME` | Gmail SMTP sender email | `ashwinimanema@gmail.com` |
| `SPRING_MAIL_PASSWORD` | Gmail SMTP App password | Pre-configured App Password |
| `RAZORPAY_KEY_ID` | Razorpay Live Gateway Key ID | `rzp_live_TkDjPQoSxTSOSM` |
| `RAZORPAY_KEY_SECRET` | Razorpay Live Gateway Secret | Pre-configured Live Secret |
| `SHIPROCKET_EMAIL` | Shiprocket account login | `maneashwini2314@gmail.com` |
| `SHIPROCKET_PASSWORD` | Shiprocket account password | Pre-configured Password |
| `OUTSCRAPER_API_KEY` | Outscraper Reviews API key | Optional (from Outscraper dashboard) |
| `FILE_UPLOAD_DIR` | Image uploads path on server | `uploads/images` |
| `FILE_VIDEO_DIR` | Video uploads path on server | `uploads/videos` |
