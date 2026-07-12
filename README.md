# GearUp Analyst Performance Management System

A full-stack internal review platform built for the **GearUp Africa Analyst Programme**. The system enables analysts to submit mid-semester and end-of-semester self-reviews, and allows managers to read submissions and provide structured feedback — all in a secure, role-based environment.

---

## Overview

The GearUp Analyst Programme runs a structured 3-year analyst development track across two divisions:

- **Data Analytics / Engineering**
- **IB / Corp Finance**

Each semester, analysts complete a structured self-review covering accomplishments, challenges, growth, community contribution and self-ratings. Managers review each submission and provide written feedback with goals for the next period.

---

## Features

### Analyst
- Secure login with email and password
- Submit mid-semester and end-of-semester reviews
- Answer structured reflection questions per semester
- Rate performance across 5 categories
- Select areas worked on from a checklist
- View manager feedback once submitted
- In-app notifications when feedback is received

### Manager
- View all assigned analysts grouped by year group (Year 1, 2, 3)
- See submission and feedback status at a glance
- Read every analyst's full review answers
- Submit structured feedback — rating, strengths, development areas, goals
- Read back previously submitted feedback at any time
- Edit feedback after submission
- In-app notifications when analysts submit reviews

### System
- Role-based access control — analysts cannot see other analysts' data
- Review periods controlled by admin (open/close dates and deadlines)
- Year group progression tracking (Year 1 → Year 2 → Year 3)
- Analyst history preserved after programme completion
- Django admin panel for account and period management

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, React Router, Axios, TanStack Query |
| Backend | Django 5, Django REST Framework |
| Authentication | JWT (djangorestframework-simplejwt) |
| Database | PostgreSQL |
| Styling | Inline React styles (Inter font) |
| Build tool | Vite |

---

## Project Structure

```
analyst-review-system/
├── frontend/                  # React application
│   ├── public/
│   │   └── logo.png           # GearUp Africa logo
│   └── src/
│       ├── contexts/
│       │   └── AuthContext.jsx        # Global auth state
│       ├── pages/
│       │   ├── LoginPage.jsx          # Login for all users
│       │   ├── AnalystDashboard.jsx   # Analyst view + review form
│       │   └── ManagerDashboard.jsx   # Manager view + feedback form
│       ├── App.jsx                    # Routes and role-based navigation
│       └── main.jsx                   # App entry point
│
└── backend/                   # Django API
    ├── core/
    │   ├── settings.py        # Project configuration
    │   └── urls.py            # Root URL router
    └── reviews/
        ├── models.py          # User, Review, Feedback, Notification
        ├── serializers.py     # API data formatting
        ├── views.py           # API endpoint logic
        ├── urls.py            # API routes
        └── admin.py           # Django admin configuration
```

---

## User Roles

| Role | Access |
|---|---|
| **Analyst** | Submit own reviews, view own feedback only |
| **Manager** | View all assigned analysts, read reviews, submit feedback |

> Analyst accounts are created by the manager through the Django admin panel. The manager sets a temporary password and shares it with the analyst directly.

---

## Review Structure

Each review (mid or end of semester) contains:

1. **Personal information** — name, email, year & semester, track, date
2. **Self-reflection** — 8 structured questions covering accomplishments, challenges, growth, community and development goals
3. **Performance ratings** — 5-category grid (Technical skills, Miniships & real-world, Personal & prof dev, Community contribution, Applying guidance given)
4. **Areas worked on** — checklist of 10 skill areas
5. **Overall self-rating** — 1 to 5 scale

---

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- PostgreSQL 14+

### Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate     # Mac/Linux
pip install -r requirements.txt
```

Create a `.env` file in the `backend` folder:

```
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
DB_NAME=gearup_reviews
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_HOST=localhost
DB_PORT=5432
```

Run migrations and create admin account:

```bash
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

Django admin available at: `http://localhost:8000/admin`

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

App runs at: `http://localhost:5173`

---

## Environment Variables

| Variable | Description |
|---|---|
| `SECRET_KEY` | Django secret key — keep this private |
| `DEBUG` | Set to `False` in production |
| `DB_NAME` | PostgreSQL database name |
| `DB_USER` | PostgreSQL username |
| `DB_PASSWORD` | PostgreSQL password |
| `DB_HOST` | Database host |
| `DB_PORT` | Database port (default 5432) |

---

## Roadmap

- [ ] Connect React frontend to Django API
- [ ] Password change on first login
- [ ] Email notifications via SMTP
- [ ] PDF export of reviews and feedback
- [ ] Analytics dashboard for programme leads
- [ ] Mobile responsive improvements

---

## Built by

Developed as an internal tool for the **GearUp Africa Analyst Programme**.

> This is a private repository. Access is by invitation only.