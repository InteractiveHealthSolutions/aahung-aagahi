# Base Alpine Linux image containing Tomcat 8
FROM tomcat:8-alpine

LABEL maintainer="owais.hussain@ihsinformatics.com"

# Expose port 8080 to public
EXPOSE 8080

# Deploy the web archive file to tomcat directory
COPY /target/aahung-aagahi.war /usr/local/tomcat/webapps/aahung-aagahi.war

# Run Catalina service
CMD ["catalina.sh", "run"]
