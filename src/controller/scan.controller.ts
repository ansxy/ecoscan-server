import * as tf from "@tensorflow/tfjs-node";
import { Request, Response } from "express";
import fs from "fs";
import sharp from "sharp";
import { database } from "../utils/database";

export const predict = async (req: Request, res: Response) => {
  try {
    const file = req.file;
    const modelPath =  "file:///root/ecoscan-server/src/model/model.json";
    const model = await tf.loadLayersModel(modelPath);

    if (!fs.existsSync(file.path)) {
      console.error("Image file does not t found");
      return;
    }

    const imgData = await sharp(file.path).resize(224, 224).toBuffer();

    // Convert image data to a TensorFlow.js tensor
    const inputTensor = tf.node
      .decodeImage(new Uint8Array(imgData), 3)
      .toFloat()
      .div(tf.scalar(255.0))
      .expandDims(0);

    const predictions = model.predict(inputTensor) as tf.Tensor;
    const predictedClassIndex = (await predictions.argMax(1).data())[0];
    const confidence = (await predictions.data())[predictedClassIndex] * 100;
    const result = confidence.toFixed(2);

    const classLabels = [
      "Air Conditioner",
      "Hair Dryer",
      "Iron",
      "Lamp",
      "Laptop",
      "Oven",
      "Refrigerator",
      "Rice Cooker",
      "Television",
      "Vacuum Cleaner",
      "Washing Machine",
    ];
    const predictedClass = classLabels[predictedClassIndex];

    const data = await database.main.findFirstOrThrow({
      where: {
        Object_Name: predictedClass,
      },
    });

    const response = {
      name: data.Object_Name,
      Image: data.Representative_Image,
      "Dampak Produksi Panjang": data.Dampak_Produksi,
      "Dampak Konsumsi Panjang": data.Dampak_Konsumsi,
      "Dampak Disposal Panjang": data.Dampak_Disposal,
      "Dampak Produksi Pendek": data.short_DP,
      "Dampak Konsumsi Pendek": data.short_DK,
      "Dampak Disposal Pendek": data.short_DD,
      Lokasi: data.lokasi,
      "Average Energy": data.avg_Energy,
      Sumber: data.Sumber,
      result: result,
    };

    res.status(200).json({ status: "success", data: response });
  } catch (error) {
    console.log(error)
    res.status(500).send(error);
  }
};

module.exports = { predict };
