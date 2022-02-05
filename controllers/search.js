const nanozymeSchema = require("../models/Nanozyme");
exports.getSearchResults = async (req, res) => {
  const { name, pmid } = req.cookies.search;
  nanozymeSchema.find(
    {
      $or: [{ name: { $regex: `${name}` } }, { pmid: { $regex: `${pmid}` } }],
    },
    (err, data) => {
      if (err) {
        console.log(err);
      } else {
        res.json(data);
      }
    }
  );
};
exports.postSearchResults = async (req, res) => {
  res.clearCookie();
  res.cookie("search", {name: req.body.name, pmid: req.body.pmid});
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