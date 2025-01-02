FROM nginx:alpine

COPY ./frontend/build /usr/share/nginx/html

COPY ./frontend/nginx/default.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
