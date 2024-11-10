export * as utils from './utils'
export * as types from './Types'
export * as tokenutil from './AccessTokenPageUtil'

export {getFreeToken} from './AccessTokenPageUtil'

// I don't get how this works yet.
export function ignoreThisFunction(x: number, y: number): number {
    return x + y;
}
