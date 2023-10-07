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
import nodemailer from 'nodemailer';
import Mailgen from 'mailgen';
import cors from 'cors';
dotenvSafe.config()

const { APP_PORT, APP_HOST, MAIL_EMAIL, MAIL_USER, MAIL_PASSWORD } = process.env

// Constants
const PORT = APP_PORT ?? 8080;
const HOST = APP_HOST ?? '0.0.0.0';

// App
const app = express();

app.use(helmet())
app.use(cors())
app.disable('x-powered-by')
app.use(cookieParser())
app.use(bodyParser.json({ type: 'application/json' }))
app.use(dbMiddleware())
app.post('/auth', async (req, res) => {
  const db = req.db

  const user = await fetchUser(req.body.email, req.body.password, db)
  if (!user) {
    return res.status(400).json({
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

app.post('/auth/refresh', async (req, res) => {
  const refreshToken = req.cookies['refreshToken'];
  if (!refreshToken) {
    return res.status(401).send('Access Denied. No refresh token provided.');
  }

  try {
    const { exp, ...user } = jwt.verify(refreshToken, process.env.AUTH_TOKEN_SECRET);
    const latestUserDetail = (await req.db
      .select('id', 'email', 'password', 'age', 'gender', 'isAdmin', 'symptom', 'answer')
      .from('Users')
      .where('email', user.email))[0]
    const accessToken = jwt.sign(latestUserDetail, process.env.AUTH_TOKEN_SECRET, { expiresIn: process.env.AUTH_ACCESS_TOKEN_EXPIRATION });
    return res
      .header('Authorization', accessToken)
      .send({
        message: 'Access Token Refreshed Sucessfuly',
        data: { exp, ...latestUserDetail }
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
app.get('/questionnaires/available', async (req, res) => {
  const questionniare = (await _db(req).select('id', 'title', 'description', 'questions', 'createdAt', 'updatedAt', 'archivedAt').from('Questionnaires').whereNull('archivedAt'))[0]
  if (questionniare?.id) {
    const answeredQuestionniare = (await _db(req).select('id', 'userId', 'questionnaireId', 'answers').from('UserQuestionnaires').where('userId', req.user?.id).andWhere('questionnaireId', questionniare.id))[0]
    if (answeredQuestionniare?.id) {
      questionniare.isAnsweredByCurrentUser = true
      questionniare.currentUserAnswer = answeredQuestionniare.answers
    }
  }
  return res.status(200).json({
    message: 'Available Questionnaire Fetching Successful',
    data: questionniare
  })
});
app.get('/questionnaires/:id', async (req, res) => {
  const questionnaireId = req.params?.id
  const questionniare = (await _db(req).select('id', 'title', 'description', 'questions', 'createdAt', 'updatedAt', 'archivedAt').from('Questionnaires').where('id', questionnaireId))[0]
  if (questionniare?.id) {
    const answeredQuestionniare = (await _db(req).select('id', 'userId', 'questionnaireId', 'answers').from('UserQuestionnaires').where('userId', req.user?.id).andWhere('questionnaireId', questionniare.id))[0]
    if (answeredQuestionniare?.id) {
      questionniare.isAnsweredByCurrentUser = true
    }
  }

  return res.status(200).json({
    message: 'Questionnaire Fetching Successful',
    data: questionniare ?? {}
  })
});
app.post('/questionnaires/create', async (req, res) => {
  if (!req.user?.isAdmin) {
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

  // check: only one restored questionnaire should exist, if exists, archive the new creation
  const restoredQuestionnaires = await _db(req)('Questionnaires').select('id').whereNull('archivedAt')
  if (restoredQuestionnaires.length > 0) {
    createPayload.archivedAt = new Date()
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
  if (!req.user?.isAdmin) {
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
app.post('/questionnaires/archive/:id', async (req, res) => {
  if (!req.user?.isAdmin) {
    return res.status(403).json({
      error: 'Forbidden'
    })
  }

  const questionnaireId = req.params?.id
  const archivePayload = {
    archivedAt: new Date(),
    updatedAt: new Date()
  }
  const archiveQuestionnaire = await _db(req)('Questionnaires').update({ ...archivePayload }, ['id']).where('id', questionnaireId)
  if (archiveQuestionnaire.rowCount <= 0) {
    return res.status(400).json({
      error: 'Archival of questionnaire failed'
    })
  }
  return res.status(200).json({
    message: 'Questionnaire Archival Successful',
    data: {}
  })
});
app.post('/questionnaires/restore/:id', async (req, res) => {
  if (!req.user?.isAdmin) {
    return res.status(403).json({
      error: 'Forbidden'
    })
  }

  const questionnaireId = req.params?.id
  const restorePayload = {
    archivedAt: null,
    updatedAt: new Date()
  }
  // check: only one restored questionnaire should exist
  const restoredQuestionnaires = await _db(req)('Questionnaires').select('id').whereNull('archivedAt')
  if (restoredQuestionnaires.length > 0) {
    return res.status(400).json({
      error: 'A restored questionnaire already exist. Only one restored questionnaire should exist'
    })
  }
  const restoreQuestionnaire = await _db(req)('Questionnaires').update({ ...restorePayload }, ['id']).where('id', questionnaireId)
  if (restoreQuestionnaire.rowCount <= 0) {
    return res.status(400).json({
      error: 'Restoration of questionnaire failed'
    })
  }
  return res.status(200).json({
    message: 'Questionnaire Restoration Successful',
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
app.get('/admin/students', async (req, res) => {
  if (!req.user?.isAdmin) {
    return res.status(403).json({
      error: 'Forbidden'
    })
  }

  const students = await _db(req).select('id', 'email', 'age', 'gender', 'isAdmin', 'symptom', 'answer').from('Users').whereNotNull('symptom').andWhereNot('symptom', 'minimal')
  const mappedStudents = students.map(student => {
    student.totalScore = student?.answer.reduce((acc, cur) => acc + cur, 0)
    return student
  })
  const sortedStudent = mappedStudents.sort((prev, cur) => prev.totalScore + cur.totalScore)

  return res.status(200).json({
    message: 'Students Fetching Successful',
    data: sortedStudent
  })
});
app.get('/admin/student/:id', async (req, res) => {
  if (!req.user?.isAdmin) {
    return res.status(403).json({
      error: 'Forbidden'
    })
  }

  const student = (await _db(req).select('id', 'email', 'age', 'gender', 'isAdmin', 'symptom', 'answer').from('Users').where('id', req.params?.id ?? null))[0]

  return res.status(200).json({
    message: 'Student Fetching Successful',
    data: student ?? {}
  })
});
app.post('/student/saveAnswer', async (req, res) => {
  const { answer = [] } = req.body

  // map answer to PHQ symptom
  let symptom = ''
  const totalScore = answer.reduce((acc, cur) => acc + cur, 0)
  if (totalScore === 0 || totalScore <= 4) symptom = 'minimal'
  else if (totalScore === 5 || totalScore <= 9) symptom = 'mild'
  else if (totalScore === 10 || totalScore <= 14) symptom = 'moderate'
  else if (totalScore === 15 || totalScore <= 19) symptom = 'moderately severe'
  else if (totalScore === 20 || totalScore <= 27) symptom = 'severe'

  const payload = {
    answer,
    symptom,
    updatedAt: new Date()
  }

  const saveAnswer = await _db(req)('Users').update({ ...payload }, ['id']).where('id', req?.user?.id ?? null)

  return res.status(200).json({
    message: 'Save Answer Successful',
    data: saveAnswer ?? null
  })
});
app.post('/admin/student/notifyForCounseling/:id', async (req, res) => {
  if (!req.user?.isAdmin) {
    return res.status(403).json({
      error: 'Forbidden'
    })
  }

  const student = (await _db(req).select('id', 'email', 'age', 'gender', 'isAdmin', 'symptom', 'answer').from('Users').where('id', req.params?.id ?? null))[0]

  const transporter = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: MAIL_USER, // generated mailtrap user
      pass: MAIL_PASSWORD, // generated mailtrap password
    }
  })

  const MailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Depression Counseling",
      link: '#'
    }
  })

  const email = {
    body: {      
      signature: ' ',
      name: 'Student',
      intro: 'You are being notified for your counseling after you submitted your PHQ-9 depression questionnaire. Please go the school counselor\'s office within this week',
      outro: 'If you have further inquiries, you can contact your administrator.'
    }
  }
  const emailBody = MailGenerator.generate(email);
  // send mail with defined transport object
  const mailOptions = {
    from: req.user.email,
    to: student.email,
    subject: 'Depression Counseling',
    html: emailBody
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).send('Error sending email');
    } else {
      console.log('Email sent: ' + info.response);
      return res.status(200).json({
        message: 'Counseling notification sent successfully'
      })
    }
  })
})

app.listen(PORT, HOST, () => {
  console.log(`Running on http://${HOST}:${PORT}`);
});