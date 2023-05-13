//https://juhanajauhiainen.com/posts/how-test-electron-apps-with-spectron-and-testing-library

import { Application } from "spectron"
import path from "path"
const app = new Application({
    path: path.join(
        process.cwd(),
        "out/storyline-darwin-x64/electron-spectron-example.app/Contents/MacOS/storyline"
    ),
})