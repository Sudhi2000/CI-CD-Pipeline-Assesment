pipeline {

    agent any

    options {
        timestamps()
        disableConcurrentBuilds()
    }

    environment {

        REGISTRY = "docker.io/company"
        BACKEND_IMAGE = "backend-api"
        FRONTEND_IMAGE = "frontend-app"
        VERSION = "${BUILD_NUMBER}"

    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {

            parallel {

                stage('Backend Install') {
                    steps {
                        dir('backend') {
                            sh 'npm ci'
                        }
                    }
                }

                stage('Frontend Install') {
                    steps {
                        dir('frontend') {
                            sh 'npm ci'
                        }
                    }
                }

            }
        }

        stage('Unit Tests') {

            parallel {

                stage('Backend Tests') {
                    steps {
                        dir('backend') {
                            sh 'npm test'
                        }
                    }
                }

                stage('Frontend Tests') {
                    steps {
                        dir('frontend') {
                            sh 'npm test'
                        }
                    }
                }

            }
        }

        stage('Static Analysis') {

            steps {

                dir('backend') {
                    sh 'npm run lint || true'
                }

                dir('frontend') {
                    sh 'npm run lint || true'
                }

            }
        }

        stage('Dependency Vulnerability Scan') {

            steps {

                dir('backend') {
                    sh 'npm audit --audit-level=high'
                }

                dir('frontend') {
                    sh 'npm audit --audit-level=high'
                }

            }
        }

        stage('Build Docker Images') {

            steps {

                sh """
                docker build -t $REGISTRY/$BACKEND_IMAGE:$VERSION backend
                docker build -t $REGISTRY/$FRONTEND_IMAGE:$VERSION frontend
                """

            }
        }

        stage('Container Security Scan') {

            steps {

                sh """
                trivy image --exit-code 1 --severity HIGH,CRITICAL $REGISTRY/$BACKEND_IMAGE:$VERSION
                trivy image --exit-code 1 --severity HIGH,CRITICAL $REGISTRY/$FRONTEND_IMAGE:$VERSION
                """

            }
        }

        stage('Push Images') {

            steps {

                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {

                    sh """
                    echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin

                    docker push $REGISTRY/$BACKEND_IMAGE:$VERSION
                    docker push $REGISTRY/$FRONTEND_IMAGE:$VERSION
                    """

                }

            }
        }

        stage('Deploy') {

            steps {

                sh """
                docker pull $REGISTRY/$BACKEND_IMAGE:$VERSION
                docker pull $REGISTRY/$FRONTEND_IMAGE:$VERSION

                docker stop backend || true
                docker rm backend || true

                docker stop frontend || true
                docker rm frontend || true

                docker run -d -p 3000:3000 --name backend $REGISTRY/$BACKEND_IMAGE:$VERSION
                docker run -d -p 80:3000 --name frontend $REGISTRY/$FRONTEND_IMAGE:$VERSION
                """

            }
        }

        stage('Health Check') {

            steps {

                sh """
                sleep 10
                curl -f http://localhost:3000/health
                """

            }
        }

    }

    post {

        success {
            echo "Deployment successful"
        }

        failure {
            echo "Pipeline failed"
        }

        always {
            cleanWs()
        }

    }

}