FROM nginx:alpine

COPY ./frontend/build /usr/share/nginx/html

RUN chmod -R 755 /usr/share/nginx/html

COPY ./frontend/nginx/default.conf /etc/nginx/conf.d/default.conf

RUN ls -R /usr/share/nginx/html

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
