const Nanozyme = require("../models/Nanozyme");
const path = require("path");
exports.postSearchResults = async (req, res) => {
  res.clearCookie();
  res.cookie("search", { name: req.body.nanozymeName }, { maxAge: 1800000 });
  console.log(req.cookies)
  await res.redirect("/search_result");
};
exports.getSearchResults = async (req, res) => {
  if (req.cookies.search == undefined) {
    res.redirect("/search");
  } else {
    let user = await req.user;
    const { name } = req.cookies.search;
    // let regex = new RegExp(name);
    var perPage = 20;
    var page = req.query.page || 1;
    Nanozyme.find({
      $or: [
        {
          searchTags: { $regex: `${name}`, $options: 'i'},
          // activity: { $regex: `${name}`, $options: 'i'  },
        },
      ],
      // name: regex,
    })
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec((err, data) => {
        Nanozyme.count().exec((err, count) => {
          if (err) return next(err);
          // data.length == 0
          //   ? res.json("Not found")
          //   :
          res.render(path.join("publicviews", "searchresults"), {
            user,
            name: name,
            data: data,
            current: page,
            pages: Math.ceil(count / perPage),
          });
          // https://evdokimovm.github.io/javascript/nodejs/mongodb/pagination/expressjs/ejs/bootstrap/2017/08/20/create-pagination-with-nodejs-mongodb-express-and-ejs-step-by-step-from-scratch.html
        });
      });
  }
};
// exports.getSearchResults = async (req, res) => {
//   const { name } = req.query;
//   // let regex = new RegExp(name, "i");

//   Nanozyme.find(
//     {
//       $or: [{ nanozymeName: { $regex: `${name}` } }],
//       // nanozymeName: regex,
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
