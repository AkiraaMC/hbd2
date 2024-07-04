const axios = require("axios").default;
const path = require("path");
const fs = require("fs");
const setPic = require("./getPic");
const genIndex = require("./genIndex");
const {
  generateMarkupLocal,
  generateMarkupRemote,
} = require("./generateMarkup");

require("dotenv").config();

## for Local Build

# Mandatory Vars

NAME='PIYUUU'
## Name of receiver

PIC='https://www.google.com/search?client=ms-android-xiaomi-terr1-rso2&sca_esv=5ab8962a38650a00&sxsrf=ADLYWIJYLWleQ4IGtaS3sbpp0hW0aEqBRg:1720064453148&q=foto+gemoy&udm=2&fbs=AEQNm0CvspUPonaF8UH5s_LBD3JPX4RSeMPt9v8oIaeGMh2T2D1DyqhnuPxLgMgOaYPYX7OtOF4SxbM4YPsyWUMdeXRPZhCDnq-5Z-yoSNSuzzuqe-AJEcgubqbZZMyt_grANnsjG430usNqxcfNkddhKrAc7ZdUqqRTe-LY6ueoAHENlT69FE4GZz5taUYsEQezNmmRFXnASP-Ran4mbpidC5JNYU_oow&sa=X&sqi=2&ved=2ahUKEwjLseG1u4yHAxWiwjgGHdLwBWsQtKgLegQIEhAB&biw=407&bih=798&dpr=3#vhid=oiZzF5lOwP-JgM&vssid=mosaic'
## Name of image file

# Optional Vars -- Do not add these vars to your env if you dont want to use them

NICKNAME='PIYUUU'
## A Nickname for more personalization

HBD_MSG='HBD'
## Custom HBD Greeting message

SCROLL_MSG='https://telegra.ph/HAPPY-BIRTHDAY-07-04-40'
## Name of the Scroll Message txt file

OPEN_DATE='2024-08-14'
## Active Date in YYYY-MM-DD format

if (!process.env.NAME) throw new Error("Please specify NAME in environment.");
if (!process.env.PIC) throw new Error("Please specify PIC in environment.");

const picPath = process.env.PIC;
const msgPath = process.env.SCROLL_MSG;

//Local initialization
const setLocalData = async () => {
  try {
    const pic = path.join(__dirname, "../local/", picPath);
    let markup = "";
    if (msgPath) {
      const text = fs.readFileSync(path.join(__dirname, "../local/", msgPath), {
        encoding: "utf-8",
      });
      markup = generateMarkupLocal(text);
    }
    await setPic(pic);
    genIndex(markup);
  } catch (e) {
    throw new Error(e.message);
  }
};

//Remote initialization
const setRemoteData = async () => {
  try {
    let res = await axios.get(picPath, {
      responseType: "arraybuffer",
    });
    const pic = res.data;
    let markup = "";
    if (msgPath) {
      const article = msgPath.split("/").pop();
      res = await axios.get(
        `https://api.telegra.ph/getPage/${article}?return_content=true`
      );
      const { content } = res.data.result;
      markup = content.reduce(
        (string, node) => string + generateMarkupRemote(node),
        ""
      );
    }
    await setPic(pic);
    genIndex(markup);
  } catch (e) {
    throw new Error(e.message);
  }
};

if (process.argv[2] === "--local") setLocalData();
else if (process.argv[2] === "--remote") setRemoteData();
else console.log("Fetch mode not specified.");
