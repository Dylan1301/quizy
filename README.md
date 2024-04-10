# Quizy

## Description:

Quizy is a Kahoot-like platform for creating and participating in interactive quizzes. It features real-time online quizzes, instructor and student functionalities, quiz management, statistics tracking, and compatibility testing for various devices and browsers.

## Features:

- Real-time online quizzes
- Sign in/up with Google
- Quiz creation and management
- Quiz statistics tracking
- Top 3 winners display
- Compatible across devices and browsers

## Prerequisites

- Docker
- Docker Compose

## Installation & Usage

1. Clone the repository:

   ```bash
   git clone git@github.com:swinburne-projects/quizy.git
   ```

2. Start the stack (FE, BE, DB):

   ```bash
   docker-compose up
   ```

3. Access the application:
   - Open the frontend web at `http://localhost`
   - Open API docs at `http://localhost:8000/docs`
   - Open PostgreSQL explorer at `http://localhost:5050`

## Stopping the Application

To stop the application, run `Ctrl + C` in running terminal

## Basic working with GitHub everyday
Before starting a new task, follow these steps:

1. Pull the latest code from the main branch:

   ```bash
   git checkout main
   git pull
   ```

2. Create a new branch for your task:

   ```bash
   git checkout -b your_name/task_name
   ```

3. Make changes and commit them:

   ```bash
   git add .
   git commit -m "Your change notes"
   ```

4. Push your changes to the remote repository:

   ```bash
   git push origin your_name/task_name
   ```

5. Create a pull request:

   - Go to the [GitHub PR page](https://github.com/swinburne-projects/quizy/pulls)
   - Click on 'New pull request'
   - Choose your branch from the dropdown menu
   - Click on 'Create pull request'

6. Let the team know about your PR, paste it to the group chat for review & merge

Remember to replace `your-branch-name` and `Your commit message` with your actual branch name and commit message.
