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
                echo 'SonarQube Analysis code commented for now'
                /*
                withSonarQubeEnv('server-sonar') { 
                    bat "${env.SCANNER_HOME}\\bin\\sonar-scanner"
                }*/
            }
        }

        stage('Test') {
            steps {
                echo 'No test cases to run.'
            }
        }

         stage('Generate Coverage Report') {
            steps {
                bat 'if not exist .nyc_output mkdir .nyc_output'
                bat 'npm run coverage' // This will generate an empty coverage report
            }
        }

        stage('Docker Build and Push') {
            steps {
                script {
                    def buildNumber = BUILD_NUMBER // Use Groovy's variable assignment
                    bat "docker build -t jjtan1996/medika-app:${buildNumber} ."
                    bat "docker push jjtan1996/medika-app:${buildNumber}"
                }
            }
        }

        stage('Deploy to Dev Env') {
            steps {
                echo 'Deploying to Development Environment...'
                bat 'docker pull jjtan1996/medika-app:%BUILD_NUMBER%'
                bat 'docker rm -f medika-dev || true'
                bat 'docker run -d --name medika-dev -p 8080:80 jjtan1996/medika-app:%BUILD_NUMBER%'
            }
        }

        stage('Deploy to QAT Env') {
            steps {
                echo 'Deploying to QAT Environment...'
                bat 'docker pull jjtan1996/medika-app:%BUILD_NUMBER%'
                bat 'docker rm -f medika-qat || true'
                bat 'docker run -d --name medika-qat -p 8081:80 jjtan1996/medika-app:%BUILD_NUMBER%'
            }
        }

        stage('Deploy to Staging Env') {
            steps {
                echo 'Deploying to Staging Environment...'
                bat 'docker pull jjtan1996/medika-app:%BUILD_NUMBER%'
                bat 'docker rm -f medika-staging || true'
                bat 'docker run -d --name medika-staging -p 8082:80 jjtan1996/medika-app:%BUILD_NUMBER%'
            }
        }

        stage('Deploy to Production Env') {
            steps {
                echo 'Deploying to Production Environment...'
                bat 'docker pull jjtan1996/medika-app:%BUILD_NUMBER%'
                bat 'docker rm -f medika-prod || true'
                bat 'docker run -d --name medika-prod -p 8083:80 jjtan1996/medika-app:%BUILD_NUMBER%'
            }
        }

    }

    post {
        always {
            cobertura coberturaReportFile: 'coverage/cobertura-coverage.xml'
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
