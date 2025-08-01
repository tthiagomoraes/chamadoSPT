# Multi-stage build para otimizar o tamanho da imagem
FROM maven:3.9.4-eclipse-temurin-21 AS build

# Definir diretório de trabalho
WORKDIR /app

# Copiar pom.xml primeiro para cache de dependências
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copiar código fonte
COPY src ./src

# Compilar o projeto
RUN mvn clean package -DskipTests -B

# Estágio final com JRE
FROM eclipse-temurin:21-jre-jammy

# Criar usuário não-root
RUN groupadd -r spring && useradd -r -g spring spring

# Definir diretório de trabalho
WORKDIR /app

# Copiar JAR do estágio de build
COPY --from=build /app/target/chamados-backend-0.0.1-SNAPSHOT.jar app.jar

# Mudar proprietário dos arquivos
RUN chown -R spring:spring /app
USER spring

# Expor a porta
EXPOSE 8080

# Configurar JVM para containers
ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -Djava.security.egd=file:/dev/./urandom"

# Criar script de inicialização
RUN echo '#!/bin/bash' > /app/start.sh && \
    echo 'set -e' >> /app/start.sh && \
    echo '' >> /app/start.sh && \
    echo 'if [ -n "$DATABASE_URL" ]; then' >> /app/start.sh && \
    echo '    echo "Converting DATABASE_URL: $DATABASE_URL"' >> /app/start.sh && \
    echo '    URL_WITHOUT_PROTOCOL=${DATABASE_URL#postgresql://}' >> /app/start.sh && \
    echo '    echo "URL without protocol: $URL_WITHOUT_PROTOCOL"' >> /app/start.sh && \
    echo '    ' >> /app/start.sh && \
    echo '    if [[ "$URL_WITHOUT_PROTOCOL" == *"@"* ]]; then' >> /app/start.sh && \
    echo '        CREDENTIALS_PART=${URL_WITHOUT_PROTOCOL%@*}' >> /app/start.sh && \
    echo '        HOST_PART=${URL_WITHOUT_PROTOCOL#*@}' >> /app/start.sh && \
    echo '        echo "Credentials: $CREDENTIALS_PART"' >> /app/start.sh && \
    echo '        echo "Host part: $HOST_PART"' >> /app/start.sh && \
    echo '        ' >> /app/start.sh && \
    echo '        export SPRING_DATASOURCE_USERNAME=${CREDENTIALS_PART%:*}' >> /app/start.sh && \
    echo '        export SPRING_DATASOURCE_PASSWORD=${CREDENTIALS_PART#*:}' >> /app/start.sh && \
    echo '        ' >> /app/start.sh && \
    echo '        if [[ "$HOST_PART" == *"/"* ]]; then' >> /app/start.sh && \
    echo '            HOST_PORT_PART=${HOST_PART%/*}' >> /app/start.sh && \
    echo '            DB_NAME=${HOST_PART#*/}' >> /app/start.sh && \
    echo '        else' >> /app/start.sh && \
    echo '            HOST_PORT_PART="$HOST_PART"' >> /app/start.sh && \
    echo '            DB_NAME=""' >> /app/start.sh && \
    echo '        fi' >> /app/start.sh && \
    echo '        ' >> /app/start.sh && \
    echo '        echo "Host:Port: $HOST_PORT_PART"' >> /app/start.sh && \
    echo '        echo "DB Name: $DB_NAME"' >> /app/start.sh && \
    echo '        ' >> /app/start.sh && \
    echo '        if [[ "$HOST_PORT_PART" != *":"* ]]; then' >> /app/start.sh && \
    echo '            HOST_PORT_PART="$HOST_PORT_PART:5432"' >> /app/start.sh && \
    echo '        fi' >> /app/start.sh && \
    echo '        ' >> /app/start.sh && \
    echo '        echo "Final Host:Port: $HOST_PORT_PART"' >> /app/start.sh && \
    echo '        ' >> /app/start.sh && \
    echo '        if [ -n "$DB_NAME" ]; then' >> /app/start.sh && \
        echo '            export JDBC_DATABASE_URL="jdbc:postgresql://${HOST_PORT_PART}/${DB_NAME}?sslmode=require"' >> /app/start.sh && \
        echo '        else' >> /app/start.sh && \
        echo '            export JDBC_DATABASE_URL="jdbc:postgresql://${HOST_PORT_PART}?sslmode=require"' >> /app/start.sh && \
        echo '        fi' >> /app/start.sh && \
    echo '        ' >> /app/start.sh && \
    echo '        echo "Final JDBC_DATABASE_URL: $JDBC_DATABASE_URL"' >> /app/start.sh && \
    echo '        echo "USERNAME: $SPRING_DATASOURCE_USERNAME"' >> /app/start.sh && \
    echo '        echo "PASSWORD: [HIDDEN]"' >> /app/start.sh && \
    echo '    else' >> /app/start.sh && \
    echo '        echo "No credentials in URL"' >> /app/start.sh && \
    echo '        export JDBC_DATABASE_URL="jdbc:postgresql://$URL_WITHOUT_PROTOCOL?sslmode=require"' >> /app/start.sh && \
    echo '        echo "JDBC_DATABASE_URL: $JDBC_DATABASE_URL"' >> /app/start.sh && \
    echo '    fi' >> /app/start.sh && \
    echo 'else' >> /app/start.sh && \
    echo '    echo "No DATABASE_URL provided"' >> /app/start.sh && \
    echo 'fi' >> /app/start.sh && \
    echo '' >> /app/start.sh && \
    echo 'echo "Starting application..."' >> /app/start.sh && \
    echo 'exec java $JAVA_OPTS -jar app.jar' >> /app/start.sh && \
    chmod +x /app/start.sh

# Comando para executar a aplicação
CMD ["/bin/bash", "/app/start.sh"]