# Movie Recommendation Agent

## Overview
The **Movie Recommendation Agent** is an interactive, AI-powered system designed to provide personalized movie recommendations. It leverages vector search and conversational intelligence to understand user preferences and refine suggestions dynamically.

## Features
- Engages users with probing questions to uncover detailed movie preferences
- Dynamically generates follow-up questions based on user responses using OpenAI's GPT model
- Utilizes a vector database (Chroma) for efficient similarity search
- Matches user queries with the most relevant movies using precomputed embeddings
- Captures user satisfaction after each recommendation cycle
- Maintains detailed logs of user interactions including initial queries, suggested movies, and responses

## Technologies Used
- Node.js for backend
- MongoDB for data storage
- Chroma for vector search
- Google Gemini API for embeddings
- OpenAI GPT-4 for conversational interaction
- Inquirer.js for CLI interface
- Winston for logging