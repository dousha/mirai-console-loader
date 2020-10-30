/*
 *
 * Mirai Console Loader
 *
 * Copyright (C) 2020 iTX Technologies
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * @author PeratX
 * @website https://github.com/iTXTech/mirai-console-loader
 *
 */

importPackage(java.io);
importPackage(java.lang);
importPackage(org.itxtech.mcl);
importPackage(org.itxtech.mcl.component);
importPackage(org.apache.commons.cli);

let group = new OptionGroup();
group.addOption(Option.builder("b").desc("Show Mirai Console boot properties")
    .longOpt("show-boot-props").build());
group.addOption(Option.builder("f").desc("Set Mirai Console boot entry")
    .longOpt("set-boot-entry").hasArg().argName("EntryClass").build());
group.addOption(Option.builder("g").desc("Set Mirai Console boot arguments")
    .longOpt("set-boot-args").optionalArg(true).hasArg().argName("Arguments").build());
group.addOption(Option.builder("z").desc("Only download libraries without running them")
    .longOpt("dry-run").build());
loader.options.addOptionGroup(group);

phase.cli = () => {
    if (loader.cli.hasOption("b")) {
        logger.info("Mirai Console boot entry: " + getBootEntry());
        logger.info("Mirai Console boot arguments: " + getBootArgs());
        System.exit(0);
    }
    if (loader.cli.hasOption("f")) {
        loader.config.scriptProps.put("boot.entry", loader.cli.getOptionValue("f"));
        loader.saveConfig();
    }
    if (loader.cli.hasOption("g")) {
        loader.config.scriptProps.put("boot.args", loader.cli.getOptionValue("g", ""));
        loader.saveConfig();
    }
}

function getBootEntry() {
    return loader.config.scriptProps.getOrDefault("boot.entry", "net.mamoe.mirai.console.terminal.MiraiConsoleTerminalLoader");
}

function getBootArgs() {
    return loader.config.scriptProps.getOrDefault("boot.args", "");
}

phase.boot = () => {
    let files = [];
    let pkgs = loader.config.packages;
    for (let i in pkgs) {
        let pkg = pkgs[i];
        if (pkg.type.equals(Config.Package.TYPE_CORE)) {
            files.push(new File(new File(pkg.type), pkg.getName() + "-" + pkg.version + ".jar"));
        }
    }
    
    if (!loader.cli.hasOption("z")) {
        Utility.bootMirai(files, getBootEntry(), getBootArgs());
    }
}
