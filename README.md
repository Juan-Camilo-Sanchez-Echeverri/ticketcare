# TicketCare

TicketCare es una plataforma de gestión de tickets de soporte eficiente y escalable, diseñada para agilizar la comunicación entre clientes y equipos de soporte. Construida con NestJS y MongoDB, ofrece una base sólida para un sistema de soporte técnico moderno.

## Tabla de Contenidos
- [Características Principales](#características-principales)
- [Tecnologías](#tecnologías)
- [Requerimientos](#requerimientos)
- [Clonar el Proyecto](#clonar-el-proyecto)
- [Instalación de Node.js o NVM](#instalación-de-nodejs-o-nvm-node-version-manager)
- [Instalación de Docker](#instalación-de-docker-opcional)
- [Instalar Dependencias](#instalar-dependencias)
- [Configurar Variables de Entorno](#configurar-variables-de-entorno)
- [Ejecutar en Local](#ejecutar-en-local)
- [Desarrollo](#desarrollo)
- [Producción](#producción)
- [Uso de PM2](#uso-de-pm2)
- [Documentación API](#documentación-api)
- [Licencia](#licencia)

## Características principales

* **Creación y seguimiento de tickets:** Permite a los clientes crear tickets de soporte y realizar un seguimiento de su progreso.
* **Asignación y gestión de tickets:** Facilita la asignación de tickets a agentes de soporte y la gestión de su estado.
* **Comunicación entre clientes y agentes:** Permite a los clientes y agentes de soporte comunicarse a través de comentarios en los tickets.
* **Integración con WhatsApp:** Permite la creación directa a través de WhatsApp para una atención más centralizada.
* **Integración con email:** Facilita la creación de tickets a través de correos electrónicos.

## Tecnologías

- **Backend:** NestJS (Node.js)
- **Base de Datos:** MongoDB con Mongoose
- **Autenticación:** JWT
- **Documentación API:** Swagger
- **Almacenamiento:** Sistema de archivos local
- **Email:** IMAP/SMTP

## Requerimientos

- Node.js (v20 o superior)
- npm
- MongoDB (v6 o superior)
- Docker y Docker Compose (opcional)
- PM2 (opcional, para entornos de desarrollo y producción)

## Clonar el Proyecto

Para clonar el proyecto y ubicarse en la carpeta del proyecto, se deben ejecutar los siguientes comandos:

```bash
git clone URL_DEL_REPOSITORIO
cd piemce
```

## Instalación de Node.js o NVM (Node Version Manager)

Si se tiene instalado [Node.js](https://nodejs.org/) o [NVM](https://github.com/nvm-sh/nvm) en el sistema, se puede saltar este paso.

Para instalar Node.js, se debe ejecutar el siguiente comando:

```bash
sudo apt-get update

sudo apt-get install nodejs

# Para verificar la versión de Node.js
node -v
```

Si se desea instalar NVM, se deben ejecutar los siguientes comandos:

```bash
# Descargar e instalar nvm:
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash

# Instalar la última versión de Node.js
nvm install node

# Verificar la instalación:
node -v

# Verificar la instalación de npm:
npm -v
```

## Instalar Dependencias

Para instalar las dependencias, se debe ejecutar el siguiente comando:

```bash
npm install
```

## Configurar Variables de Entorno

Cree los archivos de entorno necesarios en la raíz del proyecto y añada las variables de entorno necesarias. Puede usar el archivo de ejemplo como referencia.

- Para entorno **local**:

  ```bash
  cp .env.example .env.local
  ```

- Para entorno de **desarrollo**:

  ```bash
  cp .env.example .env.development
  ```

- Para entorno de **producción**:

  ```bash
  cp .env.example .env
  ```

Edite los archivos `.env.local`, `.env.development` y `.env` con sus configuraciones.

## Ejecutar en Local

**1. Iniciar la aplicación**

```bash
# Modo normal
npm run start

# Modo watch
npm run start:dev
```

El servidor se ejecutará en `http://localhost:<PORT>` donde `<PORT>` es el puerto configurado en el archivo `.env.local`.

## Desarrollo

Para iniciar el proyecto en un servidor de desarrollo, siga estos pasos:

**1. Iniciar la aplicación con PM2**

```bash
# Primera vez
npm run pm2:start:dev

# Reiniciar después de cambios
npm run pm2:restart:dev
```

El servidor se ejecutará en `http://localhost:<PORT>` donde `<PORT>` es el puerto configurado en el archivo `.env.development`.

## Producción

Para ejecutar el proyecto en producción, siga estos pasos:

**1. Iniciar la aplicación con PM2 (Recomendado)**

```bash
# Primera vez
npm run pm2:start:prod

# Reiniciar después de cambios
npm run pm2:restart:prod
```

El servidor se ejecutará en `http://localhost:<PORT>` donde `<PORT>` es el puerto configurado en el archivo `.env`.

**Alternativa: Ejecutar compilado directamente**

```bash
# 1. Compilar el proyecto
npm run build

# 2. Ejecutar en producción
npm run start:prod
```

## Uso de PM2

PM2 es un administrador de procesos de Node.js que facilita la gestión de aplicaciones en producción y desarrollo. A continuación, se detallan los pasos para instalar y usar PM2.

### Instalación de PM2

Para instalar PM2 globalmente en el sistema, ejecute:

```bash
npm install -g pm2
```

### Uso de PM2 en Desarrollo

Para iniciar la aplicación en modo desarrollo con PM2, ejecute:

```bash
npm run pm2:start:dev
```

Para reiniciar la aplicación en modo desarrollo con PM2, ejecute:

```bash
npm run pm2:restart:dev
```

El servidor se ejecutará en `http://localhost:<PORT>` donde `<PORT>` es el puerto configurado en el archivo `.env.development`.

### Uso de PM2 en Producción

Para iniciar la aplicación en modo producción con PM2, ejecute:

```bash
npm run pm2:start:prod
```

Para reiniciar la aplicación en modo producción con PM2, ejecute:

```bash
npm run pm2:restart:prod
```

El servidor se ejecutará en `http://localhost:<PORT>` donde `<PORT>` es el puerto configurado en el archivo `.env`.

## Documentación API

Una vez que la aplicación esté corriendo, puedes acceder a la documentación interactiva de Swagger en:

```
http://localhost:<PORT>/docs
```

## Licencia

Este proyecto es privado y propietario de Torrente Dev.

