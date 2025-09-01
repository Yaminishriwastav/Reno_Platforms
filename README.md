# Reno_Platforms
# Reno_Platforms Assignment  
# 🏫 School Management Platform

A simple Next.js application to manage schools with:  
- **Next.js 15 (Turbopack)**  
- **MySQL (hosted on Railway)**  
- **Cloudinary (for image uploads)**  
- **Deployed on Vercel**  

---

## 🚀 Features
- Add new schools with image uploads.  
- View all schools stored in the database.  
- Works locally with MySQL + Cloudinary.  
- Deployed on **Railway (MySQL)** and **Vercel (Frontend + API)**.  

---

## 📦 Tech Stack
- **Frontend:** Next.js 15, React Hook Form  
- **Backend:** Next.js API Routes  
- **Database:** MySQL (Railway)  
- **File Storage:** Cloudinary  
- **Deployment:** Vercel  

---

## 📸 Screenshots

![Home Page Screenshot](./school-directory/screenshots/home.png)  

![Add School Screenshot](./school-directory/screenshots/add-school.png)  

### Show Schools Page
![Show Schools Screenshot](./school-directory/screenshots/show-schools.png)  

---

## ⚙️ Local Setup

### 1. Clone Repo
```bash
git clone https://github.com/your-username/school-management.git
cd school-management
 
### 2. Install Dependencies
npm install

### 3.create .env.local
DATABASE_URL=mysql://username:password@host:port/dbname
CLOUDINARY_URL=cloudinary://<api_key>:<api_secret>@<cloud_name>

### 4 
npm run dev
run at  http://localhost:3000 

Deployment

Vercel Live Demo:
https://reno-platforms-34hvc2j60-yamini-shriwastavs-projects.vercel.app/

📺 Demo Video:
https://youtu.be/lGBE42y5-50 
 