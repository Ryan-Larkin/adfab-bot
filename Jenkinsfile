pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                wrap([$class: 'AnsiColorBuildWrapper', 'colorMapName': 'XTerm']) {
                    sh 'bin/decrypt.sh && bin/clean.sh && bin/install.sh && bin/build.sh'
                }
            }
        }
        stage('Test') {
            steps {
                wrap([$class: 'AnsiColorBuildWrapper', 'colorMapName': 'XTerm']) {
                    sh 'bin/test.sh'
                }
            }
        }
        stage('Deploy') {
            steps {
                wrap([$class: 'AnsiColorBuildWrapper', 'colorMapName': 'XTerm']) {
                    sh 'bin/deploy.sh Continuous'
                }
            }
        }
    }
}
