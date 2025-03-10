---
title: "PLAN DE FORMACIÓN DE BACKEND"               # CHANGE IF NEEDED
subtitle: "FISIO FIND - Grupo 6 - #SPRINT 1"
author: [Alberto Carmona Sicre, Antonio Macías Ferrera, Benjamín Ignacio Maureira Flores, Francisco Capote García, Daniel Alors Romero, Daniel Fernández Caballero, Daniel Ruiz López, Daniel Tortorici Bartús, Daniel Vela Camacho, Delfín Santana Rubio, Guadalupe Ridruejo Pineda, Julen Redondo Pacheco, Miguel Encina Martínez, Francisco Mateos Villarejo, Pablo Fernández Pérez, Ramón Gavira Sánchez, Rafael Pulido Cifuentes]
date: "13/02/2025"                                        # CHANGE IF NEEDED
subject: "ISPP"
lang: "es"
toc: true
titlepage: true
titlepage-text-color: "1C1C1C"
titlepage-rule-color: "1C1C1C"
titlepage-rule-height: 0
colorlinks: true
linkcolor: blue
titlepage-background: "../.backgrounds/background1V.pdf"  # CHANGE IF NEEDED
header-left: "PLAN DE FORMACIÓN DE BACKEND"         # CHANGE IF NEEDED
header-right: "13/02/2025"                                # CHANGE IF NEEDED
footer-left: "FISIO FIND"
documentclass: scrartcl
classoption: "table"
header-includes:
  - \usepackage{tabularx}
  - \usepackage{longtable}
---

<!-- COMMENT THIS WHEN EXPORTING TO PDF -->
<p align="center">
  <img src="../.img/Logo_FisioFind_Verde_sin_fondo.PNG" alt="Logo FisioFind" width="300" />
</p>

<h1 align="center" style="font-size: 30px; font-weight: bold;">
  FISIO FIND  -  PLAN DE FORMACIÓN DE BACKEND
</h1>

<br>


**ÍNDICE**
- [1. INTRODUCCIÓN](#1-introducción)
- [2. INSTALACIÓN DE POSTGRESQL 16.8](#2-instalación-de-postgresql-168)
- [3. LANZAR LA APLICACIÓN](#3-lanzar-la-aplicación)
- [4. CREACIÓN DE UN MODELO](#4-creación-de-un-modelo)
<!-- COMMENT THIS WHEN EXPORTING TO PDF -->

<br>

---

**Ficha del documento**

- **Nombre del Proyecto:** Fisio Find

- **Número de Grupo:** Grupo 6

- **Entregable:** #SPRINT 1

- **Miembros del grupo:** Alberto Carmona Sicre, Antonio Macías Ferrera, Benjamín Ignacio Maureira Flores, Francisco Capote García, Daniel Alors Romero, Daniel Fernández Caballero, Daniel Ruiz López, Daniel Tortorici Bartús, Daniel Vela Camacho, Delfín Santana Rubio, Guadalupe Ridruejo Pineda, Julen Redondo Pacheco, Miguel Encina Martínez, Francisco Mateos Villarejo, Pablo Fernández Pérez, Ramón Gavira Sánchez, Rafael Pulido Cifuentes.

- **Autores:** Miguel Encina Martínez, Ramón Gavira Sánchez
- **Fecha de Creación:** 16/02/2025  

- **Versión:** v1.0

<br>


---

**Histórico de Modificaciones**

| Fecha      | Versión | Realizada por                             | Descripción de los cambios |
| ---------- | ------- | ----------------------------------------- | -------------------------- |
| 16/02/2025 | v1.0    | Miguel Encina Martínez, Ramón Gavira Sánchez | Creación del documento. |
| 08/03/2025 | v1.1    | Antonio Macías Ferrera                       | Correcciones menores y exportar a pdf.   |


<br>

<!-- \newpage -->

<br>


# 1. INTRODUCCIÓN

En este documento se especifica el proceso de instalación y configuración de las herramientas necesarias para ejecutar la aplicación en un entorno local. Además, se incluye un ejemplo práctico del desarrollo CRUD (Create, Read, Update, Delete) de la entidad AppUser, junto con referencias a los tutoriales utilizados para su implementación.

# 2. INSTALACIÓN DE POSTGRESQL 16.8
1. **Windows y macOS**: 
   - Descargar el [instalador oficial de PostgreSQL](https://www.postgresql.org/download/)
   - Seguir el asistente de instalación
   - Guardar la contraseña de superusuario proporcionada durante la instalación
   - No es necesario instalar Stack Builder al final del proceso

2. **Configuración inicial**:
   - Abrir pgAdmin 4 (interfaz gráfica de PostgreSQL)
   - Conectarse al servidor PostgreSQL utilizando la contraseña de superusuario
   - En el panel izquierdo, hacer clic derecho en "Databases"
   - Seleccionar "Create" > "Database"
   - Nombre de la base de datos: `fisiofind`
   - Propietario: `postgres`
   - Guardar los cambios

# 3. LANZAR LA APLICACIÓN
1. **Crear y activar el entorno virtual**:
```bash
cd backend
python -m venv venv  # Crear entorno virtual
```
2. Activar el entorno virtual
```python
source venv/bin/activate # Para MacOS/Linux
venv/bin/activate # Para Windows

```
3. 
```shell
pip install -r requirements.txt
```
4. 
```shell
cp .env.example .env
```
Sustituye SECRET_KEY de .env por la clave secreta de Django (Grupo de Avisos de WhatsApp)
Sustituye DATABASE_NAME, DATABASE_USER, DATABASE_PASSWORD por los datos de tu base de datos en PostgresSQL.

- SECRET_KEY : Clave secreta de Django (disponible en el grupo de WhatsApp)
- DATABASE_NAME : Nombre de la base de datos (fisiofind)
- DATABASE_USER : Usuario de PostgreSQL (postgres por defecto)
- DATABASE_PASSWORD : Contraseña establecida durante la instalación
- DATABASE_HOST : localhost
- DATABASE_PORT : 5432

1. 
```python
cd fisio_find
python manage.py makemigrations  # Crear migraciones de la base de datos
python manage.py migrate         # Aplicar migraciones
python manage.py createsuperuser # Crear usuario administrador
python manage.py runserver       # Iniciar servidor de desarrollo
```

# 4. CREACIÓN DE UN MODELO

Para implementar nuevos modelos en la aplicación, se recomienda seguir estos tutoriales en orden:

1. https://www.django-rest-framework.org/tutorial/1-serialization/#tutorial-1-serialization (hasta “Using ModelSerializers”)
- Seguir hasta la sección "Using ModelSerializers"
- Conceptos clave: Modelos, Serializadores, Vistas

2. https://dev.to/entuziaz/django-rest-framework-with-postgresql-a-crud-tutorial-1l34 (A partir de “Creating a REST API with Django Rest Framework”) 
- Comenzar desde "Creating a REST API with Django Rest Framework"
- Implementación práctica de operaciones CRUD

Para realizar consultas a la API, se puede hacer uso de la herramienta de Postman (https://www.postman.com/downloads/) o introduciendo la url correspondiente en cualquier navegador, que te llevará a un asistente de la API de Django.


