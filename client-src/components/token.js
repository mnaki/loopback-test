import {observable, asMap} from "mobx"

let currentToken = observable(asMap({}))

export {currentToken}