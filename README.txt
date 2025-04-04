IMPORTANT: DON'T FORGET TO IMPLEMENT THE .env FILE.
.env requires these properties:
DATABASE_URI, required
PORT, optional, defaults to 3500
TOKEN_SECRET, optional, required for user session storage.

User sessions is maintained through the express-session npm package, mapping
back to the MongoDB database through connect-mongodb-session package. The only
cookie stored is a session ID which is HTTP only.

Please check database/schema.js for data schema.
Please check the controllers folder for routes implemented.

Any JSON objects returned whose schemas have keys to other objects only have the
keys themselves as properties, the keys are never populated/replaced with the referred
objects. For actual schema returned to frontend, please check by any API testing
software (Bruno/Postman etc.)

These are the features implemented.
The features requiring user login (and admin login) are marked as below.

User signup (USER NOT LOGGED IN)
address POST /user/signup
requires JSON {name: String, email: String, password: String}

User login (USER NOT LOGGED IN)
address POST /user/login
requires JSON {email: String, password: String}

User logout (USER ACCESS)
address POST /user/logout

User info (USER ACCESS)
address GET /user | /user/me | /user/info
returns JSON object of user database

User info of another
address GET /user/<user id>
returns JSON object data of another user

Make another user admin (ADMIN ACCESS ONLY)
address PUT /user/<user id>
requires JSON {isAdmin: Boolean}

------------------------------------------------

Get all subjects
address GET /subject
returns JSON array [<subject ids>]

Search for subject
address GET /subject/search?q=<search string>
returns JSON array [<subject ids>]

Get subject info given id
address GET /subject/<subject id>
returns JSON object of subject info

Post a new subject (ADMIN ACCESS ONLY)
address POST /subject
requires JSON {name: String, description: String}
returns JSON object which includes _id property.

Delete a subject given id (ADMIN ACCESS ONLY)
address DELETE /subject/<subject id>

Update a subject given id (ADMIN ACCESS ONLY)
address PUT /subject/<subject id>
requires {description?: String}
returns JSON object having _id and description properties.

------------------------------------------------

When searching questions, 4 cases may arise, check in following order and do this:
user logged in, admin -> verification flag need not be checked.
no uploader specified, no user logged in -> return only verified questions
no uploader specified, user logged in -> return only verified questions UNION unverified questions from myself
uploader specified, user logged in and uploader == myself -> return ALL questions from myself
uploader specified, no user logged in -> return only verified questions from uploader

Get all questions, possibly filtered on subject, difficulty and uploader query parameters
Address GET /question?subject=<subject id>&difficulty=<difficulty level>&uploader=<uploader user id>
All query parameters are optional
Returns JSON array of [<question ids>] sorted on the order of net upvotes descending.

Search for a question, also possibly filtered as above
Address GET /question/search?q=<search string>&subject=<subject id>&difficulty=<difficulty level>&uploader=<uploader user id>
Only q parameter is compulsory
Returns JSON array of [<question ids>] sorted on the order of closest match, then net upvotes descending.

Get all possible difficulty levels
Address GET /question/DIFFICULTY_LEVELS
Returns JSON array of valid difficulty values.

Get question details by ID
Address GET /question/<question id>
Returns JSON object describing question, including upvote and downvote counts, and whether logged in user has upvoted or downvoted if applicable

User posts new question (USER ACCESS)
Address POST /question
Requires {
  question: String, 
  description?: String, 
  subject: <subject id>, 
  answers: [{key: Int32, text: String}],
  correctAnswerKey: Int32,
  correctAnswerExplanation?: String,
  difficulty: String
}
Returns JSON object having _id property.

User updates a question previously uploaded by themselves (USER ACCESS)
Address PUT /question/<question id>
Requires {
  description?: String, 
  subject?: <subject id>, 
  answers?: [{key: Int32, text: String}],
  correctAnswerKey?: Int32,
  correctAnswerExplanation?: String,
  difficulty?: String
}; The keys present are updated, the ones not present are left unchanged.
Returns JSON object having _id property.

User deletes a question previously uploaded by themselves (USER ACCESS)
Address DELETE /question/<question id>

Admin can verify a question (ADMIN ACCESS ONLY)
Address PUT /question/<question id>/verify
Requires JSON {verified?: Boolean}?
If body itself not present or empty, assumes verified = true.

------------------------------------------------

User upvotes a question (USER ACCESS)
address POST /voting/<question id>/upvote

User downvotes a question (USER ACCESS)
address POST /voting/<question id>/downvote

User UNvotes a question (neither upvote nor downvote) (USER ACCESS)
address DELETE /voting/<question id>

Get upvote and downvote count of a question
address GET /voting/<question id>
Returns JSON {upvoteCount: Number, downvoteCount: Number}

------------------------------------------------

Admin creates a quiz (ADMIN ACCESS ONLY)
address POST /quiz
Requires {
  name: String,
  questions: [<question id>],
  isPublic?: Boolean (default false)
}; questions array can be empty but must be present.
Returns JSON object containing _id property.

Admin updates a quiz (ADMIN ACCESS ONLY)
address PUT /quiz/<quiz id>
Requires {
  questions?: [<question ids>],
  isPublic?: Boolean, default false
}; Updates only those properties which were sent in the request body.
Returns JSON object containing _id property.

Admin can delete a quiz (ADMIN ACCESS ONLY)
address DELETE /quiz/<quiz id>

Admin can add a VERIFIED question to a quiz (ADMIN ACCESS ONLY)
address POST /quiz/<quiz id>/questions/<question id>

Admin can delete a question from a quiz (ADMIN ACCESS ONLY)
address DELETE /quiz/<quiz id>/questions/<question id>

Get all quiz IDs, sorted in order of name
Address GET /quiz
Returns JSON array [<quiz ids>]

Search for quiz by name
Address GET /quiz/search?q=<search string>
Query parameters are compulsory
Returns JSON array [<quiz ids>]

Get quiz details given ID
Address GET /quiz/<quiz id>
Returns JSON object describing quiz

------------------------------------------------

Get all of my quiz attempts, optionally for a specific quiz, sorted by created latest first (USER ACCESS)
Address GET /attempt?quiz_id=<quiz id>
Query parameters are optional here
Returns JSON array [<attempt ids>]

Get attempt details by ID (USER ACCESS)
Address GET /attempt/<attempt id>
Returns JSON object of attempt details, also including which answers were answered correctly/incorrectly,
total number of correct, incorrect and unanswered questions from the "parent" quiz

Post a new attempt (USER ACCESS)
Address POST /attempt
Requires JSON {
  quiz: <quiz id>,
  answers: [
    {
      question: <question id>,
      answerKey: <answer key integer, Int32>
    }
  ]
}; answers array may be empty but must be present
Returns JSON object containing _id property

Post an answer to a question in a quiz attempt (USER ACCESS)
Address POST /attempt/<attempt id>/answers/<question id>
Requires JSON {answerKey: <answer key integer, Int32>}

Delete an answer to a question in a quiz attempt (USER ACCESS)
Address DELETE /attempt/<attempt id>/answers/<question id>

Delete entire attempt
Address DELETE /attempt/<attempt id>