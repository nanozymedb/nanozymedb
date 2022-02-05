const nanozymeSchema = require("../models/Nanozyme");
exports.getSearchResults = async (req, res) => {
  const { name, pmid } = req.cookies.search;
  var perPage = 20;
  var page = req.query.page || 1;
  nanozymeSchema
    .find(
      {
        $or: [{ name: { $regex: `${name}` } }, { pmid: { $regex: `${pmid}` } }],
      },
      // (err) => {
      //   if (err) {
      //     console.log(err);
      //   }
      // }
    )
    .skip(perPage * page - perPage)
    .limit(perPage)
    .exec((err, data) => {
      nanozymeSchema.count().exec((err, count) => {
        if (err) return next(err);
        res.json([data, count]);
        // https://evdokimovm.github.io/javascript/nodejs/mongodb/pagination/expressjs/ejs/bootstrap/2017/08/20/create-pagination-with-nodejs-mongodb-express-and-ejs-step-by-step-from-scratch.html
      });
    });
};
exports.postSearchResults = async (req, res) => {
  res.clearCookie();
  res.cookie("search", { name: req.body.name, pmid: req.body.pmid });
  // res.redirect("/search_result")
  res.json("created");
};

// exports.getSearchResults = async (req, res) => {
//   const { name, pmid } = req.query;
//   nanozymeSchema.find(
//     {
//       $or: [{ name: { $regex: `${name}` } }, { pmid: { $regex: `${pmid}` } }],
//     },
//     (err, data) => {
//       if (err) {
//         console.log(err);
//       } else {
//         res.json(data);
//       }
//     }
//   );
// };
