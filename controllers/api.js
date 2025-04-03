//Main API routes file

import exoress from "express";
const router = exoress.Router();

import user_api from "./user_api.js";
router.use("/user", user_api);

import subject_api from "./subject_api.js";
router.use("/subject", subject_api);

import question_api from "./question_api.js";
router.use("/question", question_api);

import voting_api from "./voting_api.js";
router.use("/voting", voting_api);

export default router;