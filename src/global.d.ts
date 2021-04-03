export const SERVER_NAME = 'https://sync.accongbox.com';

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