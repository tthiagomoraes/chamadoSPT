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
CMD ["sh", "-c", "if [ -n \"$DATABASE_URL\" ]; then export JDBC_DATABASE_URL=\"jdbc:postgresql://${DATABASE_URL#postgresql://}\"; fi && java $JAVA_OPTS -jar app.jar"]