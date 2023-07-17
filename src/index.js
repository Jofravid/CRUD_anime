import { Console, error } from "console";
import express from "express";
import { readFileSync, writeFileSync } from "fs";
import { parse } from "path";

const archivo = "anime.json";
const app = express();
const PORT = process.env.PORT || 3000;

//MIDDLEWARES
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//METODO GET PARA LEER TODA LA INFORMACION DEL JSON
app.get("/", async (req, res) => {
  try {
    const data = readFileSync(archivo, "utf8");
    const parseData = await JSON.parse(data);

    if (data) return res.status(200).json(parseData);
    throw new Error("Ups, no se encontró el archivo");
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

//METODO GET PARA TRAER LA INFORMACION POR ID
app.get("/id/:id", async (req, res) => {
  try {
    const data = readFileSync(archivo, "utf8");
    const parseData = await JSON.parse(data);
    if (!data) throw new Error("Ups, no se encontró el archivo");
    if (!parseData[req.params.id]) throw new Error("Ups, Anime no encontrado");

    if (data) return res.status(200).json(parseData[req.params.id]);
    throw new Error("Ups, no se encontró el archivo");
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

//METODO GET PARA TRAER LA INFORMACION POR NOMBRE
app.get("/nombre/:nombre", async (req, res) => {
  try {
    const data = readFileSync(archivo, "utf8");
    const parseData = await JSON.parse(data);
    if (!data) throw new Error("Ups, no se encontró el archivo");
    //const anime_nombre  = parseData.filter(a => a.nombre.toUpperCase() === nombre.toUpperCase(req.params));
    const resultado = Object.values(parseData).filter(
      (obj) => obj.nombre.toUpperCase() === req.params.nombre.toUpperCase()
    );
    resultado.forEach((resultado) => {});
    if (!resultado) throw new Error("Ups, Anime no encontrado");

    if (data) return res.status(200).json(resultado);
    throw new Error("Ups, no se encontró el archivo");
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

//METODO POST PARA CREAR UN NUEVO OBJETO Y AGREGARLO AL JSON
app.post("/", async (req, res) => {
  try {
    const anime_nuevo = req.body;
    const data = readFileSync(archivo, "utf8");
    const parseData = await JSON.parse(data);
    if (!data) throw new Error("Ups, no se encontró el archivo");

    const updatedData = JSON.stringify(
      Object.assign(parseData, anime_nuevo, {}),
      null,
      2
    );
    writeFileSync(archivo, updatedData, "utf8");
    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//METODO PUT PARA ACTUALIZAR INFOMRACION DE NOMBRE Y AUTOR DE UN OBJETO SEGUN SU ID
app.put("/actualizar/:id", async (req, res) => {
  try {
    const data = readFileSync(archivo, "utf8");
    const parseData = await JSON.parse(data);
    if (!data) throw new Error("Ups, no se encontró el archivo");
    const anime = parseData[req.params.id];
    if (!anime) throw new Error("Ups, Anime no encontrado");
    anime.nombre = req.body.nombre;
    anime.autor = req.body.autor;

    writeFileSync(archivo, JSON.stringify(parseData, null, 2), (err) => {
      if (err) throw new Error("no se pudo encontrar el archivo");
    });
    res.status(202).json({ message: "se modifico la información del anime " });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//METODO PARA ELIMINAR UN OBJETO POR ID
app.delete("/eliminar/:id", async (req, res) => {
  try {
    const data = readFileSync(archivo, "utf8");
    const parseData = await JSON.parse(data);
    if (!data) throw new Error("Ups, no se encontró el archivo");
    if (!parseData[req.params.id]) throw new Error("Ups, Anime no encontrado");

    if (parseData[req.params.id]) {
      delete parseData[req.params.id];
    }
    writeFileSync(archivo, JSON.stringify(parseData, null, 2));
    res.status(200).json({ message: "anime eliminado" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
app.all("*", (req, res) => {
  res.status(404).json({ message: "Ruta no encontrada" });
});
app.listen(PORT, () =>
  console.log(`Servidor escuchando en el puerto: ${PORT}`)
);
export default app;
