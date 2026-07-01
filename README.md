# Styliste Fullstack

A full-stack e-commerce and appointment booking application with AI-powered measurement technology.

## Project Structure

- **ecommerce/** - Frontend React/TypeScript application (Vite)
- **styliste/** - Backend Java application (Spring Boot)
- **mes_poc/** - Measurement system POC with Python/YOLOv8

## Getting Started

### Frontend (ecommerce)
```bash
cd ecommerce
npm install
npm run dev
```

### Backend (styliste)
```bash
cd styliste
mvn clean install
mvn spring-boot:run
```

### Measurement POC (mes_poc)
```bash
cd mes_poc
pip install -r requirements.txt
python app.py
```

## Documentation

- [Blog Backend API Spec](ecommerce/docs/BLOG_BACKEND_API_SPEC.md)
- [Blog Management Analysis](ecommerce/docs/BLOG_MANAGEMENT_ANALYSIS.md)
- [Blog API Frontend](styliste/docs/BLOG_API_FRONTEND.md)
- [Measurement API Frontend](styliste/docs/MEASUREMENT_API_FRONTEND.md)

## License

MIT
