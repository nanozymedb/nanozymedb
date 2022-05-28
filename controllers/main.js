let path = require("path");
const Nanozyme = require("../models/Nanozyme");
const Contact = require("../models/Contact");

const excelJS = require("exceljs");
exports.getHomePage = async (req, res) => {
  let user = await req.user;
  await res.render(path.join("publicviews", "home"), { user });
  // await console.log(req.cookies);
};
exports.getUserGateway = async (req, res) => {
  // res.clearCookie("search");
  let user = await req.user;
  if (!user) {
    res.render(path.join("publicviews", "usergateway"), { user });
  } else {
    res.redirect("/dashboard");
  }
};

exports.getSearchPage = async (req, res) => {
  res.clearCookie("search");
  let user = await req.user;
  let nanozymeCount = await Nanozyme.find({approved:1});
  var perPage = 20;
  var page = req.query.page || 1;
  Nanozyme.find({ approved: 1 })
    .skip(perPage * page - perPage)
    .limit(perPage)
    .exec((err, data) => {
      Nanozyme.count().exec(async (err, count) => {
        if (err) return next(err);
        await res.render(path.join("publicviews", "searchpage"), {
          nanozymeCount,
          user,
          data: data,
          current: page,
          pages: Math.ceil(count / perPage),
        });
      });
    });
};

exports.getNanozymePage = async (req, res) => {
  const nanozymeId = await req.params.nanozymeId;
  const user = await req.user;
  const nanozyme = await Nanozyme.findById(nanozymeId);
  if (!nanozyme) {
    await res.redirect("/home");
  }
  await res.clearCookie("redirect");
  await res.render(path.join("publicviews", "nanozymeinfo"), {
    nanozyme,
    user,
  });
};

exports.getAboutPage = async (req, res) => {
  let user = await req.user;
  res.render(path.join("publicviews", "about"), { user });
};
exports.getContactPage = async (req, res) => {
  let user = await req.user;
  res.render(path.join("publicviews", "contact"), { user });
};
exports.postContactPage = async (req, res) => {
  let user = req.user;

  const { name, phone, email, message } = await req.body;
  let errors = [];
  if (!name || !email || !message) {
    errors.push({
      msg: "Please enter the required fields",
    });
  }
  if (errors.length > 0) {
    res.render(path.join("publicviews", "contact"), {
      user,
      errors,
    });
  } else {
    let newEntry = new Contact({
      name: name,
      phone: phone,
      email: email,
      message: message,
    });
    try {
      await newEntry.save();
      await req.flash(
        "success_msg",
        "Thank you for contacting us we'll be reaching you very soon!"
      );
      await res.redirect("/home");
    } catch (error) {
      console.error(error);
    }
  }
};

exports.downloadAllEntries = async (req, res) => {
  const nanozymes = await Nanozyme.find();
  const workbook = new excelJS.Workbook();
  const worksheet = workbook.addWorksheet("Nanozymes");
  // const path = "./";
  worksheet.columns = [
    { header: "S. No.", key: "s_no", width: 10 },
    { header: "Nanozyme Name/ Monomaterial", key: "nanozymeName", width: 30 },
    { header: "Enzyme Like Activity", key: "activity", width: 30 },
    { header: "pH", key: "pH", width: 30 },
    { header: "Temp (℃)", key: "temp", width: 30 },
    { header: "Substrate/Activity", key: "substrate", width: 30 },
    { header: "Kₘ (mM)", key: "km", width: 30 },
    { header: "Vmax(nM s⁻¹)", key: "vmax", width: 30 },
    { header: "kcat (s⁻¹)", key: "kcat", width: 30 },
    { header: "Additional Info/Application", key: "additionalInfo", width: 30 },
    { header: "Reference", key: "reference", width: 30 },
    { header: "DOI", key: "doi", width: 30 },
  ];
  let counter = 1;
  nanozymes.forEach((nanozyme) => {
    nanozyme.s_no = counter;
    worksheet.addRow(nanozyme);
    counter++;
  });
  worksheet.getRow(1).eachCell((cell) => {
    cell.font = { bold: true };
  });
  try {
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=" + "Nanozymes.xlsx"
    );
    workbook.xlsx.write(res).then(function (data) {
      res.end();
      // console.log("File write done........");
    });
    // const data = await workbook.xlsx
    //   .writeFile(`${path}/Nanozymes.xlsx`)
    //   .then(() => {
    //     // res.send({
    //     //   status: "success",
    //     //   message: "file successfully downloaded",
    //     //   path: `${path}/users.xlsx`,
    //     // });

    // });
  } catch (err) {
    console.error(err);
  }
};
exports.downloadSearchedEntries = async (req, res) => {
  if (req.cookies.search == undefined) {
    res.redirect("/search");
  } else {
    const { name, km, vmax, kcat, pH, temp } = await req.cookies.search;
    const filters = await req.cookies.search;
    let queryCond = {};
    queryCond = { approved: 1 };
    let filterCond = {};
    if (name) {
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

    const nanozymes = await Nanozyme.find({
      $and: [queryCond, filterCond],
    });
    const workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet("Nanozymes");
    // const path = "./";
    worksheet.columns = [
      { header: "S. No.", key: "s_no", width: 10 },
      { header: "Nanozyme Name/ Monomaterial", key: "nanozymeName", width: 30 },
      { header: "Enzyme Like Activity", key: "activity", width: 30 },
      { header: "pH", key: "pH", width: 30 },
      { header: "Temp (℃)", key: "temp", width: 30 },
      { header: "Substrate/Activity", key: "substrate", width: 30 },
      { header: "Kₘ (mM)", key: "km", width: 30 },
      { header: "Vmax(nM s⁻¹)", key: "vmax", width: 30 },
      { header: "kcat (s⁻¹)", key: "kcat", width: 30 },

      {
        header: "Additional Info/Application",
        key: "additionalInfo",
        width: 30,
      },
      { header: "Reference", key: "reference", width: 30 },
      { header: "DOI", key: "doi", width: 30 },
    ];
    let counter = 1;
    nanozymes.forEach((nanozyme) => {
      nanozyme.s_no = counter;
      worksheet.addRow(nanozyme);
      counter++;
    });
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
    });
    try {
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=" + "Nanozymes.xlsx"
      );
      workbook.xlsx.write(res).then(function (data) {
        res.end();
        // console.log("File write done........");
      });
      // const data = await workbook.xlsx
      //   .writeFile(`${path}/Nanozymes.xlsx`)
      //   .then(() => {
      //     // res.send({
      //     //   status: "success",
      //     //   message: "file successfully downloaded",
      //     //   path: `${path}/users.xlsx`,
      //     // });

      // });
    } catch (err) {
      res.send({
        status: "error",
        message: "Something went wrong",
      });
    }
  }
};
