node ('docker') {
    stage('build docker') {
        withCredentials([usernamePassword(credentialsId: 'docker', passwordVariable: 'password', usernameVariable: 'user')]) {
            sh "docker login -u $user -p $password"
            checkout scm
            sh 'chmod +x ./build-docker.sh'
            sh "./build-docker.sh"
            archiveArtifacts 'game-status.yaml'
            stash includes: 'game-status.yaml', name: 'game-status.yaml'
        }
    }
}
