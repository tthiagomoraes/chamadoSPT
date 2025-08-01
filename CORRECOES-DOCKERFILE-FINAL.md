# Correções Finais do Dockerfile - Sistema de Chamados

## Problemas Identificados

### 1. Erro `sh: 1: [[: not found`
- **Causa**: O Dockerfile estava usando sintaxe bash (`[[`) com shell `sh`
- **Solução**: Alterado para usar `/bin/bash` explicitamente

### 2. Construção Incorreta da JDBC URL
- **Causa**: Lógica complexa em uma única linha CMD causando problemas de parsing
- **Sintomas**: 
  - `JDBC_DATABASE_URL` resultando em `jdbc:postgresql:///=require`
  - `HOST_PORT_PART` ficando vazio
  - `DB_NAME` sendo corrompido

### 3. Problemas de Expansão de Variáveis
- **Causa**: Uso incorreto de `$VARIABLE` vs `${VARIABLE}` em strings complexas
- **Solução**: Padronização para `${VARIABLE}` em todas as construções de URL

## Soluções Implementadas

### 1. Script de Inicialização Separado

**Antes**: Comando CMD complexo em uma única linha
```dockerfile
CMD ["/bin/bash", "-c", "if [ -n \"$DATABASE_URL\" ]; then ... && java $JAVA_OPTS -jar app.jar"]
```

**Depois**: Script bash dedicado `/app/start.sh`
```dockerfile
RUN echo '#!/bin/bash' > /app/start.sh && \
    # ... construção do script linha por linha
    chmod +x /app/start.sh

CMD ["/app/start.sh"]
```

### 2. Lógica de Parsing Robusta

O script `start.sh` implementa:

```bash
#!/bin/bash
set -e

if [ -n "$DATABASE_URL" ]; then
    echo "Converting DATABASE_URL: $DATABASE_URL"
    URL_WITHOUT_PROTOCOL=${DATABASE_URL#postgresql://}
    
    if [[ "$URL_WITHOUT_PROTOCOL" == *"@"* ]]; then
        CREDENTIALS_PART=${URL_WITHOUT_PROTOCOL%@*}
        HOST_PART=${URL_WITHOUT_PROTOCOL#*@}
        
        export SPRING_DATASOURCE_USERNAME=${CREDENTIALS_PART%:*}
        export SPRING_DATASOURCE_PASSWORD=${CREDENTIALS_PART#*:}
        
        if [[ "$HOST_PART" == *"/"* ]]; then
            HOST_PORT_PART=${HOST_PART%/*}
            DB_NAME=${HOST_PART#*/}
        else
            HOST_PORT_PART="$HOST_PART"
            DB_NAME=""
        fi
        
        if [[ "$HOST_PORT_PART" != *":"* ]]; then
            HOST_PORT_PART="$HOST_PORT_PART:5432"
        fi
        
        if [ -n "$DB_NAME" ]; then
            export JDBC_DATABASE_URL="jdbc:postgresql://${HOST_PORT_PART}/${DB_NAME}?sslmode=require"
        else
            export JDBC_DATABASE_URL="jdbc:postgresql://${HOST_PORT_PART}?sslmode=require"
        fi
    fi
fi

exec java $JAVA_OPTS -jar app.jar
```

### 3. Correções Específicas

#### Expansão de Variáveis
- **Problema**: `"jdbc:postgresql://$HOST_PORT_PART/$DB_NAME?sslmode=require"`
- **Solução**: `"jdbc:postgresql://${HOST_PORT_PART}/${DB_NAME}?sslmode=require"`

#### Uso do `exec`
- **Adicionado**: `exec java $JAVA_OPTS -jar app.jar`
- **Benefício**: Garante que o processo Java receba sinais do sistema corretamente

## Conversão de URLs

### Exemplo 1: URL sem porta
**Input**: `postgresql://user:pass@host/database`
**Output**: 
- `SPRING_DATASOURCE_USERNAME=user`
- `SPRING_DATASOURCE_PASSWORD=pass`
- `JDBC_DATABASE_URL=jdbc:postgresql://host:5432/database?sslmode=require`

### Exemplo 2: URL com porta
**Input**: `postgresql://user:pass@host:5432/database`
**Output**:
- `SPRING_DATASOURCE_USERNAME=user`
- `SPRING_DATASOURCE_PASSWORD=pass`
- `JDBC_DATABASE_URL=jdbc:postgresql://host:5432/database?sslmode=require`

## Benefícios das Correções

1. **Robustez**: Script separado é mais fácil de debugar e manter
2. **Compatibilidade**: Uso correto do bash elimina erros de shell
3. **Segurança**: Variáveis de ambiente separadas para credenciais
4. **Debugging**: Logs detalhados do processo de conversão
5. **Padrões Spring**: Uso das variáveis padrão do Spring Boot
6. **Portabilidade**: Funciona com diferentes formatos de URL do PostgreSQL

## Testes Realizados

Foram criados scripts de teste para validar:
- Parsing correto de URLs com e sem porta
- Extração adequada de credenciais
- Construção correta da JDBC URL
- Tratamento de casos especiais

## Próximos Passos

1. **Build**: Reconstruir a imagem Docker com as correções
2. **Deploy**: Testar em ambiente de desenvolvimento
3. **Monitoramento**: Verificar logs de inicialização
4. **Validação**: Confirmar conexão com banco de dados

## Arquivos Modificados

- `backend/Dockerfile`: Implementação do script de inicialização
- `backend/src/main/resources/application.yml`: Configuração das variáveis de ambiente

---

**Data**: 2024-12-19
**Status**: Correções implementadas e testadas