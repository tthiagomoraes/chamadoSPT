#!/bin/bash

# Script para testar o parsing da URL do PostgreSQL

# URL de exemplo do Render
DATABASE_URL="postgresql://chamados_postgres_t7tl_user:ejoN1n1M43nKqLsrOQVvFMECcN7x0yVA@dpg-d26ij7umcj7s73f20l50-a.oregon-postgres.render.com:5432/chamados_postgres_t7tl"

echo "Original DATABASE_URL: $DATABASE_URL"

# Remover o protocolo postgresql://
URL_WITHOUT_PROTOCOL=${DATABASE_URL#postgresql://}
echo "URL without protocol: $URL_WITHOUT_PROTOCOL"

# Verificar se contém credenciais (tem @)
if [[ "$URL_WITHOUT_PROTOCOL" == *"@"* ]]; then
    echo "URL contains credentials"
    
    # Separar credenciais da parte do host
    CREDENTIALS_PART=${URL_WITHOUT_PROTOCOL%@*}
    HOST_PART=${URL_WITHOUT_PROTOCOL#*@}
    
    echo "Credentials part: $CREDENTIALS_PART"
    echo "Host part: $HOST_PART"
    
    # Extrair username e password
    export SPRING_DATASOURCE_USERNAME=${CREDENTIALS_PART%:*}
    export SPRING_DATASOURCE_PASSWORD=${CREDENTIALS_PART#*:}
    
    echo "Username: $SPRING_DATASOURCE_USERNAME"
    echo "Password: $SPRING_DATASOURCE_PASSWORD"
    
    # Processar a parte do host
    if [[ "$HOST_PART" == *"/"* ]]; then
        HOST_PORT_PART=${HOST_PART%/*}
        DB_NAME=${HOST_PART#*/}
    else
        HOST_PORT_PART="$HOST_PART"
        DB_NAME=""
    fi
    
    echo "Host:Port part: $HOST_PORT_PART"
    echo "Database name: $DB_NAME"
    
    # Adicionar porta padrão se não especificada
    if [[ "$HOST_PORT_PART" != *":"* ]]; then
        HOST_PORT_PART="$HOST_PORT_PART:5432"
    fi
    
    echo "Final Host:Port: $HOST_PORT_PART"
    
    # Construir JDBC URL
    if [ -n "$DB_NAME" ]; then
        export JDBC_DATABASE_URL="jdbc:postgresql://$HOST_PORT_PART/$DB_NAME?sslmode=require"
    else
        export JDBC_DATABASE_URL="jdbc:postgresql://$HOST_PORT_PART?sslmode=require"
    fi
    
    echo "Final JDBC URL: $JDBC_DATABASE_URL"
else
    echo "URL does not contain credentials"
    export JDBC_DATABASE_URL="jdbc:postgresql://$URL_WITHOUT_PROTOCOL?sslmode=require"
    echo "Final JDBC URL: $JDBC_DATABASE_URL"
fi

echo ""
echo "Environment variables that would be set:"
echo "SPRING_DATASOURCE_USERNAME=$SPRING_DATASOURCE_USERNAME"
echo "SPRING_DATASOURCE_PASSWORD=$SPRING_DATASOURCE_PASSWORD"
echo "JDBC_DATABASE_URL=$JDBC_DATABASE_URL"