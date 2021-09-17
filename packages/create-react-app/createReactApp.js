/*
 * @Description:
 * @Author:
 * @Date: 2021-09-17 11:40:57
 * @LastEditTime: 2021-09-17 16:47:05
 * @LastEditors: 冯雄伟
 * @Usage:
 */
const path = require("path");
const chalk = require("chalk");
const { Command } = require("commander");
const fs = require("fs-extra");
const packageJSon = require("./package.json");
const spawn = require("cross-spawn");
const { resolve } = require("path");
async function init() {
  let projectName;
  const { name, version } = packageJSon;
  new Command(name)
    .version(version)
    .arguments("<project-directory>")
    .usage(chalk.green("project-directory>"))
    .action((name) => {
      projectName = name;
    })
    .parse(process.argv);
  console.log(projectName);
  await createApp(projectName);
}
async function createApp(appName) {
  const originalDirectory = process.cwd(); // 原始命令行的工作目录
  const root = path.resolve(appName);
  fs.ensureDirSync(appName); // 确保文件夹  没有的话创建一个
  console.log(
    `${chalk.yellow(`创建一个文件${appName}在${originalDirectory}`)}`
  );
  const packageJSon = {
    name: appName,
    version: "0.1.0",
    private: true,
  };
  fs.writeFileSync(
    path.join(root, "package.json"),
    JSON.stringify(packageJSon, null, 2)
  );
  process.chdir(root);
  console.log("appName", appName);
  console.log("originalDirectory", originalDirectory);
  console.log("root", root);
  run(root, appName, originalDirectory);
}
/**
 *
 *
 * @param {*} root 创建项目的目录  D:\fxw\cra2\app
 * @param {*} appName app
 * @param {*} originalDirectory 原来的工作目录 D:\fxw\cra2
 */
async function run(root, appName, originalDirectory) {
  let scriptsName = "react-scripts";
  let templateName = "cra-template";
  const allDependencies = ["react", "react-dom", scriptsName, templateName];
  console.log(`${chalk.yellow("下载依赖包，可能需要一段时间")}`);
  console.log(
    `开始下载${chalk.cyan(`react,react-dom,${scriptsName},${templateName}`)}`
  );
  await install(root, allDependencies);
  //  项目根目录 项目名字 verbose是否展示详细信息 原始目录  模板名字
  let data = [root, appName, true, originalDirectory, templateName];
  const source = `
  var init  = require("react-scripts/scripts/init.js");
  init.apply(null,JSON.parse(process.argv[1]));
  `;
  await executeNodeScript({ cwd: process.cwd() }, data, source);
  console.log('done');
  process.exit(0);  // 中止进程
}

async function install(root, allDependeccies) {
  return new Promise((resolve) => {
    const command = "yarn";
    const argus = ["add", "--exact", ...allDependeccies, "--cwd", root];
    const child = spawn(command, argus, { stdio: "inherit" });
    child.on("close", resolve);
  });
}

async function executeNodeScript({ cwd }, data, source) {
  return new Promise((resolve) => {
    const child = spawn(
      process.execPath, // 'node'
      ["-e", source, "--", JSON.stringify(data)],
      {
        cwd,
        stdio: "inherit", //输出在一个cmd中
      }
    );
    child.on("close", resolve);
  });
}

module.exports = {
  init,
};
