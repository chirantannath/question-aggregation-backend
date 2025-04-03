Please check the controllers folder for routes implemented.

These are the routes I implemented:

//POST /user/signup
//POST /user/login
//POST /user/logout
//GET /user/(me|info)?
//GET /user/:id

//GET /subject/:id
//GET /subject/search?q=<search string>
//GET /subject
//POST /subject
//DELETE /subject/:id
//PUT /subject/:id

//GET /question/:id
//q is compulsory below
//GET /question/search?q=<search string>&subject=<subject id>&difficulty=<difficulty level>&uploader=<uploader id>
//No parameter is compulsory below
//GET /question?subject=<subject id>&difficulty=<difficulty level>&uploader=<uploader id>
//POST /question
//DELETE /question/:id
//PUT /question/:id
//PUT /question/:id/verify

//Questions SHOULD be ranked by default on basis of search score (closest string)
//and net number of upvotes. Please check this

//POST /voting/:question_id/upvote
//POST /voting/:question_id/downvote
//DELETE /voting/:question_id
//GET /voting/:question_id
