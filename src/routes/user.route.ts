import {
  AdminStatistic,
  checkIsUserExist,
  userPrefrence,
  userStatisctic,
} from "../controller/user.controller";
import { createNewRouter } from "../utils/route";

export const userRoute = createNewRouter();

userRoute.post("/prefrence", userPrefrence);
userRoute.post("/save", userPrefrence);
userRoute.get("/check/:firebaseId", checkIsUserExist);
userRoute.get(" /admin", AdminStatistic);
userRoute.get("/statistic/:id", userStatisctic);

module.exports = { userRoute };
