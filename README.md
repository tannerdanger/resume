# Dr. Marriott's Deadly Simulator

## Info

When the virtual takes over the reality...

## Codebase

This code is based on Ecmascript 2016, technically "ES7" (the official name of JavaScript the language, as JavaScript(r) is a registered trademark by Mozilla) which is a more developed version of JavaScript than pure Javascript. It is fully supported by Mozilla Firefox, Google Chrome, and recent versions of IE.

It's nice because our PlayerCharacter code now looks like this:

```Javascript
import Entity from './Entity.js'

export default class PlayableCharacter extends Entity {
    constructor(game, spritesheet) {
        ...
    }

    update() {
        super.update()
        ...
    }

    draw() {
        super.draw()
        ...
    }
}
```

## Set up

To run this project the files can't be served directly from the filesystem. The reason pure JavaScript runs from the filesystem despite it being a security risk is because of backward compatibility with older sites. Our JavaScript needs to run from a server, such as Github Pages, Tanner's server, or, convieniently, simple HTTP servers you probably already have installed.

In my opinion this is best achieved through an NPM package called `live-server`. It automatically reloads the server as changes are made.

After installing Node.js (which comes with NPM), run:

```shell
npm install live-server -g
```

This installs the package globally. Restart your command terminal and run the following command in the root project directory:

```shell
live-server
```

It should automatically open the browser to `http://localhost:8080/ which will be serving the files as if it were a hosted website.

Speaking of NPM packages, we need to use ESLint for error-checking and code linting. ESLint can act as a psuedo-compiler to help us catch code errors since our code is spread over multiple files. Sadly this doesn't come for free with VSCode, and actually has to be added as a devDependency to our project. Our project does not depend on any Node.js code, this is just for ease of development.

In the project's root directory run:

```shell
npm install
```

This will install all dependencies (devDependencies) listed in `package.json` which is currently `eslint`

Now the `ESLint 1.8.0` VSCode addon will find our `eslint` and provide intellisense and error-correction.