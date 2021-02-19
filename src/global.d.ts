//글로벌 변수
declare namespace NodeJS{
    export interface Global {
        key: string
        name: string
        syncInfo: any
    }
}