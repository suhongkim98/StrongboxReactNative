export {};
//글로벌 변수
declare global{
    namespace NodeJS{
        interface Global {
            key: string
            name: string
            syncInfo: {token: string, roomId: string}
        }
    }
}
