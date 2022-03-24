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
    // console.log(req.cookies);
    let user = await req.user;
    const { name, km, vmax, kcat, pH } = await req.cookies.search;
    const filters = await req.cookies.search;
    let queryCond = {};
    if (name) {
      // queryCond.searchTags = { $regex: `${name}`, $options: "i" };
      queryCond = { $text: { $search: name } };
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
          res.render(path.join("publicviews", "searchresults"), {
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
  let {
    kmStart,
    kmEnd,
    vmaxStart,
    vmaxEnd,
    kcatStart,
    kcatEnd,
    pHStart,
    pHEnd,
  } = await req.body;
  let pHMax = 14;
  let vmaxMax = await 11300000000;
  let kmMax = await 7200;
  let kcatMax = await 26000000000;

  let filterCond = {};
  if (pHStart || pHEnd) {
    if (pHStart == "") {
      pHStart = await 0;
    }
    if (pHEnd == "") {
      pHEnd = await pHMax;
    }
    filterCond.pH = { start: pHStart, end: pHEnd };
  }
  if (kmStart || kmEnd) {
    if (kmStart == "") {
      kmStart = await 0;
    }
    if (kmEnd == "") {
      kmEnd = await kmMax;
    }
    filterCond.km = { start: kmStart, end: kmEnd };
  }
  if (vmaxStart || vmaxEnd) {
    if (vmaxStart == "") {
      vmaxStart = await 0;
    }
    if (vmaxEnd == "") {
      vmaxEnd = await vmaxMax;
    }
    filterCond.vmax = { start: vmaxStart, end: vmaxEnd };
  }
  if (kcatStart || kcatEnd) {
    if (kcatStart == "") {
      kcatStart = await 0;
    }
    if (kcatEnd == "") {
      kcatEnd = await kcatMax;
    }
    filterCond.kcat = { start: kcatStart, end: kcatEnd };
  }

  if (req.cookies.search.name) {
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
exports.removeFilters = async (req, res) => {
  const { name } = await req.cookies.search;
  await res.clearCookie("search");
  await res.cookie(
    "search",
    {
      name: name,
    },
    { maxAge: 1800000 }
  );
  await res.redirect("/search_result");
};
