FROM nginx:stable

COPY dist/ /usr/share/nginx/html/lib

# custom config or somethign
