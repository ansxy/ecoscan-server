import { item, users } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { Request, Response } from "express";
import { database } from "../utils/database";

export const userPrefrence = async (req: Request, res: Response) => {
  try {
    const { firebaseId, kwhId, name }: users = req.body;

    const data = await database.users.create({
      data: {
        firebaseId: firebaseId,
        name: name,
        kwh: {
          connect: {
            id: kwhId,
          },
        },
      },
    });

    return res.status(201).json({ status: "success", data: data });
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      return res.status(409).json({ status: "fail", error: error.message });
    }
    console.log(error);
    return res.status(500).json({ error: error });
  }
};

const saveItem = async (req: Request, res: Response) => {
  try {
    const { userId, objectName }: item = req.body;
    const data = await database.item.create({
      data: {
        userId: userId,
        objectName: objectName,
      },
    });

    return res.status(201).json({
      status: "success",
      data: data,
    });
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      return res.status(409).json({
        status: "fail",
        message: error.message,
      });
    }
    return res.status(500).json({
      error: error,
    });
  }
};

export const checkIsUserExist = async (req: Request, res: Response) => {
  const { firebaseId } = req.params;
  try {
    const data = await database.users.findFirst({
      where: {
        firebaseId: firebaseId as string,
      },
    });
    return res.status(200).json({
      status: "success",
      isExist: data ? true : false,
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      error: error,
    });
  }
};

export const userStatisctic = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const data = await database.item.findMany({
      where: {
        userId: parseInt(id),
      },
      include: {
        main: {
          select: {
            avg_Energy: true,
          },
        },
      },
    });

    const totalAvgEnergy = data.reduce((total, item) => {
      return total + (item.main ? item.main.avg_Energy : 0);
    }, 0);

    return res.status(200).json({
      status: "success",
      data: data,
      AvgDaily: totalAvgEnergy,
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      error: error,
    });
  }
};

export const AdminStatistic = async (req: Request, res: Response) => {
  try {
    const data = await database.item.findMany({
      include: {
        main: {
          select: {
            avg_Energy: true,
          },
        },
      },
    });

    const totalAvgEnergy = data.reduce((total, item) => {
      return total + (item.main ? item.main.avg_Energy : 0);
    }, 0);

    return res.status(200).json({
      status: "success",
      data: data,
      AvgDaily: totalAvgEnergy,
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      error: error,
    });
  }
};

module.exports = {
  userPrefrence,
  saveItem,
  checkIsUserExist,
  userStatisctic,
  AdminStatistic,
};
