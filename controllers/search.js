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
exports.getAllResults = async (req, res) => {
  await res.clearCookie("search");
  await res.cookie(
    "search",
    {
      name: "",
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
    const { name, km, vmax, kcat, pH, temp } = await req.cookies.search;
    const filters = await req.cookies.search;
    let queryCond = {};
    queryCond = { approved: 1 };
    // let queryCond2 = {};
    let filterCond = {};
    if (name) {
      // queryCond2.nanozymeName = { $regex: `${name}`, $options: "i" };
      queryCond = { $text: { $search: name } };
    }
    if (km) {
      filterCond.km = {
        $gte: `${km.start}`,
        $lt: `${km.end}`,
      };
    }
    if (vmax) {
      filterCond.vmax = {
        $gte: `${vmax.start}`,
        $lt: `${vmax.end}`,
      };
    }
    if (kcat) {
      filterCond.kcat = {
        $gte: `${kcat.start}`,
        $lt: `${kcat.end}`,
      };
    }
    if (pH) {
      filterCond.pH = {
        $gte: `${pH.start}`,
        $lt: `${pH.end}`,
      };
    }
    if (temp) {
      filterCond.temp = {
        $gte: `${temp.start}`,
        $lt: `${temp.end}`,
      };
    }
    // let regex = new RegExp(name);
    var perPage = 20;
    var page = req.query.page || 1;
    Nanozyme.find({
      $and: [queryCond, filterCond],
    })
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
          console.log(req.cookies);
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
    tempStart,
    tempEnd,
  } = await req.body;
  let pHMax = 14;
  let vmaxMax = 11300000000;
  let kmMax = 7200;
  let kcatMax = 26000000000;
  let tempMax = 100;
  let filterCond = {};
  if (pHStart || pHEnd) {
    if (pHStart == "") {
      pHStart = 0;
    }
    if (pHEnd == "") {
      pHEnd = pHMax;
    }
    filterCond.pH = { start: pHStart, end: pHEnd };
  }
  if (tempStart || tempEnd) {
    if (tempStart == "") {
      tempStart = 0;
    }
    if (tempEnd == "") {
      tempEnd = tempMax;
    }
    filterCond.temp = { start: tempStart, end: tempEnd };
  }
  if (kmStart || kmEnd) {
    if (kmStart == "") {
      kmStart = 0;
    }
    if (kmEnd == "") {
      kmEnd = kmMax;
    }
    filterCond.km = { start: kmStart, end: kmEnd };
  }
  if (vmaxStart || vmaxEnd) {
    if (vmaxStart == "") {
      vmaxStart = 0;
    }
    if (vmaxEnd == "") {
      vmaxEnd = vmaxMax;
    }
    filterCond.vmax = { start: vmaxStart, end: vmaxEnd };
  }
  if (kcatStart || kcatEnd) {
    if (kcatStart == "") {
      kcatStart = 0;
    }
    if (kcatEnd == "") {
      kcatEnd = kcatMax;
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
