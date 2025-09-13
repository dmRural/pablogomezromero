#!/usr/bin/env node

import Client from "ssh2-sftp-client";
import fs from "fs";
import path from "path";
import { config as loadEnv } from "dotenv";

loadEnv({ path: ".env.local" });

const sftp = new Client();

const sftpConfig = {
  host: process.env.SFTP_HOST,
  port: process.env.SFTP_PORT || 22,
  username: process.env.SFTP_USER,
  password: process.env.SFTP_PASSWORD,
};

const remoteDir = process.env.SFTP_REMOTE_DIR || "/pablogomezromero.com";
const localDir = "./dist";

async function deleteRemoteFiles(sftp, remotePath) {
  try {
    const fileList = await sftp.list(remotePath);

    for (const file of fileList) {
      const fullPath = `${remotePath}/${file.name}`;

      if (file.type === "d") {
        // Es un directorio, recursivamente borrar contenido
        await deleteRemoteFiles(sftp, fullPath);
        await sftp.rmdir(fullPath);
        console.log(`Directorio borrado: ${fullPath}`);
      } else {
        // Es un archivo, borrarlo
        await sftp.delete(fullPath);
        console.log(`Archivo borrado: ${fullPath}`);
      }
    }
  } catch (error) {
    console.error(`Error borrando archivos en ${remotePath}:`, error.message);
  }
}

async function uploadDirectory(sftp, localPath, remotePath) {
  try {
    // Crear directorio remoto si no existe
    try {
      await sftp.mkdir(remotePath, true);
    } catch (error) {
      // El directorio puede ya existir
    }

    const items = fs.readdirSync(localPath);

    for (const item of items) {
      const localItemPath = path.join(localPath, item);
      const remoteItemPath = `${remotePath}/${item}`;

      const stat = fs.statSync(localItemPath);

      if (stat.isDirectory()) {
        // Es un directorio, subirlo recursivamente
        await uploadDirectory(sftp, localItemPath, remoteItemPath);
      } else {
        // Es un archivo, subirlo
        await sftp.put(localItemPath, remoteItemPath);
        console.log(`Subido: ${localItemPath} → ${remoteItemPath}`);
      }
    }
  } catch (error) {
    console.error(`Error subiendo directorio ${localPath}:`, error.message);
    throw error;
  }
}

async function publish() {
  try {
    // Verificar que existan las variables de entorno
    if (!sftpConfig.host || !sftpConfig.username || !sftpConfig.password) {
      throw new Error(
        "Faltan variables de entorno. Asegúrate de que .env.local esté configurado correctamente.",
      );
    }

    // Verificar que existe el directorio dist
    if (!fs.existsSync(localDir)) {
      throw new Error(
        "El directorio dist no existe. Ejecuta primero npm run build.",
      );
    }

    console.log("🚀 Iniciando publicación...");
    console.log(`📡 Conectando a ${sftpConfig.host}:${sftpConfig.port}...`);

    // Conectar al servidor SFTP
    await sftp.connect(sftpConfig);
    console.log("✅ Conectado al servidor SFTP");

    // Subir archivos del directorio dist
    console.log("📤 Subiendo archivos...");
    await uploadDirectory(sftp, localDir, remoteDir);
    console.log("✅ Archivos subidos correctamente");

    // Cerrar conexión
    await sftp.end();
    console.log("🎉 Publicación completada exitosamente!");
  } catch (error) {
    console.error("❌ Error durante la publicación:", error.message);
    process.exit(1);
  }
}

// Ejecutar si se llama directamente
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);

if (process.argv[1] === __filename) {
  publish();
}

export { publish };
