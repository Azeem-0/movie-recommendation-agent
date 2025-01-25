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

## Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables in `.env` file
4. Start ChromaDB service
5. Run the application:
   ```bash
   npm start
   ```


## Environment Variables
To run this project, you'll need to set up the following environment variables in a `.env` file:

- MONGO_URI=MongoDB connection string for the database

- OPENAI_API=OpenAI API key for GPT-4 conversational features

- GOOGLE_GEMINI_API= Google Gemini API key for generating embeddings

## Prerequisites
Before running the project, ensure you have:

1. Node.js installed
2. MongoDB installed and running
3. ChromaDB running locally (required for vector search functionality)
   - ChromaDB can be started using Docker:
     ```bash
     docker run -p 8000:8000 chromadb/chroma

