import express, { Express, Request, Response } from "express";
import cors from "cors";
import { BucketItem, BucketStream, Client } from "minio";
import multer from "multer";
import streamifier from "streamifier";

const app: Express = express();

const options: cors.CorsOptions = {
  origin: "*",
  methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
};
app.use(cors(options));
app.use(express.json());

const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage: storage });

const minioClient = new Client({
  endPoint: "localhost",
  port: 9000,
  useSSL: false,
  accessKey: "5v1zaPHtCTDVHLEhzNqP",
  secretKey: "Qgjwa5nqyiO1sPLlbHCu6scjjXtv4YEeyCjlUXQh",
});

app.post("/uploadImage", upload.single("image"), async (req, res: any) => {
  try {
    const file = req.file as any;
    console.log(req.file);

    const responseFromMinio = await minioClient.putObject(
      "demo",
      file.originalname,
      file.buffer,
      {
        "Content-Type": file.type,
      },
    );
    console.log("responseFromMinio", responseFromMinio);

    res.sendStatus(200);
  } catch (e) {
    throw new Error("Cant upload image");
  }
});

app.get("/getImageByName", async (req, res) => {
  try {
    const nameOfFile = req.query.name;
    const imageUrl = minioClient.presignedGetObject(
      "demo",
      nameOfFile as string,
    );
    res.status(200).send(await imageUrl);
  } catch (e) {
    throw new Error(`Cant getImageByName ${e}`);
  }
});

app.get("/getImages", async (req: Request, res: Response) => {
  try {
    const objects: BucketStream<BucketItem> = minioClient.listObjects("demo");
    const objectNames: string[] = [];

    for await (const object of objects) {
      objectNames.push(object.name);
    }

    const imageUrls = await Promise.all(
      objectNames.map(async (objectName) => {
        return await minioClient.presignedGetObject("demo", objectName);
      }),
    );
    res.status(200).send(imageUrls);
  } catch (error) {
    console.error("Error getting image URLs:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(3002, async () => {
  console.log("Server is running on port 3002...");
});
