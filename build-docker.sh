#!/bin/sh

chmod +x ./build-app.sh
docker run -v "`pwd`/":/app -t --entrypoint "/app/build-app.sh" node:8.11 || exit 1

DOCKER_TAG="`date -u +%Y%m%d-%H%M%S`"

docker build --pull -t mrdunski/game-status:$DOCKER_TAG . || exit 1
docker push mrdunski/game-status:$DOCKER_TAG || exit 1

echo "
apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  name: game-status
  labels:
    app: game-status
spec:
  replicas: 1
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxUnavailable: 1
      maxSurge: 0
  selector:
    matchLabels:
      app: game-status
  template:
    metadata:
      labels:
        app: game-status
    spec:
      containers:
      - name: game-status
        image: mrdunski/game-status:$DOCKER_TAG
        ports:
        - containerPort: 80
        livenessProbe:
          initialDelaySeconds: 60
          httpGet:
            path: /
            port: 80
        readinessProbe:
          httpGet:
            path: /
            port: 80
---
kind: Service
apiVersion: v1
metadata:
  name: game-status
spec:
  selector:
    app: game-status
  ports:
  - protocol: TCP
    port: 80
    targetPort: 80
---
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: game-status
spec:
  rules:
  - host: "game-status.playroom.leanforge.pl"
    http:
      paths:
      - backend:
          serviceName: game-status
          servicePort: 80
" > game-status.yaml
