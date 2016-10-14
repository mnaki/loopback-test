import {observable, asMap} from "mobx"

let currentUser = observable(asMap({}))

export {currentUser}
