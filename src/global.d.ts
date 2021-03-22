export const SERVER_NAME = 'http://192.168.0.15:8080';

export {};
//글로벌 변수
declare global{
    namespace NodeJS{
        interface Global {
            idx: number
            key: string
            name: string
            syncInfo: {token: string, roomId: string}
        }
    }
}