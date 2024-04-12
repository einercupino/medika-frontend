pipeline {
    agent any

    tools {
        // Ensure that NodeJS is installed on Jenkins agents
        nodejs 'node-20'
    }

    stages {
        stage('Checkout Code from SCM') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                // Installs the project dependencies from package.json
                bat 'npm install'
            }
        }

        stage('Build') {
            steps {
                // Runs the Vite build process
                bat 'npm run build'
            }
        }

        stage('SonarQube Analysis') {
                def scannerHome = tool 'sonar-scanner';
                withSonarQubeEnv() {
                bat "${scannerHome}/bin/sonar-scanner"
            }
        }

        stage('Test') {
            steps {
                // run eslint test 
                bat 'npm run lint'
             
            }
        }

        // Add Deployment Stages here
    }

    post {
        always {
            // Clean up workspace after build to save space
            cleanWs()
        }
        success {
            // What to do if the build succeeds
            echo 'Build was successful!'
            // Optionally send notifications or trigger other jobs
        }
        failure {
            // What to do if the build fails
            echo 'Build failed!'
            // Optionally send notifications or perform some recovery steps
        }
    }
}
