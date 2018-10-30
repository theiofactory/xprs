# Express CLI

**CLI for working with express**

## Installation

First, if you have not done so already, install [Homebrew](http://brew.sh/):

```bash
$ /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

Next, install [Node.js](https://nodejs.org/en/):

```bash
$ brew install node
# Tip! Run this on a regular basis:
$ brew doctor && brew update && brew upgrade && brew cleanup && brew prune && brew doctor
```

Once the above steps are complete, and your system is happy …

### Installation process

```bash
$ git clone https://github.com/theiofactory.in/xprs
$ cd xprs
$ npm install
# or
$ npm i
```

## Usage

Activate in current directory:

```bash
$ cd xprs
$ sudo npm link
```

Get help:

```bash
$ xprs
```

New Project:
```bash
$ xprs new <projectName>
```

Create Components:
- Route
```bash
$ xprs create route <routeName>
$ xprs create route <routeName>.<subRouteName>
```
- Controller
```bash
$ xprs create controller <controllerName>
$ xprs create controller <controllerName>.<controllerName>
```

- Handler
```bash
$ xprs create handler <handlerName>
```

- Middleware
```bash
$ xprs create middlewate <middlewareName>
```

- Model
```bash
$ xprs create model <modelName>
```

- Swagger
```bash
$ xprs create swagger <swaggerType> <destination> <destinationFileName>
# Allowed swaggerTypes
    - path
    - definition
    - component
    - securityDefinition
    - tag
# Allowed destinations
    - route
    - controller
    - handler
    - middleware
```
