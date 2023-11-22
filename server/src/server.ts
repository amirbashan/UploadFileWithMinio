import express, { Express, Request, Response } from "express";
import cors from "cors";
import { BucketItem, BucketStream, Client } from "minio";
import multer from "multer";
import { isSvgImage } from "./utils";
import axios from "axios";
import "dotenv/config";

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
  endPoint: process.env.END_POINT || "",
  port: Number(process.env.PORT),
  useSSL: false,
  accessKey: process.env.ACCESS_KEY || "",
  secretKey: process.env.SECRET_KEY || "",
});

const bucketName = process.env.BUCKET_NAME || "demo";

app.post("/uploadImage", upload.single("image"), async (req, res: any) => {
  try {
    const file = req.file as any;
    console.log(req.file);

    const responseFromMinio = await minioClient.putObject(
      bucketName,
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
    const imageUrlPromise = minioClient.presignedGetObject(
      bucketName,
      nameOfFile as string,
    );
    const imageUrl = await imageUrlPromise;
    if (isSvgImage(imageUrl)) {
      console.log("Is svg file");
      const response = await axios.get(imageUrl);
      if (response.status === 200) {
        const svgData = await response.data;
        return res.status(200).send(svgData);
      }
    }
    res.status(200).send(imageUrl);
  } catch (e) {
    throw new Error(`Cant getImageByName ${e}`);
  }
});

app.get("/getImages", async (req: Request, res: Response) => {
  try {
    if (!(await minioClient.bucketExists(bucketName))) {
      console.log(`Bucket ${bucketName} created`);
      await minioClient.makeBucket(bucketName);
    }
    const objects: BucketStream<BucketItem> =
      minioClient.listObjects(bucketName);
    const objectNames: string[] = [];

    for await (const object of objects) {
      objectNames.push(object.name);
    }

    let imageUrls = await Promise.all(
      objectNames.map(async (objectName) => {
        return await minioClient.presignedGetObject(bucketName, objectName);
      }),
    );
    const ImagesWithSvgFileFormat = imageUrls.map(async (url) => {
      if (url.includes(".svg")) {
        const response = await axios.get(url);
        if (response.status === 200) {
          const svgData: string = await response.data;
          return svgData;
        }
      }
      return url;
    });
    res.status(200).send(await Promise.all(ImagesWithSvgFileFormat));
  } catch (error) {
    console.error("Error getting image URLs:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(3002, async () => {
  console.log("Server is running on port 3002...");
});
