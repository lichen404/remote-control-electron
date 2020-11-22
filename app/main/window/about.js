const openAboutWindow = require('about-window').default
const path = require('path')

const create = () => {

    openAboutWindow({
        icon_path: path.join(__dirname, 'icon.png'),
        package_json_dir: path.resolve(__dirname + '/../../../'),
        copyright: "Copyright (c) 2020 lichen",
        homepage: 'https://github.com/lichen404/remote-control-electron'
    })
}
module.exports = {create}
