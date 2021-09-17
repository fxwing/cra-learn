/*
 * @Description:
 * @Author:
 * @Date: 2021-09-17 11:23:58
 * @LastEditTime: 2021-09-17 11:38:11
 * @LastEditors: 冯雄伟
 * @Usage:
 */

const chalk = require("chalk");
const { Command } = require("commander");
// console.log(process.argv) // 命令行参数
const program = new Command();
program
  .version("1.0.0")
  .arguments("<must1> <must2> [option1] [option2]") // <>是必填 []选填  设置命令行参数
  .usage(chalk.green('这是一个帮助提示文档')) // 执行--help时展示
  .action((must1, must2, option1, option2) => {
    console.log(must1, must2, option1, option2);
  })
  .parse(process.argv);
