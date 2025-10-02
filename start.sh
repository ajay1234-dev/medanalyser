#!/bin/bash

# Start backend on port 8000
cd backend && python app.py &

# Start frontend on port 5000
cd frontend && npm run dev
