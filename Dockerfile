FROM node:18-alpine as builder

ENV DISABLE_ESLINT_PLUGIN true

ARG REACT_APP_API_BASE_URL

ENV REACT_APP_API_BASE_URL https://lawyer-card.lawyercouncil.or.th/public/api
ENV REACT_APP_AUTH_URL https://lawyer-id24.lawyercouncil.or.th
ENV REACT_APP_LANGUAGE TH
ENV REACT_APP_CLIENT_ID 4855c0d9-d76d-4fd3-97ca-253f1b971e4d
ENV REACT_APP_ID24_CLIENT_ID 4855c0d9-d76d-4fd3-97ca-253f1b971e4d
ENV REACT_APP_VERSION 1.0.2

WORKDIR /app
COPY package*.json ./
RUN npm install --force 
COPY . .

RUN npm run build

FROM nginx

RUN apt-get update \
    && apt-get upgrade -y \
    && apt-get remove -y curl

RUN chgrp -R root /var/cache/nginx && chmod -R 770 /var/cache/nginx
RUN chgrp -R root /var/run && chmod -R 770 /var/run

ADD deploy/default.conf /etc/nginx/conf.d/
RUN mkdir -p /usr/share/nginx/html
COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE 80
