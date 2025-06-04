# 🛠️ Sistema de Chamados de TI

Este é um sistema web para gerenciamento de chamados de suporte técnico e solicitações de equipamentos de TI, desenvolvido para uso interno de empresas. O objetivo é facilitar a comunicação entre funcionários e o setor de TI, centralizando atendimentos e registros.

---

## 🚀 Funcionalidades

- Abertura de chamados de suporte técnico  
- Solicitação de equipamentos de TI  
- Painel para técnicos visualizarem e se responsabilizarem pelos chamados  
- Histórico de chamados por usuário  
- Controle de acesso por perfil:
  - Administrador
  - Técnico
  - Usuário comum  
- Atribuição manual ou automática de chamados  
- Sistema de mensagens entre técnico e solicitante (canal de comunicação)  
- Visualização de chamados ativos e encerrados  

---

## 🧰 Tecnologias Utilizadas

### Backend
- Django  
- Django REST Framework  

### Frontend
- React  
- Axios  
- Tailwind CSS (ou outra biblioteca de estilo utilizada)

### Outros
- SQLite (para ambiente de desenvolvimento)

---

## ⚙️ Instalação

### Pré-requisitos

- Python 3.10 ou superior  
- Node.js 16 ou superior  
- Git

### Clone o repositório

````markdown
### Clone o repositório

```bash
git clone https://github.com/GermanoBiondi/Sistema_TI/
cd Sistema_TI
```

### Backend (Django)

```bash
cd backend
python -m venv venv
source venv/bin/activate  # No Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend (React)

```bash
cd frontend
npm install
npm start
```
````

👥 **Tipos de Usuário**

**Tipo**       **Permissões**  
Administrador Gerencia usuários, atribui chamados, vê o histórico completo  
Técnico      Visualiza chamados, se responsabiliza, interage com o solicitante  
Usuário      Abre chamados e solicita equipamentos, acompanha o histórico pessoal  

---

📂 **Estrutura do Projeto**

Sistema_TI/  
├── backend/  
│   └── ... (projeto Django)  
├── frontend/  
│   └── ... (projeto React)  
└── README.md  

📌 **Observações**  
Este sistema está em desenvolvimento e pode receber novas funcionalidades conforme a necessidade.  

Atualmente, não há autenticação integrada com serviços externos. A autenticação é simples, via tipo de usuário.  

📄 **Licença**  
Este projeto está licenciado sob a MIT License.  

Desenvolvido por **Germano Alves Biondi** 👨‍💻  
[https://github.com/GermanoBiondi](https://github.com/GermanoBiondi)
