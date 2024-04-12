pipeline {
    agent any

    tools {
        nodejs 'Node 20' // Correct the tool name as configured in Jenkins
    }

    environment {
        // Define the scanner home environment variable here
        SCANNER_HOME = tool 'sonar-scanner'
    }

    stages {
        stage('Checkout Code from SCM') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'npm install'
            }
        }

        stage('Build') {
            steps {
                bat 'npm run build'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                // Use the environment variable instead of 'def'
                withSonarQubeEnv('server-sonar') { // Replace 'YourSonarQubeEnv' with the actual environment name configured in Jenkins
                    bat "${env.SCANNER_HOME}\\bin\\sonar-scanner"
                }
            }
        }

        stage('Test') {
            steps {
                // Run ESLint test
                echo 'No test cases to run.'
            }
        }

         stage('Generate Coverage Report') {
            steps {
                sh 'npm run coverage' // This will generate an empty coverage report
            }
        }

        // Add Deployment Stages here
    }

    post {
        always {
            cobertura coberturaReportFile: '**/coverage.lcov'
            cleanWs()
        }
        success {
            echo 'Build was successful!'
        }
        failure {
            echo 'Build failed!'
        }
    }
}
