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

# Comando para executar a aplicação com conversão de URL
CMD ["sh", "-c", "if [ -n \"$DATABASE_URL\" ]; then URL_WITHOUT_PROTOCOL=${DATABASE_URL#postgresql://}; if [[ \"$URL_WITHOUT_PROTOCOL\" == *\"@\"* ]]; then USER_PASS=${URL_WITHOUT_PROTOCOL%@*}; HOST_DB=${URL_WITHOUT_PROTOCOL#*@}; USER=${USER_PASS%:*}; PASS=${USER_PASS#*:}; if [[ \"$HOST_DB\" != *\".\"* ]]; then HOST_DB=\"$HOST_DB.oregon-postgres.render.com:5432\"; fi; export JDBC_DATABASE_URL=\"jdbc:postgresql://$HOST_DB?user=$USER&password=$PASS&sslmode=require\"; else export JDBC_DATABASE_URL=\"jdbc:postgresql://$URL_WITHOUT_PROTOCOL?sslmode=require\"; fi; fi && java $JAVA_OPTS -jar app.jar"]