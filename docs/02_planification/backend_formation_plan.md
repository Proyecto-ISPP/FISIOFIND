---
title: "PLAN DE FORMACIÓN DE BACKEND"               # CHANGE IF NEEDED
subtitle: "FISIO FIND - Grupo 6 - #DP"
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
- [2. IDENTIFICACIÓN DE LOS INTERLOCUTORES](#2-identificación-de-los-interlocutores)
- [3. PLAN DE LAS COMUNICACIONES](#3-plan-de-las-comunicaciones)
<!-- COMMENT THIS WHEN EXPORTING TO PDF -->

<br>

---

**Ficha del documento**

- **Nombre del Proyecto:** Fisio Find

- **Número de Grupo:** Grupo 6

- **Entregable:** #DP

- **Miembros del grupo:** Alberto Carmona Sicre, Antonio Macías Ferrera, Benjamín Ignacio Maureira Flores, Francisco Capote García, Daniel Alors Romero, Daniel Fernández Caballero, Daniel Ruiz López, Daniel Tortorici Bartús, Daniel Vela Camacho, Delfín Santana Rubio, Guadalupe Ridruejo Pineda, Julen Redondo Pacheco, Miguel Encina Martínez, Francisco Mateos Villarejo, Pablo Fernández Pérez, Ramón Gavira Sánchez, Rafael Pulido Cifuentes.

- **Autores:** Miguel Encina MArtínez, Ramón Gavira Sánchez
- **Fecha de Creación:** 16/02/2025  

- **Versión:** v1.0

<br>


---

**Histórico de Modificaciones**

| Fecha      | Versión | Realizada por                                   | Descripción de los cambios                |
| ---------- | ------- | ----------------------------------------------- | ----------------------------------------- |
| 16/02/2025 | v1.0    | Miguel Encina Martínez                          | Creación del documento              |

<br>

<!-- \newpage -->

<br>


# 1. INTRODUCCIÓN

En este plan se especifica cómo realizar la instalación de las herramientas necesarias para poder ejecutar la aplicación en local. Está acompañado con un ejemplo en código de la realización del CRUD de la entidad de AppUser y con los enlaces de los tutoriales seguidos para la realización de dicho ejemplo.

<br>

# 2. INSTALACIÓN DE POSTGRES SQL
1. Windows y macOS: Descargar [instalador](https://www.postgresql.org/download/) y seguir las instrucciones (ignorar make-builder al final)  
2. Abrir el pgAdmin
3. Conectarse a PostgreSQL utilizando la clave proporcionada en la instalación
4. Crear una database de nombre fisiofind con el usuario postgres

# 3. LANZAR LA APLICACIÓN
1. 
```shell
python -m venv venv
```
2. Windows
```shell
venv/Scripts/activate
```
Linux
```shell
source venv/bin/activate
```
3. 
```shell
cd backend
pip install -r requirements.txt
```
4. 
```shell
cp .env.example .env
```
Sustituye SECRET_KEY de .env por 'django-insecure-u7d%q)oc8jl=zzchf&b8qrehpm3#+l3i+t+)_s$tp^g@v@n#ed'
Sustituye DATABASE_NAME, DATABASE_USER, DATABASE_PASSWORD por los datos de tu base de datos en PostgresSQL
5. 
```shell
cd fisio_find
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

# 4. CREACIÓN DE UN MODELO
Seguir los tutoriales:

-	https://www.django-rest-framework.org/tutorial/1-serialization/#tutorial-1-serialization (hasta “Using ModelSerializers”)
-	https://dev.to/entuziaz/django-rest-framework-with-postgresql-a-crud-tutorial-1l34 (A partir de “Creating a REST API with Django Rest Framework”) 

Para realizar consultas a la API, se puede hacer uso de la herramienta de Postman (https://www.postman.com/downloads/) o introduciendo la url correspondiente en cualquier navegador, que te llevará a un asistente de la API de Django.


