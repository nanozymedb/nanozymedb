const Nanozyme = require("../models/Nanozyme");
const path = require("path");
exports.postSearchResults = async (req, res) => {
  await res.clearCookie("search");
  await res.cookie(
    "search",
    {
      name: req.body.nanozymeName,
    },
    { maxAge: 1800000 }
  );
  await res.redirect("/search_result");
};
exports.getSearchResults = async (req, res) => {
  if (req.cookies.search == undefined) {
    res.redirect("/search");
  } else {
    console.log(req.cookies);
    let user = await req.user;
    const { name, km, vmax, kcat, pH } = await req.cookies.search;
    const filters = await req.cookies.search;
    let queryCond = {};
    if (name) {
      queryCond.searchTags = { $regex: `${name}`, $options: "i" };
    }
    if (km) {
      queryCond.km = {
        $gte: `${km.start}`,
        $lt: `${km.end}`,
      };
    }
    if (vmax) {
      queryCond.vmax = {
        $gte: `${vmax.start}`,
        $lt: `${vmax.end}`,
      };
    }
    if (kcat) {
      queryCond.kcat = {
        $gte: `${kcat.start}`,
        $lt: `${kcat.end}`,
      };
    }
    if (pH) {
      queryCond.pH = {
        $gte: `${pH.start}`,
        $lt: `${pH.end}`,
      };
    }
    // let regex = new RegExp(name);
    var perPage = 20;
    var page = req.query.page || 1;
    Nanozyme.find(queryCond)
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec((err, data) => {
        Nanozyme.count().exec(async (err, count) => {
          if (err) return next(err);
          await res.render(path.join("publicviews", "searchresults"), {
            user,
            filters,
            name: name,
            data: data,
            current: page,
            pages: Math.ceil(count / perPage),
          });
        });
      });
  }
};
exports.filterSearchResults = async (req, res) => {
  const {
    kmStart,
    kmEnd,
    vmaxStart,
    vmaxEnd,
    kcatStart,
    kcatEnd,
    pHStart,
    pHEnd,
  } = req.body;
  let filterCond = {};
  if (kmStart || kmEnd) {
    // await res.cookie(
    //   "search",
    //   {
    //     km: { start: kmStart, end: kmEnd },
    //   },
    //   { maxAge: 1800000 }
    // );
    filterCond.km = { start: kmStart, end: kmEnd };
  }
  if (vmaxStart || vmaxEnd) {
    // await res.cookie(
    //   "search",
    //   {
    //     vmax: { start: vmaxStart, end: vmaxEnd },
    //   },
    //   { maxAge: 1800000 }
    // );
    filterCond.vmax = { start: vmaxStart, end: vmaxEnd };
  }
  if (kcatStart || kcatEnd) {
    // await res.cookie(
    //   "search",
    //   {
    //     kcat: { start: kcatStart, end: kcatEnd },
    //   },
    //   { maxAge: 1800000 }
    // );
    filterCond.kcat = { start: kcatStart, end: kcatEnd };
  }
  if (pHStart || pHEnd) {
    // await res.cookie(
    //   "search",
    //   {
    //     pH: { start: pHStart, end: pHEnd },
    //   },
    //   { maxAge: 1800000 }
    // );
    filterCond.pH = { start: pHStart, end: pHEnd };
  }
  if (req.cookies.search.name) {
    // await res.cookie(
    //   "search",
    //   {
    //     name: req.cookies.search.name,
    //   },
    //   { maxAge: 1800000 }
    // );
    filterCond.name = req.cookies.search.name;
  }
  await res.cookie("search", filterCond);
  await res.redirect("/search_result");
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
