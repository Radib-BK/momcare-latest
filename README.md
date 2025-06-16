# MomCare - Maternal Healthcare App

A comprehensive Next.js application designed specifically for expectant mothers, providing essential healthcare services including medication tracking, prescription analysis, skin disease classification, blood donor location, and the new **Calorie Estimator** feature.

## Features

- **Medicine Store**: Access pregnancy-safe medications database
- **Medicine Dates**: Track medication expiry dates and set reminders
- **Skin Disease Classification**: AI-powered skin condition analysis
- **Prescription Analyzer**: Digital prescription analysis
- **Calorie Estimator**: AI-powered food recognition and calorie estimation ⭐ **NEW**
- **Find Blood Donor**: Interactive map for locating blood donors

## 🆕 Calorie Estimator Feature

The Calorie Estimator uses advanced AI to identify food from images and provide calorie estimates per 100 grams.

### How it works:
1. **Upload Image**: Take a photo or upload an image of your food
2. **AI Analysis**: Hugging Face's food-101 model identifies the food type
3. **Calorie Data**: Spoonacular API provides nutritional information
4. **Results**: Get food name, calories per 100g, and confidence score

### Tech Stack:
- **Frontend**: Next.js with React hooks and GSAP animations
- **Backend**: FastAPI Python microservice
- **AI Model**: Hugging Face `nateraw/food-101`
- **Nutrition API**: Spoonacular API
- **Image Processing**: PIL (Python Imaging Library)

## Installation

### Prerequisites
- Node.js 18+ and npm/yarn
- Python 3.8+
- pip (Python package manager)

### 1. Clone the repository
```bash
git clone <repository-url>
cd momcare-latest
```

### 2. Install Frontend Dependencies
```bash
npm install
```

### 3. Setup Python Microservice
```bash
# Navigate to the Python API directory
cd momCareFoodAPI

# Create virtual environment (recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt
```

### 4. Environment Variables
Create a `.env.local` file in the root directory:
```env
# Add any other environment variables as needed
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Running the Application

### Option 1: Run Everything Together (Recommended)
```bash
npm run dev-all
```
This command starts both the Next.js frontend and Python microservice concurrently.

### Option 2: Run Separately

**Terminal 1 - Frontend:**
```bash
npm run dev
```

**Terminal 2 - Python Microservice:**
```bash
npm run start-python
```
or manually:
```bash
cd momCareFoodAPI
python main.py
```

## API Endpoints

### Calorie Estimator
- **POST** `/api/calorie-estimate`
  - Upload food image as multipart/form-data
  - Returns: `{ "food": "Pizza", "calories_per_100g": 266, "confidence": 0.93 }`

### Python Microservice
- **POST** `http://localhost:8000/api/calorie-estimate`
  - Direct endpoint to Python service
- **GET** `http://localhost:8000/`
  - Health check endpoint

## Project Structure

```
momcare-latest/
├── app/                          # Next.js App Router
│   ├── services/
│   │   └── calorie-estimator/
│   │       └── page.jsx          # Calorie Estimator main page
│   │   ├── api/
│   │   │   └── calorie-estimate/
│   │   │       └── route.js          # Next.js API route
│   │   └── page.jsx                  # Homepage
│   ├── components/
│   │   ├── Sidebar.jsx               # Navigation sidebar
│   │   ├── ServiceCard.jsx           # Service preview cards
│   │   └── ui/                       # Reusable UI components
│   └── momCareFoodAPI/
│       ├── main.py                   # FastAPI application
│       └── requirements.txt          # Python dependencies
└── package.json
```

## Technology Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 18** - UI library with hooks
- **Tailwind CSS** - Utility-first CSS framework
- **GSAP** - Animation library
- **Lucide React** - Icon library
- **Radix UI** - Accessible component primitives

### Backend
- **FastAPI** - Python web framework
- **Uvicorn** - ASGI server
- **Hugging Face Transformers** - AI model pipeline
- **Spoonacular API** - Nutrition data
- **PIL** - Image processing

### Development Tools
- **TypeScript** - Type safety
- **Concurrently** - Run multiple commands
- **ESLint** - Code linting

## Usage

### Calorie Estimator
1. Navigate to `/services/calorie-estimator`
2. Upload a food image using drag-and-drop or file selector
3. Click "Estimate Calories" to analyze
4. View results showing detected food, calories per 100g, and confidence

### Other Services
- Access via sidebar navigation or service cards
- Each service provides specialized pregnancy-related healthcare tools

## API Configuration

The Calorie Estimator uses:
- **Hugging Face Model**: `nateraw/food-101` (automatic download)
- **Spoonacular API Key**: `34827ffe67c644eabaa3459cefebfec6`

## Troubleshooting

### Python Dependencies
If you encounter issues with PyTorch or Transformers:
```bash
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu
```

### Port Conflicts
- Frontend runs on `http://localhost:3000`
- Python service runs on `http://localhost:8000`
- Ensure these ports are available

### CORS Issues
The Python service is configured to allow all origins in development. For production, update the CORS settings in `momCareFoodAPI/main.py`.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues or questions, please contact the development team or create an issue in the repository. 

## Screenshots
![image](https://github.com/user-attachments/assets/1abba4c4-fc2d-4f7d-b503-e02d527f72cb)

![image](https://github.com/user-attachments/assets/8b439b54-c748-48d8-b106-0b83fcf3aaf3)

