# Sistema de Gestão Hospitalar e Agendamento Médico

Bem-vindo ao repositório do nosso Produto Mínimo Viável (MVP) focado na gestão hospitalar.

Este projeto foi desenvolvido como trabalho prático para a disciplina de **Análise e Projeto de Sistemas (APS)**, sob a orientação do **Prof. Ricardo Roberto de Lima**. O nosso principal objetivo foi aplicar, na prática, os conceitos teóricos de Engenharia de Software, modelagem UML e padrões de projeto em um cenário desafiador do mundo real.

O sistema nasceu para solucionar um problema comum na área da saúde: a fragmentação das informações. Criamos uma plataforma web unificada que digitaliza e organiza todo o fluxo de uma clínica. O ecossistema cobre desde o momento em que o paciente realiza o cadastro e agenda uma consulta, passando pela emissão do prontuário pelo médico, até o rigoroso controle de internações e alocação de leitos nas enfermarias.

---

## 🛠️ Tecnologias Utilizadas

A arquitetura foi projetada de forma desacoplada, priorizando a segurança, manutenibilidade e performance.

**Backend:**
- Java 17 e Spring Boot 3
- Spring Security e JWT para autenticação stateless
- BCrypt para criptografia de senhas
- Spring Data JPA e MySQL para persistência

**Frontend:**
- React 18 e Next.js 14 (App Router)
- Tailwind CSS para um design limpo, focado em UX/UI
- TypeScript para garantia de tipos e robustez

---

## ✅ Principais Funcionalidades

Mapeando fielmente os requisitos levantados (Documento de Elicitação), o sistema entrega:

- **Autenticação Segura (RF01, RF04):** Controle de acesso com perfis distintos (Admin, Médico, Paciente), totalmente blindado por tokens JWT e criptografia de ponta a ponta nas senhas.

- **Painel Administrativo:** Um dashboard central com métricas dinâmicas sobre a fila de espera e o volume de atendimentos diários.

- **Agendamento Inteligente (RF06):** Fluxo para marcação de consultas que relaciona médicos e pacientes, controlando o ciclo de vida do atendimento (Em Espera, Em Atendimento, Encerrado).

- **Gestão Clínica (RF09, RF12):** Área restrita onde os profissionais médicos analisam o histórico e geram prontuários completos com observações e prescrições medicamentosas.

- **Controle de Enfermaria (RF13, RF16):** Módulo dedicado ao rastreamento em tempo real dos leitos disponíveis e registro do histórico de internação dos pacientes em observação.

---

## 🚀 Como Executar o Projeto Localmente

Se você deseja rodar o projeto na sua máquina para avaliação, siga o passo a passo abaixo:

### 1. Banco de Dados

Certifique-se de ter o MySQL rodando e crie um schema chamado `agendamentos_db`. O Spring Data JPA se encarregará de gerar as tabelas automaticamente.

### 2. Iniciando a API (Backend)

Navegue até a pasta `backend` pelo seu terminal:

```bash
cd backend
./mvnw spring-boot:run
```

O servidor iniciará na porta **8082**. A documentação interativa com todos os endpoints pode ser testada via Swagger acessando [http://localhost:8082/swagger-ui.html](http://localhost:8082/swagger-ui.html).

### 3. Iniciando a Interface (Frontend)

Em um novo terminal, acesse a pasta `frontend`:

```bash
cd frontend
npm install
npm run dev
```

O sistema estará operando e pronto para uso no seu navegador em [http://localhost:3000](http://localhost:3000).

---

Desenvolvido com dedicação pela equipe para apresentar uma solução técnica sólida, aderente às melhores práticas de desenvolvimento de software e pronta para o mercado.
