'use strict';

import helmet from "helmet";
import express from "express"
import bodyParser from "body-parser"
import dotenvSafe from "dotenv-safe"
import { _db, dbMiddleware } from "./middlewares/databaseMiddleware"
import { fetchUser } from "./auth";
import jwt from 'jsonwebtoken'
import { verifyCookieJwtAuth } from "./middlewares/cookieJwtAuthMiddleware";
import cookieParser from 'cookie-parser'
dotenvSafe.config()

const { APP_PORT, APP_HOST } = process.env

// Constants
const PORT = APP_PORT ?? 8080;
const HOST = APP_HOST ?? '0.0.0.0';

// App
const app = express();

app.use(helmet())
app.use(cookieParser())
app.use(bodyParser.json({ type: 'application/json' }))
app.use(dbMiddleware())
app.post('/auth', async (req, res) => {
  const db = req.db

  const user = await fetchUser(req.body.email, req.body.password, db)
  if (!user) {
    res.status(400).json({
      error: "Invalid email or password"
    })
  }

  const accessToken = jwt.sign(user, process.env.AUTH_TOKEN_SECRET, { expiresIn: process.env.AUTH_ACCESS_TOKEN_EXPIRATION });
  const refreshToken = jwt.sign(user, process.env.AUTH_TOKEN_SECRET, { expiresIn: process.env.AUTH_REFRESH_TOKEN_EXPIRATION });  
  return res
  .status(200)  
  .cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'strict' })
  .header('Authorization', accessToken)
  .send({
    message: 'Login Successful',
    data: user
  })
});
app.use(verifyCookieJwtAuth())

app.post('/auth/refresh', async(req, res) => {
  const refreshToken = req.cookies['refreshToken'];
  if (!refreshToken) {
    return res.status(401).send('Access Denied. No refresh token provided.');
  }

  try {
    const {exp, ...user} = jwt.verify(refreshToken, process.env.AUTH_TOKEN_SECRET);
    const accessToken = jwt.sign(user, process.env.AUTH_TOKEN_SECRET, { expiresIn: process.env.AUTH_ACCESS_TOKEN_EXPIRATION });
    return res
      .header('Authorization', accessToken)
      .send({
        message: 'Access Token Refreshed Sucessfuly',
        data: {exp, ...user}
      });
  } catch (error) {
    return res.status(400).send('Invalid refresh token.');
  }
});
app.get('/questionnaires', async (req, res) => {
  const questionniares = await _db(req).select('id', 'title', 'description', 'questions', 'createdAt', 'updatedAt', 'archivedAt').from('Questionnaires')
  return res.status(200).json({
    message: 'Questionnaires Fetching Successful',
    data: questionniares.length > 0 ? questionniares : []
  })
});
app.get('/questionnaires/:id', async (req, res) => {
  const questionnaireId = req.params?.id
  const questionniare = (await _db(req).select('id', 'title', 'description', 'questions', 'createdAt', 'updatedAt', 'archivedAt').from('Questionnaires').where('id', questionnaireId))[0]
  return res.status(200).json({
    message: 'Questionnaire Fetching Successful',
    data: questionniare ?? {}
  })
});
app.post('/questionnaires/create', async (req, res) => {
  if(!req.user?.isAdmin) {
    return res.status(403).json({
      error: 'Forbidden'
    })
  }
  const createPayload = {
    title: req.body.title,
    description: req.body.description,
    questions: req.body.questions,
    createdAt: new Date(),
    updatedAt: new Date()
  }
  const createQuestionnaire = await _db(req).insert(createPayload).into('Questionnaires')
  if (createQuestionnaire.rowCount <= 0) {
    return res.status(400).json({
      error: 'Creation of questionnaire failed'
    })
  }
  return res.status(200).json({
    message: 'Questionnaire Creation Successful',
    data: {}
  })
});
app.post('/questionnaires/update/:id', async (req, res) => {
  if(!req.user?.isAdmin) {
    return res.status(403).json({
      error: 'Forbidden'
    })
  }
  
  const questionnaireId = req.params?.id
  const updatePayload = {
    ...req.body,
    updatedAt: new Date()
  }
  const updateQuestionnaire = await _db(req)('Questionnaires').update({ ...updatePayload }, ['id']).where('id', questionnaireId)
  if (updateQuestionnaire.rowCount <= 0) {
    return res.status(400).json({
      error: 'Modification of questionnaire failed'
    })
  }
  return res.status(200).json({
    message: 'Questionnaire Modification Successful',
    data: {}
  })
});
app.get('/answers', async (req, res) => {
  const answers = await _db(req).select('id', 'userId', 'questionnaireId', 'answers', 'createdAt', 'updatedAt').from('UserQuestionnaires')
  return res.status(200).json({
    message: 'Answers Fetching Successful',
    data: answers.length > 0 ? answers : []
  })
});
app.get('/answers/:id', async (req, res) => {
  const answerId = req.params?.id
  const answer = (await _db(req).select('id', 'userId', 'questionnaireId', 'answers', 'createdAt', 'updatedAt').from('UserQuestionnaires').where('id', answerId))[0]
  return res.status(200).json({
    message: 'Answer Fetching Successful',
    data: answer ?? {}
  })
});
app.post('/answers/create', async (req, res) => {
  const { answers, questionnaireId } = req.body
  const submitPayload = {
    questionnaireId: questionnaireId,
    userId: req.user.id,
    answers: answers,
    createdAt: new Date(),
    updatedAt: new Date()
  }
  const fetchQuestionnaire = (await _db(req).select('id', 'questions').from('Questionnaires').where('id', questionnaireId))[0]
  const questions = fetchQuestionnaire.questions
  if (questions.length !== answers.length) {
    return res.status(400).json({
      error: 'Questions and Answers length should match'
    })
  }

  const submitQuestionnaire = await _db(req).insert({ ...submitPayload }).into('UserQuestionnaires')
  if (submitQuestionnaire.rowCount <= 0) {
    res.status(400).json({
      error: 'Creation of answer failed'
    })
  }
  return res.status(200).json({
    message: 'Answer Creation Successful',
    data: {}
  })
});
app.post('/answers/update/:id', async (req, res) => {
  const answerId = req.params?.id
  const answers = req.body.answers
  const submitPayload = {
    answers,
    updatedAt: new Date()
  }
  const fetchAnswer = (await _db(req).select('id', 'questionnaireId', 'answers').from('UserQuestionnaires').where('id', answerId))[0]
  if (!fetchAnswer) {
    return res.status(404).json({
      error: 'Queried answer does not exist'
    })
  }
  const fetchQuestionnaire = (await _db(req).select('id', 'questions').from('Questionnaires').where('id', fetchAnswer.questionnaireId))[0]
  const questions = fetchQuestionnaire.questions
  if (questions.length !== answers.length) {
    return res.status(400).json({
      error: 'Questions and Answers length should match'
    })
  }
  const updateAnswer = await _db(req)('UserQuestionnaires').update({ ...submitPayload }, ['id']).where('id', answerId)
  if (updateAnswer.rowCount <= 0) {
    return res.status(400).json({
      error: 'Modification of answer failed'
    })
  }
  return res.status(200).json({
    message: 'Answer Modification Successful',
    data: {}
  })
});


app.listen(PORT, HOST, () => {
  console.log(`Running on http://${HOST}:${PORT}`);
});