pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                sh 'bin/decrypt.sh && bin/clean.sh && bin/install.sh && bin/build.sh'
            }
        }
        stage('Test') {
            steps {
                sh 'bin/test.sh'
            }
        }
        stage('Deploy') {
            steps {
                sh 'bin/deploy.sh Continuous'
            }
        }
    }
}
